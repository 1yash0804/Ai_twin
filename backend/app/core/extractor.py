import json
import sqlite3
import os
from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional
import openai

# ================= CONFIG =================
# Local Ollama OpenAI-compatible API
client = openai.OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # dummy key required
)

DB_PATH = "../database.db"

# ================= DATA MODELS =================
class ExtractedTask(BaseModel):
    description: str = Field(..., description="The actual task to be done")
    due_date: Optional[str] = Field(None, description="ISO date or 'next friday' if mentioned")
    priority: str = Field("medium", description="low, medium, or high")

class ExtractedFact(BaseModel):
    content: str = Field(..., description="A permanent fact about the user or contact")
    category: str = Field("general", description="family, work, preference, or general")

class AnalysisResult(BaseModel):
    tasks: List[ExtractedTask] = []
    facts: List[ExtractedFact] = []

# ================= CORE LOGIC =================
def extract_and_save(user_id: str, message_text: str, source: str = "chat"):
    """
    The main function called by BackgroundTasks.
    It silently analyzes the message and updates the DB.
    """
    print(f"🕵️‍♂️ Extractor analyzing: '{message_text}'")

    # 1. Ask the LLM to extract data
    try:
        extraction = analyze_text_with_llm(message_text)
    except Exception as e:
        print(f"❌ Extraction failed: {e}")
        return

    # 2. Save Tasks to SQLite
    if extraction.tasks:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        for task in extraction.tasks:
            print(f"   📝 Found Task: {task.description} (Due: {task.due_date})")
            cursor.execute(
                """
                INSERT INTO tasks (user_id, description, status, due_date, source, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    user_id,
                    task.description,
                    "pending",
                    task.due_date,
                    source,
                    datetime.now()
                )
            )
        conn.commit()
        conn.close()

    # 3. Save Facts to Pinecone (via your RAG pipeline)
    if extraction.facts:
        from app.core.rag import save_fact_to_pinecone
        for fact in extraction.facts:
            print(f"   🧠 Found Fact: {fact.content}")
            fact_text = f"[{fact.category.upper()}] {fact.content}"
            save_fact_to_pinecone(fact_text, source=source)

def analyze_text_with_llm(text: str) -> AnalysisResult:
    """
    Sends text to local LLM (Ollama) and enforces strict JSON output.
    """
    system_prompt = """
    You are a silent personal secretary. Analyze the user's message.

    1. EXTRACT TASKS: Any explicit request to do something (remind me, I need to, buy, call).
    2. EXTRACT FACTS: Any permanent information about the user or their friends (likes, dislikes, location, job).

    Return ONLY valid JSON.
    Do not add explanations.
    Do not add text before or after the JSON.

    Format:
    {
      "tasks": [{"description": "...", "due_date": "...", "priority": "..."}],
      "facts": [{"content": "...", "category": "..."}]
    }

    If nothing found, return empty arrays.
    """

    response = client.chat.completions.create(
        model="phi3",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ],
        temperature=0,
        response_format={"type": "json_object"}
    )

    data = json.loads(response.choices[0].message.content)
    return AnalysisResult(**data)
