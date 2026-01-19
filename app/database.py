from sqlmodel import SQLModel, create_engine, Session

# 1. The File Name (Simple SQLite for now)
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# 2. The Engine
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

# 3. The Builder Function
# This looks at all your SQLModel classes (like User) and creates the tables.
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# 4. The Session Generator
# This is for Dependency Injection. It gives a fresh database session 
# for each request and closes it when done.
def get_session():
    with Session(engine) as session:
        yield session