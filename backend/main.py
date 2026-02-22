import os
import shutil
from datetime import datetime
import httpx

from contextlib import asynccontextmanager
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
from sqlmodel import Session, select
from jose import JWTError, jwt
from pydantic import BaseModel
from pathlib import Path

# --- Local Imports ---
from app.database import create_db_and_tables, get_session
from app.models import (
    User,
    UserCreate,
    Memory,
    MemoryCreate,
    DocumentLog,
    Task,
    UserLoraAdapter,
    UserChannelConfig,
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

# ✅ Correct: Use the variable name inside the braces
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    print("Database connected & Tables created")
    yield


app = FastAPI(title="AI Twin Backend", lifespan=lifespan)

# TELEGRAM HELPER

async def send_telegram_message(chat_id: int, text: str):
    url = f"{TELEGRAM_API_URL}/sendMessage"
    payload = {"chat_id": chat_id, "text": text}

    async with httpx.AsyncClient() as client:
        await client.post(url, json=payload)


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
    return {"status": "active", "mode": "hybrid_brain (Groq + Ollama)"}


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

    if intent in ["coding", "factual"]:
        selected_model = "general"
        adapter = None
    elif intent == "personal":
        selected_model = "local"
        adapter = "phi3"
    else:
        selected_model = "local"
        adapter = "phi3"

    if request.model_type != "general":
        selected_model = request.model_type
        adapter = request.adapter_name

    context_block = memory.build_context(request.query)

    response_text = generate_answer(
        query=request.query,
        context=[],
        history=[],
        model_type=selected_model,
        adapter_name=adapter,
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


from fastapi import APIRouter, Request, BackgroundTasks, Depends
from sqlmodel import Session
from app.core.extractor import extract_and_save

# --- 1. The Heavy Worker (Runs in Background) ---
async def process_chat_logic(chat_id: int, sender_name: str, incoming_text: str, user_id: str, session: Session):
    """
    This runs AFTER we reply 'OK' to Telegram. 
    It handles the AI thinking so Telegram doesn't timeout.
    """
    print(f"⚙️ Worker started for: {incoming_text}")
    
    # A. Memory Management
    memory = MemoryManager(user_id=user_id, session=session)
    memory.add_message(f"friend_{sender_name}", incoming_text)
    context_block = memory.build_context(incoming_text)

    # B. Generate Reply (The Fast Brain)
    # Even if this takes 20 seconds, Telegram won't care anymore!
    system_prompt = (
        f"You are the AI Twin of Yash. "
        f"A friend named {sender_name} just texted you. "
        f"Reply exactly how Yash would.\n"
        f"Context:\n{context_block}"
    )
    
    try:
        response_text = generate_answer(
            query=incoming_text,
            context=[], 
            history=[], 
            model_type="local", 
            adapter_name="phi3", 
            system_context=system_prompt
        )
        
        # C. Send Reply to Telegram
        memory.add_message("assistant", response_text)
        await send_telegram_message(chat_id, response_text)
        print(f"✅ Reply sent to {sender_name}")

    except Exception as e:
        print(f"❌ AI Generation Failed: {e}")
        return

    # D. The Slow Brain (Extractor)
    # Runs after the reply is sent
    try:
        extract_and_save(user_id=user_id, message_text=incoming_text, source=f"telegram_{sender_name}")
    except Exception as e:
        print(f"❌ Extractor Failed: {e}")

# --- 2. The Webhook Endpoint (The Receptionist) ---
@app.post("/webhook/telegram")
async def telegram_webhook(
    request: Request, 
    background_tasks: BackgroundTasks, 
    session: Session = Depends(get_session)
):
    # A. Receive Data Fast
    try:
        data = await request.json()
    except Exception:
        return {"status": "ignored"} 

    if "message" not in data:
        return {"status": "ignored"}
        
    message = data["message"]
    
    if "text" not in message:
        return {"status": "no_text"}
        
    # B. Extract minimal info needed for the worker
    chat_id = message["chat"]["id"]
    sender_name = message["from"].get("first_name", "Friend")
    incoming_text = message["text"]
    user_id = "yash"
    
    print(f"📩 Received: {incoming_text} (Evaluating auto-reply config...)")

    # Optional: check per-channel auto-reply configuration.
    # If a config exists and auto_reply_enabled is False, we just acknowledge.
    config = session.exec(
        select(UserChannelConfig).where(
            UserChannelConfig.user_id == user_id,
            UserChannelConfig.channel == "telegram",
        )
    ).first()

    if config and not config.auto_reply_enabled:
        print("ℹ️ Auto-reply disabled for user/channel; skipping AI reply.")
        return {"status": "auto_reply_disabled"}

    print(f"📩 Auto-reply enabled. Queuing task for: {incoming_text}")

    # C. Hand off to Background Task
    # This tells FastAPI: "Return 200 OK now, but run this function immediately after."
    background_tasks.add_task(
        process_chat_logic, 
        chat_id, 
        sender_name, 
        incoming_text, 
        user_id, 
        session
    )

    # D. Return 200 OK Instantly
    return {"status": "ok"}

    # ==========================================
    # 🧠 THE "SLOW BRAIN" ACTIVATION
    # ==========================================
    # This runs silently in the background AFTER the reply is sent.
    # It won't make your friend wait.
    background_tasks.add_task(
        extract_and_save, 
        user_id=user_id, 
        message_text=incoming_text,
        source=f"telegram_{sender_name}"
    )

    return {"status": "ok"}

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
