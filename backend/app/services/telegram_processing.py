import asyncio
import json
import logging

from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field, ValidationError
from sqlmodel import Session

from app.core.llm import generate_answer, get_llm
from app.core.memory_manager import MemoryManager
from app.models import ExtractedTaskRecord, Memory, Task

logger = logging.getLogger(__name__)


class StructuredTask(BaseModel):
    title: str
    description: str
    deadline: str | None = None
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")
    confidence_score: float = Field(default=0.0, ge=0.0, le=1.0)


class StructuredMemory(BaseModel):
    text: str
    memory_type: str = Field(pattern="^(preference|goal|personal_fact|commitment)$")
    confidence_score: float = Field(default=0.0, ge=0.0, le=1.0)


class ExtractionEnvelope(BaseModel):
    tasks: list[StructuredTask] = []
    memories: list[StructuredMemory] = []


async def _extract_structured_data(text: str) -> ExtractionEnvelope:
    llm = get_llm(model_type="local", adapter_name="phi3")
    prompt = (
        "Extract actionable tasks and long-term memory from the user message. "
        "Return only valid JSON with this exact schema: "
        "{\"tasks\":[{\"title\":str,\"description\":str,\"deadline\":str|null,\"priority\":\"low|medium|high\",\"confidence_score\":float}],"
        "\"memories\":[{\"text\":str,\"memory_type\":\"preference|goal|personal_fact|commitment\",\"confidence_score\":float}]}."
    )

    response = await llm.ainvoke([SystemMessage(content=prompt), HumanMessage(content=text)])

    try:
        payload = json.loads(response.content)
        return ExtractionEnvelope.model_validate(payload)
    except (json.JSONDecodeError, ValidationError) as exc:
        logger.warning("Structured extraction fallback triggered: %s", exc)
        return ExtractionEnvelope()


async def process_telegram_message(
    session: Session,
    user_id: str,
    text: str,
    external_message_id: str,
    source: str = "telegram",
) -> str:
    memory_manager = MemoryManager(user_id=user_id, session=session)
    memory_manager.add_message("user", text, source=source)

    extracted = await _extract_structured_data(text)

    for task in extracted.tasks:
        if task.confidence_score < 0.55:
            continue

        session.add(
            Task(
                user_id=user_id,
                title=task.title,
                description=task.description,
                due_date=task.deadline,
                priority=task.priority,
                confidence_score=task.confidence_score,
                status="pending",
                source=source,
            )
        )
        session.add(
            ExtractedTaskRecord(
                organization_id="default-org",
                user_id=user_id,
                message_id=f"{source}:{external_message_id}",
                description=task.description,
                confidence_score=task.confidence_score,
            )
        )

    for memory in extracted.memories:
        if memory.confidence_score < 0.55:
            continue

        session.add(
            Memory(
                user_id=user_id,
                source=source,
                text=f"[{memory.memory_type.upper()}] {memory.text}",
            )
        )

    session.commit()

    context_block = memory_manager.build_context(text)
    response_text = await asyncio.to_thread(
        generate_answer,
        query=text,
        context=[],
        history=[],
        model_type="local",
        adapter_name="phi3",
        system_context=context_block,
    )

    memory_manager.add_message("assistant", response_text, source=source)
    return response_text
