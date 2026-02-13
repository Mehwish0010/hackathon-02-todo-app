from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(min_length=1, max_length=200, description="Task title (required)")
    description: Optional[str] = Field(
        default=None, max_length=1000, description="Optional task description"
    )


class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""

    title: Optional[str] = Field(
        default=None, min_length=1, max_length=200, description="New task title"
    )
    description: Optional[str] = Field(
        default=None, max_length=1000, description="New task description"
    )
    completed: Optional[bool] = Field(default=None, description="Task completion status")


class TaskResponse(BaseModel):
    """Schema for task response."""

    id: str
    title: str
    description: Optional[str]
    completed: bool
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
