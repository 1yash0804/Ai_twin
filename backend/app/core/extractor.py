from pydantic import BaseModel, Field
from typing import List, Optional

from sqlmodel import Session

from app.core.llm import get_llm
from app.database import engine
from app.models import Memory, Task


class ExtractedTask(BaseModel):
    description: str = Field(..., description="The actual task to be done")
    due_date: Optional[str] = Field(None, description="ISO date or natural language if mentioned")
    priority: str = Field("medium", description="low, medium, or high")
    assigned_to: Optional[str] = Field(None, description="Name of person task is assigned to, or 'sender' if for the message sender")


class ExtractedFact(BaseModel):
    content: str = Field(..., description="A permanent fact about the user or contact")
    category: str = Field("general", description="family, work, preference, or general")


class AnalysisResult(BaseModel):
    tasks: List[ExtractedTask] = []
    facts: List[ExtractedFact] = []


def extract_and_save(user_id: str, message_text: str, source: str = "chat"):
    print(f"🕵️‍♂️ Extractor analyzing: '{message_text}'")

    try:
        extraction = analyze_text_with_llm(message_text)
    except Exception as exc:
        print(f"❌ Extraction failed: {exc}")
        return

    with Session(engine) as session:
        if extraction.tasks:
            for task in extraction.tasks:
               new_task = Task(
                    user_id=user_id,
                    title=task.description,
                    description=task.description,
                    status="pending",
                    due_date=task.due_date,
                    priority=task.priority,
                    source=source,
                    confidence_score=0.85,
                )
            session.add(new_task)

        if extraction.facts:
            from app.core.vector_store import get_vector_store

            vector_store = get_vector_store()
            for fact in extraction.facts:
                fact_text = f"[{fact.category.upper()}] {fact.content}"
                new_memory = Memory(user_id=user_id, text=fact_text, source=source)
                session.add(new_memory)
                session.commit()

                if vector_store:
                    metadata = {
                        "user_id": user_id,
                        "source": source,
                        "category": fact.category,
                    }
                    try:
                        vector_store.add_texts(texts=[fact_text], metadatas=[metadata])
                    except Exception as exc:
                        print(f"⚠️ Vector store save failed: {exc}")

        session.commit()


def analyze_text_with_llm(text: str) -> AnalysisResult:
    llm = get_llm(model_type="general", purpose="structured")
    structured_llm = llm.with_structured_output(AnalysisResult)

    prompt = (
        "Analyze the message and extract tasks and permanent facts. "
        "For each task, also identify who it is assigned to if mentioned. "
        "Add an 'assigned_to' field — use the person's name if mentioned, "
        "or 'sender' if the task is for the person who sent the message. "
        "Always respond in English only. Translate everything to English. "
        "Return strictly valid JSON matching the schema. "
        "If nothing is found, return empty arrays."
)

    try:
        return structured_llm.invoke(f"{prompt}\n\nMessage: {text}")
    except Exception:
        return AnalysisResult()
