import os
from celery import Celery

# 1. Define the Broker (Redis)
# We use the same Redis instance you used for Chat History
REDIS_URL = "redis://localhost:6379/0"

# 2. Create the Celery App
celery_app = Celery(
    "ai_twin_worker",
    broker=REDIS_URL,
    backend=REDIS_URL
)

# 3. Configure Tasks
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)