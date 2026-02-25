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


async def _extract_structured_data(
    text: str,
    sender_name: str = "Friend",
) -> ExtractionEnvelope:
    llm = get_llm(model_type="structured")
    prompt = (
        f"Extract actionable tasks and long-term memory from this message sent by {sender_name}. "
        "Return only valid JSON with this exact schema: "
        "{\"tasks\":[{\"title\":str,\"description\":str,\"deadline\":str|null,\"priority\":\"low|medium|high\",\"confidence_score\":float}],"
        "\"memories\":[{\"text\":str,\"memory_type\":\"preference|goal|personal_fact|commitment\",\"confidence_score\":float}]}. "
        "Return only the JSON object with no extra text, markdown, or explanation."
    )

    response = await llm.ainvoke([SystemMessage(content=prompt), HumanMessage(content=text)])

    try:
        content = response.content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()

        payload = json.loads(content)
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
    silent: bool = False,
    sender_name: str = "Friend",
    chat_title: str = "",
) -> str | None:
    """
    Process a Telegram message.
    - Always extracts tasks and memories.
    - Only generates a reply if silent=False.
    """
    memory_manager = MemoryManager(user_id=user_id, session=session)
    memory_manager.add_message("user", text, source=source)

    # Build context label for dashboard display
    if chat_title:
        context_label = f"[From {sender_name} in {chat_title}]"
    else:
        context_label = f"[From {sender_name}]"

    extracted = await _extract_structured_data(text, sender_name=sender_name)

    for task in extracted.tasks:
        if task.confidence_score < 0.55:
            continue

        enriched_title = (
            f"{task.title} ({sender_name})" if sender_name != "Friend" else task.title
        )

        session.add(
            Task(
                user_id=user_id,
                title=enriched_title,
                description=f"{context_label} {task.description}",
                due_date=task.deadline,
                priority=task.priority,
                confidence_score=task.confidence_score,
                status="pending",
                source="telegram",
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
                source="telegram",
                text=f"[{memory.memory_type.upper()}] {context_label} {memory.text}",
            )
        )

    session.commit()

    # Silent mode — extract only, no reply
    if silent:
        logger.info(
            "Silent extraction complete for message_id=%s from %s",
            external_message_id,
            sender_name,
        )
        return None

    # Normal mode — generate reply
    context_block = memory_manager.build_context(text)
    response_text = await asyncio.to_thread(
        generate_answer,
        query=text,
        context=[],
        history=[],
        model_type="general",
        adapter_name=None,
        system_context=context_block,
    )

    memory_manager.add_message("assistant", response_text, source=source)
    return response_text