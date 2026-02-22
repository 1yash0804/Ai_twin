from datetime import datetime
from pydantic import BaseModel, Field


class NormalizedMessage(BaseModel):
    organization_id: str
    user_id: str
    source: str
    external_message_id: str
    external_user_id: str
    external_chat_id: str | None = None
    text: str
    timestamp: datetime
    metadata: dict = Field(default_factory=dict)


class PipelineResult(BaseModel):
    organization_id: str
    user_id: str
    message_id: str

    commitment_detected: bool
    commitment_confidence_score: float

    inferred_deadline: str | None = None
    deadline_confidence_score: float | None = None

    extracted_tasks: list[str] = Field(default_factory=list)
    task_extraction_confidence_score: float

    extracted_memories: list[str] = Field(default_factory=list)
    score_priority: float = 0.0
