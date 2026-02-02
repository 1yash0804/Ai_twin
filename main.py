from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from jose import JWTError, jwt
from app.core.redis_client import get_chat_history, add_message_to_history 
import datetime

from app.database import create_db_and_tables, get_session
from app.models import User, UserCreate, Memory, MemoryCreate
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)
from app.core.vector_store import get_vector_store, search_memories 
from pydantic import BaseModel 
from app.core.llm import generate_answer
# =========================
# AUTH CONFIG

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# =========================
# APP LIFESPAN
# =========================
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    print("✅ Database connected")
    yield


app = FastAPI(lifespan=lifespan)


# =========================
# AUTH DEPENDENCY
# =========================
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
    return {"status": "active"}


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
# PROTECTED ROUTES
# =========================
@app.get("/users/me", response_model=User)
def read_users_me(
    current_user: User = Depends(get_current_user),
):
    return current_user


@app.post("/memories/")
def create_memory(
    memory_in: MemoryCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    timestamp = datetime.datetime.now(datetime.UTC).isoformat()

    memory_db = Memory(
        user_id=current_user.id,
        text=memory_in.text,
        created_at=timestamp,
    )

    session.add(memory_db)
    session.commit()
    session.refresh(memory_db)

    vector_store = get_vector_store()
    if not vector_store:
        raise HTTPException(
            status_code=500,
            detail="Vector store unavailable",
        )

    metadata = {
        "user_id": current_user.id,
        "memory_id": memory_db.id,
        "created_at": timestamp,
        "source": "api",
    }

    vector_store.add_texts(
        texts=[memory_in.text],
        metadatas=[metadata],
    )

    return {
        "status": "Memory stored",
        "id": memory_db.id,
    }

# 6. CHAT / RETRIEVE (The "Recall" Endpoint) 🔍
class ChatRequest(BaseModel):
    query: str

@app.post("/chat/")
def chat_with_ai(
    request: ChatRequest, 
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id

    # 1. Get Short-Term Memory (Redis)
    # We fetch the last 6 messages so the AI knows the context
    history = get_chat_history(user_id=user_id)

    # 2. Get Long-Term Memory (Pinecone)
    relevant_memories = search_memories(
        query_text=request.query, 
        user_id=user_id,
        k=3
    )
    
    # 3. Generate Answer (Brain)
    response_text = generate_answer(
        query=request.query,
        context=relevant_memories,
        history=history # <--- Pass history to brain
    )

    # 4. Save to Short-Term Memory (Redis)
    add_message_to_history(user_id, "user", request.query)
    add_message_to_history(user_id, "assistant", response_text)

    return {
        "response": response_text,
        "sources": relevant_memories
    }
# =========================
# ENTRY POINT
# =========================
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
    )


