"""Message model for conversation persistence."""

from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
from uuid import uuid4
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.models.conversation import Conversation


class Message(SQLModel, table=True):
    """Single message in a conversation."""

    __tablename__ = "message"

    id: str = Field(
        default_factory=lambda: str(uuid4()),
        primary_key=True,
        description="Unique message identifier (UUID)",
    )
    conversation_id: str = Field(
        foreign_key="conversation.id",
        index=True,
        description="Parent conversation ID",
    )
    role: str = Field(
        description="Message role: 'user' or 'assistant'",
    )
    content: str = Field(
        description="Message content",
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Message timestamp (UTC)",
    )

    # Relationship to conversation
    conversation: Optional["Conversation"] = Relationship(back_populates="messages")
