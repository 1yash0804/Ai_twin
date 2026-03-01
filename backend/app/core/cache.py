import hashlib
import json
from app.core.redis_client import redis_client # This now works because of the alias above

# --- CONFIG ---
CACHE_TTL_CASUAL = 3600         # 1 Hour for casual chat
CACHE_TTL_FACTUAL = 86400 * 7   # 7 Days for facts (e.g., "Capital of France")

class ResponseCache:
    def __init__(self):
        self.redis = redis_client

    def _generate_key(self, user_id: str, query: str, intent: str) -> str:
        """
        Creates a unique hash for the question.
        We include 'intent' so a 'coding' question isn't confused with a 'casual' one.
        """
        # Clean the query (lowercase, strip whitespace)
        clean_query = query.strip().lower()
        
        # Create a unique string: "user123:factual:capital of france"
        raw_string = f"{user_id}:{intent}:{clean_query}"
        
        # Hash it to keep the Redis key short and secure
        query_hash = hashlib.sha256(raw_string.encode()).hexdigest()
        return f"cache:response:{query_hash}"
def get_cached_response(self, user_id: str, query: str, intent: str):
        if not self.redis:
            return None
        try:
            key = self._generate_key(user_id, query, intent)
            cached_data = self.redis.get(key)
            if cached_data:
                return json.loads(cached_data)
            return None
        except Exception:
            return None

def save_response(self, user_id: str, query: str, intent: str, response: str):
        if not self.redis:
            return
        try:
            key = self._generate_key(user_id, query, intent)
            ttl = CACHE_TTL_FACTUAL if intent == "factual" else CACHE_TTL_CASUAL
            data = {"response": response, "cached_at": "just_now", "intent": intent}
            self.redis.setex(key, ttl, json.dumps(data))
        except Exception:
            pass

def save_response(self, user_id: str, query: str, intent: str, response: str):
        """
        Save the answer for next time.
        """
        key = self._generate_key(user_id, query, intent)
        
        # Decide how long to keep it based on intent
        if intent == "factual":
            ttl = CACHE_TTL_FACTUAL # Keep facts for a week
        else:
            ttl = CACHE_TTL_CASUAL  # Keep chat for an hour
        
        data = {
            "response": response,
            "cached_at": "just_now",
            "intent": intent
        }
        
        # Save to Redis with Expiration (setex = SET with EXpiry)
        self.redis.setex(key, ttl, json.dumps(data))