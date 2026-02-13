from pydantic import BaseModel, EmailStr


class TokenPayload(BaseModel):
    """JWT token payload structure."""
    sub: str  # User ID
    email: str
    iat: int  # Issued at timestamp
    exp: int  # Expiration timestamp


class CurrentUser(BaseModel):
    """Authenticated user context available to API handlers."""
    id: str
    email: str

    class Config:
        from_attributes = True
