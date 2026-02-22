from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime
# 1. The Base Model (Shared fields)
class UserBase(SQLModel):
    username: str = Field(index=True)
    email: str
    is_active: bool = True

# 2. The Database Table (What sits in the hard drive)
# It inherits username/email from UserBase, but adds the 'secret' hash.
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str 

# 3. The Input Schema (What the user sends in JSON)
# It inherits username/email, but adds the 'plain' password.
class UserCreate(UserBase):
    password: str

# ... (keep your existing imports and User class)

class Memory(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str
    text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MemoryCreate(SQLModel):
    text: str

class DocumentLog(SQLModel, table=True):
    __tablename__ = "documents"
    
    id: int | None = Field(default=None, primary_key=True)
    filename: str
    upload_timestamp: datetime = Field(default_factory=datetime.utcnow)
    user_id: int = Field(foreign_key="user.id")


# --- Extracted Tasks (from extractor.py) ---
class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    description: str
    status: str = "pending"
    due_date: Optional[str] = None
    source: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# --- Per-user LoRA adapter metadata ---
class UserLoraAdapter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    adapter_name: Optional[str] = None
    status: str = "none"  # none | scheduled | training | ready | error
    last_trained_at: Optional[datetime] = None
    examples_used: int = 0
    notes: Optional[str] = None


# --- Per-channel auto-reply configuration ---
class UserChannelConfig(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    channel: str
    auto_reply_enabled: bool = True
    confidence_threshold: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# --- Multi-channel ingestion pipeline tables ---
class InboundMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: str = Field(index=True)
    user_id: str = Field(index=True)
    source: str
    external_message_id: str = Field(index=True)
    raw_payload: str
    normalized_payload: str
    status: str = "received"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Commitment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: str = Field(index=True)
    user_id: str = Field(index=True)
    message_id: str = Field(index=True)
    commitment_detected: bool
    confidence_score: float
    subject: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class DeadlineInference(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: str = Field(index=True)
    user_id: str = Field(index=True)
    message_id: str = Field(index=True)
    inferred_deadline: Optional[str] = None
    confidence_score: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ExtractedTaskRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: str = Field(index=True)
    user_id: str = Field(index=True)
    message_id: str = Field(index=True)
    description: str
    confidence_score: float
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PipelineRun(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: str = Field(index=True)
    user_id: str = Field(index=True)
    message_id: str = Field(index=True)
    status: str = "completed"
    stage_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
