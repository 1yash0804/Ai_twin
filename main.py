from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from jose import JWTError, jwt

# Imports from your folders
from app.database import create_db_and_tables, get_session
from app.models import User, UserCreate
from app.core.security import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    SECRET_KEY, 
    ALGORITHM
)

# 1. SETUP
# This tells FastAPI: "If a user wants to access a VIP route, look for the token here"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    print("✅ Database connected!")
    yield

app = FastAPI(lifespan=lifespan)

# 2. THE BOUNCER (The missing piece!) 🛡️
# This function checks if the token is valid before letting anyone in.
async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # A. Decode the Token (Read the wristband)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # B. Check Database (Make sure user is still real)
    user = session.exec(select(User).where(User.username == username)).first()
    if user is None:
        raise credentials_exception
    return user

# 3. PUBLIC ROUTES (Open to everyone)
@app.get("/health")
def health_check():
    return {"status": "active"}

@app.post("/users/", response_model=User)
def create_user(user_input: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.username == user_input.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_pwd = get_password_hash(user_input.password)
    user_db = User(
        username=user_input.username, 
        email=user_input.email, 
        hashed_password=hashed_pwd, 
        is_active=user_input.is_active
    )
    session.add(user_db)
    session.commit()
    session.refresh(user_db)
    return user_db

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Incorrect username or password", 
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# 4. PROTECTED ROUTE (VIP Room) 🔒
# Notice: current_user: User = Depends(get_current_user)
# This forces the user to have a valid token to see this.
@app.get("/users/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)