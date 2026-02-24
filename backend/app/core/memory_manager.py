import json
import logging
import time
from typing import Dict, List

from app.core.redis_client import redis_client
from app.core.vector_store import get_vector_store
from app.models import Memory
from sqlmodel import Session

# --- CONFIG ---
MAX_SHORT_TERM_MEMORY = 10  # Number of recent messages to keep in Redis
LONG_TERM_RELEVANCE_SCORE = 0.75  # Threshold for vector search

logger = logging.getLogger(__name__)


class MemoryManager:
    def __init__(self, user_id: str, session: Session):
        self.user_id = user_id
        self.session = session
        self.vector_store = get_vector_store()

    # --- 1. WRITE OPERATIONS ---
    
    def add_message(self, role: str, content: str, source: str = "chat"):
        """
        Saves message to:
        1. SQL (Permanent Log)
        2. Redis (Short-term list, best effort)
        3. Vector DB (Searchable Memory, best effort)
        """
        # A. Save to SQL (The "Hard Drive")
        memory_db = Memory(user_id=self.user_id, text=f"{role}: {content}", source=source)
        self.session.add(memory_db)
        self.session.commit()

        msg_obj = {
            "role": role,
            "content": content,
            "timestamp": time.time(),
        }
        redis_key = f"chat:{self.user_id}:history"

        try:
            redis_client.rpush(redis_key, json.dumps(msg_obj))
            redis_client.ltrim(redis_key, -MAX_SHORT_TERM_MEMORY, -1)
        except Exception as exc:
            logger.warning("Redis unavailable while writing short-term memory: %s", exc)

        if len(content.split()) > 3:
            self._save_to_vector_store(content, memory_db.id)

    def _save_to_vector_store(self, text: str, memory_id: int):
        if not self.vector_store:
            return

        metadata = {
            "user_id": self.user_id,
            "memory_id": memory_id,
            "timestamp": time.time(),
            "type": "chat_log",
        }
        try:
            self.vector_store.add_texts(texts=[text], metadatas=[metadata])
        except Exception as exc:
            logger.warning("Vector store unavailable while writing memory: %s", exc)

    def get_short_term_memory(self) -> List[Dict]:
        """
        Retrieve recent chat history from Redis.
        Falls back to empty list if Redis is unavailable.
        """
        redis_key = f"chat:{self.user_id}:history"
        try:
            raw_msgs = redis_client.lrange(redis_key, 0, -1)
            return [json.loads(m) for m in raw_msgs]
        except Exception as exc:
            logger.warning("Redis unavailable while reading short-term memory: %s", exc)
            return []

    def get_long_term_memory(self, query: str, k: int = 3) -> List[str]:
        """
        Retrieve relevant past memories using Vector Search.
        """
        if not self.vector_store:
            return []

        try:
            results = self.vector_store.similarity_search_with_score(
                query,
                k=k,
                filter={"user_id": self.user_id},
            )
        except Exception as exc:
            logger.warning("Vector store unavailable while reading long-term memory: %s", exc)
            return []

        memories = []
        for doc, score in results:
            if score >= LONG_TERM_RELEVANCE_SCORE:
                memories.append(doc.page_content)

        return memories

    def build_context(self, query: str) -> str:
        short_term = self.get_short_term_memory()
        short_term_str = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in short_term])

        long_term = self.get_long_term_memory(query)
        long_term_str = "\n".join([f"- {m}" for m in long_term])

        context_block = f"""
        [RELEVANT PAST MEMORIES]
        {long_term_str if long_term else "No relevant past memories found."}

        [CURRENT CONVERSATION]
        {short_term_str}
        """
        return context_block
