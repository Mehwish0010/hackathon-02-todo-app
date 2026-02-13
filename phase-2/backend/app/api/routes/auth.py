from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user, verify_user_access
from app.schemas.auth import CurrentUser

router = APIRouter()


@router.get("/me", response_model=CurrentUser)
async def get_current_user_info(
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Get current authenticated user information.

    Requires valid JWT token in Authorization header.
    Returns user ID and email from token payload.
    """
    return current_user


@router.get("/users/{user_id}/verify")
async def verify_user_access_endpoint(
    user_id: str,
    current_user: CurrentUser = Depends(verify_user_access)
):
    """
    Verify that authenticated user has access to specified user_id.

    Returns 403 if URL user_id doesn't match token user_id.
    """
    return {
        "verified": True,
        "user_id": user_id,
    }
