import os

from sqlalchemy import inspect, text
from sqlmodel import SQLModel, Session, create_engine

# Prefer externally-provided database URLs (Railway/Postgres in production).
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")

# 2. The Engine
is_sqlite = DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)


def _add_column_if_missing(table_name: str, column_name: str, ddl: str):
    """Best-effort SQLite schema patch for existing local databases."""
    inspector = inspect(engine)
    if not inspector.has_table(table_name):
        return

    existing_columns = {column["name"] for column in inspector.get_columns(table_name)}
    if column_name in existing_columns:
        return

    with engine.begin() as conn:
        conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {ddl}"))


# 3. The Builder Function
# This looks at all your SQLModel classes (like User) and creates the tables.
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

    # Backward-compatible schema updates for existing SQLite files.
    _add_column_if_missing("memory", "source", "source VARCHAR DEFAULT 'chat'")
    _add_column_if_missing("tasks", "title", "title VARCHAR")
    _add_column_if_missing("tasks", "priority", "priority VARCHAR DEFAULT 'medium'")
    _add_column_if_missing("tasks", "confidence_score", "confidence_score FLOAT DEFAULT 0.0")


# 4. The Session Generator
# This is for Dependency Injection. It gives a fresh database session
# for each request and closes it when done.
def get_session():
    with Session(engine) as session:
        yield session
