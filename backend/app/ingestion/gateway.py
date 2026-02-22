import os
from datetime import datetime, timezone

from app.pipeline.contracts import NormalizedMessage


def normalize_telegram_message(payload: dict) -> NormalizedMessage | None:
    message = payload.get("message")
    if not message:
        return None

    text = message.get("text")
    if not text:
        return None

    chat = message.get("chat", {})
    sender = message.get("from", {})

    organization_id = os.getenv("DEFAULT_ORGANIZATION_ID", "default-org")
    user_id = os.getenv("DEFAULT_PIPELINE_USER_ID", "yash")

    return NormalizedMessage(
        organization_id=organization_id,
        user_id=user_id,
        source="telegram",
        external_message_id=str(message.get("message_id", "")),
        external_user_id=str(sender.get("id", "")),
        external_chat_id=str(chat.get("id")) if chat.get("id") is not None else None,
        text=text,
        timestamp=datetime.now(timezone.utc),
        metadata={
            "sender_name": sender.get("first_name", "Friend"),
            "chat_type": chat.get("type", "private"),
        },
    )
