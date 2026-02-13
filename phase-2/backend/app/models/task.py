from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4
from sqlmodel import Field, SQLModel


class Task(SQLModel, table=True):
    """Task entity for user todo items."""

    __tablename__ = "task"

    id: str = Field(
        default_factory=lambda: str(uuid4()),
        primary_key=True,
        description="Unique task identifier (UUID)",
    )
    title: str = Field(
        max_length=200,
        description="Task title (required)",
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Optional task description",
    )
    completed: bool = Field(
        default=False,
        description="Whether task is completed",
    )
    user_id: str = Field(
        index=True,
        description="Owner user ID (from JWT token)",
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Creation timestamp (UTC)",
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Last update timestamp (UTC)",
    )
