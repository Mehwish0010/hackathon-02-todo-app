from jose import jwt, JWTError
from fastapi import HTTPException, status
from app.core.config import settings


def verify_token(token: str) -> dict:
    """
    Verify JWT token signature and decode payload.

    Args:
        token: JWT token string

    Returns:
        Decoded token payload dictionary

    Raises:
        HTTPException: 401 if token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
