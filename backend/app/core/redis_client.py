import redis
import json
import os

# Connect to Redis — gracefully handle if not running
try:
    r = redis.Redis(
        host='127.0.0.1', 
        port=6379, 
        db=0, 
        decode_responses=True,
        socket_connect_timeout=2
    )
    r.ping()
    redis_client = r
    print("[cache] Redis connected")
except Exception:
    redis_client = None
    r = None
    print("[cache] Redis not available — caching disabled")


def get_chat_history(user_id: int, limit: int = 6):
    if not r:
        return []
    try:
        key = f"chat:{user_id}"
        history = r.lrange(key, 0, -1)
        return [json.loads(msg) for msg in history][-limit:]
    except Exception:
        return []


def add_message_to_history(user_id: int, role: str, content: str):
    if not r:
        return
    try:
        key = f"chat:{user_id}"
        message = json.dumps({"role": role, "content": content})
        r.rpush(key, message)
        r.ltrim(key, -20, -1)
        r.expire(key, 86400)
    except Exception:
        pass