import json
import time
from typing import List, Dict, Any
from app.core.redis_client import redis_client  # Assuming you have this from previous steps
from app.core.vector_store import get_vector_store
from app.models import Memory
from sqlmodel import Session, select

# --- CONFIG ---
MAX_SHORT_TERM_MEMORY = 10  # Number of recent messages to keep in Redis
LONG_TERM_RELEVANCE_SCORE = 0.75 # Threshold for vector search

class MemoryManager:
    def __init__(self, user_id: str, session: Session):
        self.user_id = user_id
        self.session = session
        self.vector_store = get_vector_store()

    # --- 1. WRITE OPERATIONS ---
    
    def add_message(self, role: str, content: str, source: str = "chat"):
        """
        Saves message to:
        1. Redis (Short-term list)
        2. SQL (Permanent Log)
        3. Vector DB (Searchable Memory - Async ideally)
        """
        # A. Save to SQL (The "Hard Drive")
        memory_db = Memory(user_id=self.user_id, text=f"{role}: {content}", source=source)
        self.session.add(memory_db)
        self.session.commit()
        
        # B. Save to Redis (The "RAM")
        # We store as JSON: {"role": "user", "content": "hi", "timestamp": ...}
        msg_obj = {
            "role": role,
            "content": content,
            "timestamp": time.time()
        }
        redis_key = f"chat:{self.user_id}:history"
        
        # Push to list and trim to keep only recent X messages
        redis_client.rpush(redis_key, json.dumps(msg_obj))
        redis_client.ltrim(redis_key, -MAX_SHORT_TERM_MEMORY, -1)
        
        # C. Save to Vector DB (The "Search Engine")
        # Only save meaningful messages (ignore "hi", "ok")
        if len(content.split()) > 3: 
            self._save_to_vector_store(content, memory_db.id)

    def _save_to_vector_store(self, text: str, memory_id: int):
        if not self.vector_store:
            return
            
        metadata = {
            "user_id": self.user_id,
            "memory_id": memory_id,
            "timestamp": time.time(),
            "type": "chat_log"
        }
        # Add to Pinecone/Chroma
        self.vector_store.add_texts(texts=[text], metadatas=[metadata])

    # --- 2. READ OPERATIONS ---

    def get_short_term_memory(self) -> List[Dict]:
        """
        Retrieve recent chat history from Redis.
        """
        redis_key = f"chat:{self.user_id}:history"
        raw_msgs = redis_client.lrange(redis_key, 0, -1)
        return [json.loads(m) for m in raw_msgs]

    def get_long_term_memory(self, query: str, k: int = 3) -> List[str]:
        """
        Retrieve relevant past memories using Vector Search.
        """
        if not self.vector_store:
            return []
            
        results = self.vector_store.similarity_search_with_score(
            query, 
            k=k,
            filter={"user_id": self.user_id}
        )
        
        # Filter by relevance score and extract text
        memories = []
        for doc, score in results:
            if score >= LONG_TERM_RELEVANCE_SCORE:
                memories.append(doc.page_content)
                
        return memories

    def build_context(self, query: str) -> str:
        """
        Combines Short-Term + Long-Term memory into a single prompt context.
        """
        # 1. Get recent chat (Last 5 messages)
        short_term = self.get_short_term_memory()
        short_term_str = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in short_term])
        
        # 2. Get relevant past details
        long_term = self.get_long_term_memory(query)
        long_term_str = "\n".join([f"- {m}" for m in long_term])
        
        # 3. Format the final block
        context_block = f"""
        [RELEVANT PAST MEMORIES]
        {long_term_str if long_term else "No relevant past memories found."}

        [CURRENT CONVERSATION]
        {short_term_str}
        """
        return context_block