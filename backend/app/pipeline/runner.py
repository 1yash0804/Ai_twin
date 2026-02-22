import json
import re
from sqlmodel import Session

from app.core.extractor import extract_and_save
from app.models import (
    Commitment,
    DeadlineInference,
    ExtractedTaskRecord,
    InboundMessage,
    PipelineRun,
)
from app.pipeline.contracts import NormalizedMessage, PipelineResult


COMMITMENT_HINTS = ["i will", "i'll", "i can", "remind me", "todo", "need to"]
DEADLINE_HINTS = ["today", "tomorrow", "next week", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]


def _detect_commitment(text: str) -> tuple[bool, float]:
    lowered = text.lower()
    hits = sum(1 for token in COMMITMENT_HINTS if token in lowered)
    detected = hits > 0
    confidence = min(1.0, 0.35 + hits * 0.2) if detected else 0.1
    return detected, round(confidence, 2)


def _infer_deadline(text: str) -> tuple[str | None, float | None]:
    lowered = text.lower()
    for hint in DEADLINE_HINTS:
        if hint in lowered:
            return hint, 0.7

    match = re.search(r"\b\d{1,2}(:\d{2})?\s?(am|pm)?\b", lowered)
    if match:
        return match.group(0), 0.62

    return None, None


def _extract_tasks(text: str) -> tuple[list[str], float]:
    lowered = text.lower()
    tasks: list[str] = []

    if "remind me to" in lowered:
        tasks.append(text)
    if "need to" in lowered:
        tasks.append(text)
    if "todo" in lowered:
        tasks.append(text)

    if not tasks:
        return [], 0.15

    return tasks, 0.75


def _extract_memories(text: str) -> list[str]:
    lowered = text.lower()
    if "my " in lowered or "i like" in lowered or "i prefer" in lowered:
        return [text]
    return []


def process_pipeline_message(message: NormalizedMessage, session: Session) -> PipelineResult:
    commitment_detected, commitment_confidence = _detect_commitment(message.text)
    inferred_deadline, deadline_confidence = _infer_deadline(message.text)
    extracted_tasks, task_confidence = _extract_tasks(message.text)
    extracted_memories = _extract_memories(message.text)

    result = PipelineResult(
        organization_id=message.organization_id,
        user_id=message.user_id,
        message_id=f"{message.source}:{message.external_message_id}",
        commitment_detected=commitment_detected,
        commitment_confidence_score=commitment_confidence,
        inferred_deadline=inferred_deadline,
        deadline_confidence_score=deadline_confidence,
        extracted_tasks=extracted_tasks,
        task_extraction_confidence_score=task_confidence,
        extracted_memories=extracted_memories,
        score_priority=max(commitment_confidence, task_confidence),
    )

    inbound = InboundMessage(
        organization_id=message.organization_id,
        user_id=message.user_id,
        source=message.source,
        external_message_id=message.external_message_id,
        raw_payload=json.dumps(message.metadata),
        normalized_payload=message.model_dump_json(),
        status="processed",
    )
    session.add(inbound)

    session.add(
        Commitment(
            organization_id=message.organization_id,
            user_id=message.user_id,
            message_id=result.message_id,
            commitment_detected=result.commitment_detected,
            confidence_score=result.commitment_confidence_score,
            subject=message.text[:200],
        )
    )

    session.add(
        DeadlineInference(
            organization_id=message.organization_id,
            user_id=message.user_id,
            message_id=result.message_id,
            inferred_deadline=result.inferred_deadline,
            confidence_score=result.deadline_confidence_score,
        )
    )

    for task in extracted_tasks:
        session.add(
            ExtractedTaskRecord(
                organization_id=message.organization_id,
                user_id=message.user_id,
                message_id=result.message_id,
                description=task,
                confidence_score=result.task_extraction_confidence_score,
            )
        )

    session.add(
        PipelineRun(
            organization_id=message.organization_id,
            user_id=message.user_id,
            message_id=result.message_id,
            status="completed",
            stage_notes="heuristic_pipeline_v1",
        )
    )

    session.commit()

    try:
        extract_and_save(
            user_id=message.user_id,
            message_text=message.text,
            source=f"{message.source}:{message.external_user_id}",
        )
    except Exception as exc:
        print(f"⚠️ Extractor fallback failed: {exc}")

    return result
