from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.schemas.users import Token, UserCreate
from app.db.crud import authenticate_user, register_user
from app.core.security import create_access_token
from app.config.settings import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(tags=["authentication"])

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Endpoint for user authentication and token generation"""
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]},
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", status_code=201)
async def create_user(user: UserCreate):
    """Endpoint to register a new user"""
    if register_user(user.username, user.password, user.email, user.role):
        return {"message": "User registered successfully"}
    else:
        raise HTTPException(status_code=400, detail="Username already exists")