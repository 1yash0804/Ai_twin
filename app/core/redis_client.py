import redis
import json
import os

# Connect to localhost Redis (Standard Port 6379)
# In production, you would load these from .env
r = redis.Redis(host='127.0.0.1', port=6379, db=0, decode_responses=True)

def get_chat_history(user_id: int, limit: int = 6):
    """
    Retrieves the last 'limit' messages for a specific user.
    """
    key = f"chat:{user_id}"
    # Redis List: Get elements from 0 to -1 (all), then slice the last 'limit'
    history = r.lrange(key, 0, -1)
    
    # Convert JSON strings back to dicts
    return [json.loads(msg) for msg in history][-limit:]

def add_message_to_history(user_id: int, role: str, content: str):
    """
    Saves a single message (User or AI) to Redis.
    """
    key = f"chat:{user_id}"
    message = json.dumps({"role": role, "content": content})
    
    # Push to the end of the list (Right Push)
    r.rpush(key, message)
    
    # Optional: Trim list to keep only last 20 messages (Save RAM)
    r.ltrim(key, -20, -1)
    
    # Optional: Set expiry so memory clears after 24 hours of inactivity
    r.expire(key, 86400)