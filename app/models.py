from typing import Optional
from sqlmodel import Field, SQLModel

# 1. The Base Model (Shared fields)
class UserBase(SQLModel):
    username: str = Field(index=True)
    email: str
    is_active: bool = True

# 2. The Database Table (What sits in the hard drive)
# It inherits username/email from UserBase, but adds the 'secret' hash.
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str 

# 3. The Input Schema (What the user sends in JSON)
# It inherits username/email, but adds the 'plain' password.
class UserCreate(UserBase):
    password: str

# ... (keep your existing imports and User class)

class Memory(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    text: str
    created_at: str  # We will store ISO timestamp string for simplicity

class MemoryCreate(SQLModel):
    text: str