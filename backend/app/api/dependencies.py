from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.schemas.users import TokenData
from app.db.crud import get_user
from app.config.settings import SECRET_KEY, ALGORITHM

# OAuth2 scheme for token-based authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Verify JWT token and return current user"""
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_doctor(current_user: dict = Depends(get_current_user)):
    """Check if current user is a doctor"""
    if current_user["role"] != "Doctor":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user