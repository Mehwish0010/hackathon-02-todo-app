from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlmodel import Session

from app.core.database import get_db
from app.core.dependencies import verify_user_access
from app.schemas.auth import CurrentUser
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services import task_service


router = APIRouter()


@router.post(
    "/users/{user_id}/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create task",
    description="Creates a new task for the authenticated user.",
)
async def create_task(
    task_data: TaskCreate,
    user_id: str = Path(..., description="User ID"),
    current_user: CurrentUser = Depends(verify_user_access),
    db: Session = Depends(get_db),
) -> TaskResponse:
    """Create a new task for the authenticated user."""
    task = task_service.create_task(db, current_user.id, task_data)
    return TaskResponse.model_validate(task)


@router.get(
    "/users/{user_id}/tasks",
    response_model=List[TaskResponse],
    summary="List user tasks",
    description="Returns all tasks belonging to the authenticated user.",
)
async def list_tasks(
    user_id: str = Path(..., description="User ID"),
    current_user: CurrentUser = Depends(verify_user_access),
    db: Session = Depends(get_db),
) -> List[TaskResponse]:
    """Get all tasks for the authenticated user."""
    tasks = task_service.get_tasks(db, current_user.id)
    return [TaskResponse.model_validate(task) for task in tasks]


@router.get(
    "/users/{user_id}/tasks/{task_id}",
    response_model=TaskResponse,
    summary="Get task",
    description="Returns a specific task by ID.",
)
async def get_task(
    user_id: str = Path(..., description="User ID"),
    task_id: str = Path(..., description="Task UUID"),
    current_user: CurrentUser = Depends(verify_user_access),
    db: Session = Depends(get_db),
) -> TaskResponse:
    """Get a specific task by ID."""
    task = task_service.get_task(db, current_user.id, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return TaskResponse.model_validate(task)


@router.put(
    "/users/{user_id}/tasks/{task_id}",
    response_model=TaskResponse,
    summary="Update task",
    description="Updates an existing task.",
)
async def update_task(
    task_data: TaskUpdate,
    user_id: str = Path(..., description="User ID"),
    task_id: str = Path(..., description="Task UUID"),
    current_user: CurrentUser = Depends(verify_user_access),
    db: Session = Depends(get_db),
) -> TaskResponse:
    """Update an existing task."""
    task = task_service.update_task(db, current_user.id, task_id, task_data)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return TaskResponse.model_validate(task)


@router.delete(
    "/users/{user_id}/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete task",
    description="Permanently deletes a task.",
)
async def delete_task(
    user_id: str = Path(..., description="User ID"),
    task_id: str = Path(..., description="Task UUID"),
    current_user: CurrentUser = Depends(verify_user_access),
    db: Session = Depends(get_db),
) -> None:
    """Delete a task."""
    deleted = task_service.delete_task(db, current_user.id, task_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )


@router.patch(
    "/users/{user_id}/tasks/{task_id}/complete",
    response_model=TaskResponse,
    summary="Toggle task completion",
    description="Toggles the completed status of a task.",
)
async def toggle_complete(
    user_id: str = Path(..., description="User ID"),
    task_id: str = Path(..., description="Task UUID"),
    current_user: CurrentUser = Depends(verify_user_access),
    db: Session = Depends(get_db),
) -> TaskResponse:
    """Toggle the completed status of a task."""
    task = task_service.toggle_task_complete(db, current_user.id, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return TaskResponse.model_validate(task)
