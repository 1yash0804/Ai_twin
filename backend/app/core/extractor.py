import json
import sqlite3
import os
from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional

# ================= CONFIG =================
DB_PATH = "../database.db"


def _get_openai_client():
    import openai

    return openai.OpenAI(
        base_url="http://localhost:11434/v1",
        api_key="ollama",
    )


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
from sqlmodel import Session, create_engine
from app.models import Task, Memory
from app.database import engine

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

    # 2. Save to DB using SQLModel Session
    with Session(engine) as session:
        # Save Tasks
        if extraction.tasks:
            for task in extraction.tasks:
                print(f"   📝 Found Task: {task.description} (Due: {task.due_date})")
                new_task = Task(
                    user_id=user_id,
                    description=task.description,
                    status="pending",
                    due_date=task.due_date,
                    source=source
                )
                session.add(new_task)

        # Save Memories (Facts)
        if extraction.facts:
            from app.core.vector_store import get_vector_store
            vector_store = get_vector_store()
            
            for fact in extraction.facts:
                print(f"   🧠 Found Fact: {fact.content}")
                fact_text = f"[{fact.category.upper()}] {fact.content}"
                
                # Save to SQL for the dashboard
                new_memory = Memory(
                    user_id=user_id,
                    text=fact_text
                )
                session.add(new_memory)
                session.commit() # Commit to get the ID if needed
                
                # Save to Vector Store (Pinecone)
                if vector_store:
                    metadata = {
                        "user_id": user_id,
                        "source": source,
                        "category": fact.category,
                        "timestamp": datetime.now().timestamp()
                    }
                    try:
                        vector_store.add_texts(texts=[fact_text], metadatas=[metadata])
                    except Exception as ve:
                        print(f"   ⚠️ Vector store save failed: {ve}")

        session.commit()

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

    client = _get_openai_client()
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
