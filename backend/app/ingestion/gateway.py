import os
from datetime import datetime, timezone

from app.pipeline.contracts import NormalizedMessage

# Set this in your .env to your bot's Telegram username e.g. "my_aitwin_bot"
TELEGRAM_BOT_USERNAME = os.getenv("TELEGRAM_BOT_USERNAME", "")


def normalize_telegram_message(payload: dict) -> NormalizedMessage | None:
    message = payload.get("message")
    if not message:
        return None

    text = message.get("text")
    if not text:
        return None

    chat = message.get("chat", {})
    sender = message.get("from", {})
    chat_type = chat.get("type", "private")  # private | group | supergroup | channel

    organization_id = os.getenv("DEFAULT_ORGANIZATION_ID", "default-org")
    user_id = os.getenv("DEFAULT_PIPELINE_USER_ID", "yash")

    # Detect if the bot was @mentioned in the message
    is_mention = False
    if TELEGRAM_BOT_USERNAME:
        is_mention = f"@{TELEGRAM_BOT_USERNAME}".lower() in text.lower()

    # Clean the @mention from text so it doesn't confuse the LLM
    clean_text = text
    if is_mention and TELEGRAM_BOT_USERNAME:
        clean_text = text.replace(f"@{TELEGRAM_BOT_USERNAME}", "").strip()

    # Build a readable sender label for dashboard display
    first_name = sender.get("first_name", "")
    last_name = sender.get("last_name", "")
    sender_username = sender.get("username", "")
    sender_name = f"{first_name} {last_name}".strip() or sender_username or "Friend"

    return NormalizedMessage(
        organization_id=organization_id,
        user_id=user_id,
        source="telegram",
        external_message_id=str(message.get("message_id", "")),
        external_user_id=str(sender.get("id", "")),
        external_chat_id=str(chat.get("id")) if chat.get("id") is not None else None,
        text=clean_text,
        timestamp=datetime.now(timezone.utc),
        metadata={
            "sender_name": sender_name,
            "sender_username": sender_username,
            "chat_type": chat_type,
            "is_group": chat_type in ("group", "supergroup"),
            "is_mention": is_mention,
            "chat_title": chat.get("title", ""),  # group name if applicable
            "raw_payload": payload,
        },
    )