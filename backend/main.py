import os
import shutil
import asyncio
import random
import smtplib
import logging
from email.message import EmailMessage
from datetime import datetime, timedelta
import httpx

from contextlib import asynccontextmanager
import contextlib
from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Request,
    BackgroundTasks,
)
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from jose import JWTError, jwt
from pydantic import BaseModel
from pathlib import Path

# --- Local Imports ---
from app.database import create_db_and_tables, get_session, engine
from app.models import (
    User,
    UserCreate,
    Memory,
    MemoryCreate,
    DocumentLog,
    Task,
    UserLoraAdapter,
    UserChannelConfig,
    InboundMessage,
    Commitment,
    DeadlineInference,
    ExtractedTaskRecord,
    PipelineRun,
)
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)
from app.core.llm import generate_answer
from app.core.classifier import IntentClassifier
from app.core.memory_manager import MemoryManager
from app.core.cache import ResponseCache
from app.tasks import process_document_task
from app.ingestion.gateway import normalize_telegram_message
from app.services.telegram_processing import process_telegram_message
from app.queue.in_memory import message_queue
from app.pipeline.runner import process_pipeline_message

# =========================
# CONFIG & SETUP
# =========================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
intent_classifier = IntentClassifier()
response_cache = ResponseCache()

# Ensure temp folder exists
os.makedirs("temp_uploads", exist_ok=True)

# =========================
# TELEGRAM CONFIG
# =========================
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_WEBHOOK_SECRET = os.getenv("TELEGRAM_WEBHOOK_SECRET")
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}" if TELEGRAM_BOT_TOKEN else None
ENABLE_TELEGRAM_POLLING = os.getenv("ENABLE_TELEGRAM_POLLING", "false").lower() == "true"

logger = logging.getLogger("ai_twin.telegram")

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    print("Database connected & Tables created")

    worker_task = asyncio.create_task(pipeline_worker_loop())
    polling_task = asyncio.create_task(telegram_polling_loop()) if ENABLE_TELEGRAM_POLLING else None
    try:
        yield
    finally:
        worker_task.cancel()
        if polling_task:
            polling_task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            tasks = [worker_task] + ([polling_task] if polling_task else [])
            await asyncio.gather(*tasks)


app = FastAPI(title="AI Twin Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pending_signup_otps: dict[str, dict[str, str | datetime]] = {}

# TELEGRAM HELPER

async def send_telegram_message(chat_id: int, text: str):
    if not TELEGRAM_API_URL:
        logger.warning("Telegram token missing; cannot send message")
        return

    url = f"{TELEGRAM_API_URL}/sendMessage"
    payload = {"chat_id": chat_id, "text": text}

    async with httpx.AsyncClient() as client:
        await client.post(url, json=payload, timeout=20.0)


# AUTH DEPENDENCY
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = session.exec(
        select(User).where(User.username == username)
    ).first()

    if user is None:
        raise credentials_exception

    return user


# =========================
# PUBLIC ROUTES
# =========================
@app.get("/health")
def health_check():
    return {"status": "active", "mode": "groq"}




@app.get("/setup/requirements")
def setup_requirements():
    """Returns runtime configuration readiness for full-stack integration."""
    return {
        "backend": {
            "secret_key": bool(os.getenv("SECRET_KEY")),
            "database_url": bool(os.getenv("DATABASE_URL")),
            "cors_allow_origins": os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"),
        },
        "auth_otp": {
            "smtp_host": bool(os.getenv("SMTP_HOST")),
            "smtp_user": bool(os.getenv("SMTP_USER")),
            "smtp_password": bool(os.getenv("SMTP_PASSWORD")),
        },
        "llm": {
            "groq_api_key": bool(os.getenv("GROQ_API_KEY")),
        },
        "extraction": {
            "redis_url": os.getenv("REDIS_URL", "redis://localhost:6379/0"),
            "pinecone_api_key": bool(os.getenv("PINECONE_API_KEY")),
            "pinecone_index": os.getenv("PINECONE_INDEX", "aitwin"),
        },
    }
@app.post("/users/", response_model=User)
def create_user(
    user_input: UserCreate,
    session: Session = Depends(get_session),
):
    existing_user = session.exec(
        select(User).where(User.username == user_input.username)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already taken",
        )

    user_db = User(
        username=user_input.username,
        email=user_input.email,
        hashed_password=get_password_hash(user_input.password),
        is_active=user_input.is_active,
    )

    session.add(user_db)
    session.commit()
    session.refresh(user_db)

    return user_db


@app.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    user = session.exec(
        select(User).where(User.username == form_data.username)
    ).first()

    if not user or not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": user.username}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# =========================
# CHAT ENDPOINT
# =========================
class ChatRequest(BaseModel):
    query: str
    model_type: str = "general"
    adapter_name: str | None = None


class StatsResponse(BaseModel):
    messages_responded: int
    tasks_extracted: int
    memories_created: int


class LoraStatus(BaseModel):
    status: str
    adapter_name: str | None = None
    last_trained_at: datetime | None = None
    examples_used: int = 0
    notes: str | None = None


class ChannelConfigUpdate(BaseModel):
    channel: str
    auto_reply_enabled: bool
    confidence_threshold: float = 0.0


class SignupOtpRequest(BaseModel):
    username: str
    email: str
    password: str


class SignupOtpVerify(BaseModel):
    email: str
    otp: str


def send_otp_email(to_email: str, otp: str):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM", smtp_user or "no-reply@aitwin.local")

    if not smtp_host or not smtp_user or not smtp_password:
        print(f"⚠️ SMTP is not configured. OTP for {to_email}: {otp}")
        return

    msg = EmailMessage()
    msg["Subject"] = "Your AI Twin verification code"
    msg["From"] = smtp_from
    msg["To"] = to_email
    msg.set_content(f"Your OTP for AI Twin signup is: {otp}. It expires in 10 minutes.")

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)


@app.post("/auth/request-signup-otp")
def request_signup_otp(
    payload: SignupOtpRequest,
    session: Session = Depends(get_session),
):
    existing_username = session.exec(
        select(User).where(User.username == payload.username)
    ).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    existing_email = session.exec(
        select(User).where(User.email == payload.email)
    ).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    otp = f"{random.randint(0, 999999):06d}"
    pending_signup_otps[payload.email] = {
        "username": payload.username,
        "email": payload.email,
        "password": payload.password,
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=10),
    }

    send_otp_email(payload.email, otp)
    return {"status": "otp_sent", "email": payload.email}


@app.post("/auth/verify-signup-otp", response_model=User)
def verify_signup_otp(
    payload: SignupOtpVerify,
    session: Session = Depends(get_session),
):
    pending = pending_signup_otps.get(payload.email)
    if not pending:
        raise HTTPException(status_code=400, detail="No pending signup found for this email")

    expires_at = pending.get("expires_at")
    if not isinstance(expires_at, datetime) or datetime.utcnow() > expires_at:
        pending_signup_otps.pop(payload.email, None)
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new one")

    if str(pending["otp"]) != payload.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user_db = User(
        username=str(pending["username"]),
        email=str(pending["email"]),
        hashed_password=get_password_hash(str(pending["password"])),
        is_active=True,
    )

    session.add(user_db)
    session.commit()
    session.refresh(user_db)
    pending_signup_otps.pop(payload.email, None)

    return user_db


@app.post("/chat/")
def chat_with_ai(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user_id = current_user.username

    memory = MemoryManager(user_id=user_id, session=session)

    intent = intent_classifier.classify(request.query)
    print(f"🧠 Intent Detected: {intent}")

    if intent in ["factual", "coding", "casual"]:
        cached_result = response_cache.get_cached_response(
            user_id, request.query, intent
        )
        if cached_result:
            print("🚀 Cache Hit!")
            return {
                "response": cached_result["response"],
                "intent": intent,
                "used_model": "cache ⚡",
            }

    selected_model = "general"

    context_block = memory.build_context(request.query)

    response_text = generate_answer(
        query=request.query,
        context=[],
        history=[],
        model_type=selected_model,
        adapter_name=None,
        system_context=context_block,
    )

    if intent in ["factual", "coding", "casual"]:
        response_cache.save_response(
            user_id, request.query, intent, response_text
        )

    memory.add_message("user", request.query)
    memory.add_message("assistant", response_text)

    return {
        "response": response_text,
        "intent": intent,
        "used_model": selected_model,
    }


# =========================
# ME ENDPOINTS (STATS & CONFIG)
# =========================
@app.get("/me/stats", response_model=StatsResponse)
def get_me_stats(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user_key = current_user.username

    # Memories: all entries for this user
    memories = session.exec(
        select(Memory).where(Memory.user_id == user_key)
    ).all()
    memories_created = len(memories)

    # Messages responded: count assistant messages stored in Memory
    messages_responded = sum(
        1 for m in memories if m.text.startswith("assistant:")
    )

    # Tasks extracted: from tasks table via SQLModel mapping
    tasks = session.exec(
        select(Task).where(Task.user_id == user_key)
    ).all()
    tasks_extracted = len(tasks)

    return StatsResponse(
        messages_responded=messages_responded,
        tasks_extracted=tasks_extracted,
        memories_created=memories_created,
    )


@app.get("/me/lora", response_model=LoraStatus)
def get_me_lora_status(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user_key = current_user.username
    record = session.exec(
        select(UserLoraAdapter).where(UserLoraAdapter.user_id == user_key)
    ).first()

    if not record:
        return LoraStatus(status="none")

    return LoraStatus(
        status=record.status,
        adapter_name=record.adapter_name,
        last_trained_at=record.last_trained_at,
        examples_used=record.examples_used,
        notes=record.notes,
    )


@app.post("/me/lora/schedule", response_model=LoraStatus)
def schedule_lora_training(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user_key = current_user.username

    record = session.exec(
        select(UserLoraAdapter).where(UserLoraAdapter.user_id == user_key)
    ).first()

    if not record:
        record = UserLoraAdapter(
            user_id=user_key,
            status="scheduled",
        )
        session.add(record)
    else:
        record.status = "scheduled"

    session.commit()
    session.refresh(record)

    # In the future, this is where you'd notify your cloud trainer.

    return LoraStatus(
        status=record.status,
        adapter_name=record.adapter_name,
        last_trained_at=record.last_trained_at,
        examples_used=record.examples_used,
        notes=record.notes,
    )


@app.get("/me/auto-reply")
def get_me_auto_reply_config(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user_key = current_user.username
    records = session.exec(
        select(UserChannelConfig).where(UserChannelConfig.user_id == user_key)
    ).all()

    # If no explicit config, default to Telegram enabled for backward compatibility
    if not records:
        return {
            "channels": [
                {
                    "channel": "telegram",
                    "auto_reply_enabled": True,
                    "confidence_threshold": 0.0,
                }
            ]
        }

    return {
        "channels": [
            {
                "channel": r.channel,
                "auto_reply_enabled": r.auto_reply_enabled,
                "confidence_threshold": r.confidence_threshold,
            }
            for r in records
        ]
    }


@app.post("/me/auto-reply")
def update_auto_reply_config(
    payload: ChannelConfigUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user_key = current_user.username

    record = session.exec(
        select(UserChannelConfig).where(
            UserChannelConfig.user_id == user_key,
            UserChannelConfig.channel == payload.channel,
        )
    ).first()

    now = datetime.utcnow()

    if not record:
        record = UserChannelConfig(
            user_id=user_key,
            channel=payload.channel,
            auto_reply_enabled=payload.auto_reply_enabled,
            confidence_threshold=payload.confidence_threshold,
            created_at=now,
            updated_at=now,
        )
        session.add(record)
    else:
        record.auto_reply_enabled = payload.auto_reply_enabled
        record.confidence_threshold = payload.confidence_threshold
        record.updated_at = now

    session.commit()

    return {
        "channel": record.channel,
        "auto_reply_enabled": record.auto_reply_enabled,
        "confidence_threshold": record.confidence_threshold,
    }


# =========================
# TELEGRAM WEBHOOK (FIXED)
# =========================
@app.get("/me/memories")
def get_me_memories(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    memories = session.exec(
        select(Memory).where(Memory.user_id == current_user.username).order_by(Memory.created_at.desc())
    ).all()
    return memories


@app.get("/me/tasks")
def get_me_tasks(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    tasks = session.exec(
        select(Task).where(Task.user_id == current_user.username).order_by(Task.created_at.desc())
    ).all()
    return tasks


@app.get("/me/activities")
def get_me_activities(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user_id = current_user.username
    
    # 1. Get Memories
    memories = session.exec(
        select(Memory).where(Memory.user_id == user_id).order_by(Memory.created_at.desc()).limit(10)
    ).all()

    # 2. Get Tasks
    tasks = session.exec(
        select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc()).limit(10)
    ).all()

    # 3. Combine & Normalize
    activity_feed = []

    for m in memories:
        activity_feed.append({
            "id": f"mem_{m.id}",
            "type": "memory",
            "text": m.text,
            "created_at": m.created_at,
            "source": "Conversation" # Default for now
        })

    for t in tasks:
        activity_feed.append({
            "id": f"task_{t.id}",
            "type": "task",
            "text": t.description,
            "status": t.status,
            "created_at": t.created_at,
            "source": t.source or "System"
        })

    # 4. Sort by time (newest first)
    activity_feed.sort(key=lambda x: x["created_at"], reverse=True)

    return activity_feed


async def pipeline_worker_loop():
    """Continuously consumes normalized messages from queue and runs pipeline."""
    from sqlmodel import Session

    while True:
        msg = await message_queue.consume()
        try:
            with Session(engine) as worker_session:
                result = process_pipeline_message(msg, worker_session)
                logger.info("Pipeline processed message_id=%s", result.message_id)
        except Exception as exc:
            logger.exception("Pipeline worker failure: %s", exc)


async def telegram_polling_loop():
    """Optional polling loop for local fallback only."""
    if not TELEGRAM_API_URL:
        logger.warning("Telegram polling disabled: missing TELEGRAM_BOT_TOKEN")
        return

    offset = 0
    logger.info("Telegram polling started")

    while True:
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(f"{TELEGRAM_API_URL}/getUpdates", params={"offset": offset, "timeout": 30})
                if resp.status_code == 200:
                    data = resp.json()
                    for update in data.get("result", []):
                        offset = update["update_id"] + 1
                        normalized = normalize_telegram_message(update)
                        if normalized:
                            await message_queue.publish(normalized)
                elif resp.status_code == 401:
                    logger.error("Telegram token invalid. Polling stopped")
                    break
        except Exception as exc:
            logger.warning("Telegram polling error: %s", exc)

        await asyncio.sleep(3)


@app.post("/webhook/telegram")
async def telegram_webhook(
    request: Request,
    session: Session = Depends(get_session),
):
    received_secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token")
    if not TELEGRAM_WEBHOOK_SECRET or received_secret != TELEGRAM_WEBHOOK_SECRET:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid webhook secret")

    try:
        payload = await request.json()
    except Exception as exc:
        logger.warning("Invalid Telegram webhook payload: %s", exc)
        return {"status": "ignored"}

    normalized = normalize_telegram_message(payload)
    if not normalized:
        return {"status": "ignored"}

    config = session.exec(
        select(UserChannelConfig).where(
            UserChannelConfig.user_id == normalized.user_id,
            UserChannelConfig.channel == "telegram",
        )
    ).first()

    if config and not config.auto_reply_enabled:
        return {"status": "auto_reply_disabled"}

    try:
        process_pipeline_message(normalized, session)

        response_text = await process_telegram_message(
            session=session,
            user_id=normalized.user_id,
            text=normalized.text,
            external_message_id=normalized.external_message_id,
            source="telegram",
        )
        if normalized.external_chat_id:
            await send_telegram_message(int(normalized.external_chat_id), response_text)
    except Exception as exc:
        logger.exception("Telegram processing failed: %s", exc)
        raise HTTPException(status_code=500, detail="Telegram processing failed") from exc

    return {"status": "processed", "message_id": normalized.external_message_id}


@app.get("/me/telegram/overview")
def get_me_telegram_overview(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user_key = current_user.username
    telegram_messages = session.exec(
        select(InboundMessage)
        .where(InboundMessage.user_id == user_key, InboundMessage.source == "telegram")
        .order_by(InboundMessage.created_at.desc())
        .limit(30)
    ).all()

    telegram_tasks = session.exec(
        select(Task)
        .where(Task.user_id == user_key, Task.source == "telegram")
        .order_by(Task.created_at.desc())
        .limit(30)
    ).all()

    telegram_memories = session.exec(
        select(Memory)
        .where(Memory.user_id == user_key, Memory.source == "telegram")
        .order_by(Memory.created_at.desc())
        .limit(30)
    ).all()

    return {
        "messages": telegram_messages,
        "tasks": telegram_tasks,
        "memories": telegram_memories,
    }


# =========================
# DOCUMENT UPLOAD
# =========================
@app.post("/upload-doc/")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    safe_name = Path(file.filename).name
    file_location = f"temp_uploads/{current_user.id}_{safe_name}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    task = process_document_task.delay(
        file_path=file_location,
        filename=file.filename,
        user_id=current_user.id,
    )

    doc_db = DocumentLog(
        filename=file.filename,
        user_id=current_user.id,
    )
    session.add(doc_db)
    session.commit()
    session.refresh(doc_db)

    return {
        "status": "queued",
        "task_id": task.id,
        "filename": file.filename,
        "message": "File processing started in background.",
    }


# =========================
# ENTRY POINT
# =========================
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
