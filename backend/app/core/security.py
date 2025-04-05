import hashlib
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from app.config.settings import SECRET_KEY, ALGORITHM

def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password, hashed_password):
    """Verify password against hashed password"""
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt