from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE user ADD COLUMN telegram_connect_token VARCHAR"))
    conn.execute(text("ALTER TABLE user ADD COLUMN telegram_connect_token_at DATETIME"))
    conn.commit()

print("Done ✓")