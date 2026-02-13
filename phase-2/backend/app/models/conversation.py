"""Conversation model for chat persistence."""

from datetime import datetime, timezone
from typing import List, TYPE_CHECKING
from uuid import uuid4
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.models.message import Message


class Conversation(SQLModel, table=True):
    """Chat conversation for a user. One conversation per user (append-only)."""

    __tablename__ = "conversation"

    id: str = Field(
        default_factory=lambda: str(uuid4()),
        primary_key=True,
        description="Unique conversation identifier (UUID)",
    )
    user_id: str = Field(
        unique=True,
        index=True,
        description="Owner user ID (from JWT token)",
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Creation timestamp (UTC)",
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Last activity timestamp (UTC)",
    )

    # Relationship to messages
    messages: List["Message"] = Relationship(back_populates="conversation")
