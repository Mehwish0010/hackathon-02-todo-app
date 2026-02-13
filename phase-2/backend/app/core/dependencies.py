from fastapi import Depends, HTTPException, status, Header, Path
from typing import Optional
from app.core.security import verify_token
from app.schemas.auth import CurrentUser


async def get_current_user(
    authorization: Optional[str] = Header(None, description="Bearer token")
) -> CurrentUser:
    """
    FastAPI dependency to extract and verify authenticated user from JWT token.

    Args:
        authorization: Authorization header value (Bearer <token>)

    Returns:
        CurrentUser with id and email from token payload

    Raises:
        HTTPException: 401 if token is missing, invalid, or expired
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format. Use: Bearer <token>",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split(" ")[1]
    payload = verify_token(token)

    user_id = payload.get("sub")
    email = payload.get("email")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return CurrentUser(id=user_id, email=email or "")


async def verify_user_access(
    user_id: str = Path(..., description="User ID from URL"),
    current_user: CurrentUser = Depends(get_current_user)
) -> CurrentUser:
    """
    Verify that the authenticated user has access to the requested user_id resource.

    Args:
        user_id: User ID from URL path
        current_user: Authenticated user from token

    Returns:
        CurrentUser if access is granted

    Raises:
        HTTPException: 403 if user_id doesn't match token user_id
    """
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )

    return current_user
