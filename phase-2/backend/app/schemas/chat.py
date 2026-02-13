"""Chat API request and response schemas."""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ChatRequest(BaseModel):
    """Request body for POST /api/chat."""

    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="User's natural language message",
        json_schema_extra={"example": "Create a task to buy groceries"},
    )


class ChatResponse(BaseModel):
    """Response body for POST /api/chat."""

    message: str = Field(
        ...,
        description="AI agent's response",
        json_schema_extra={"example": "I've created a new task called 'buy groceries' for you."},
    )
    conversation_id: str = Field(
        ...,
        description="Conversation identifier for reference",
        json_schema_extra={"example": "550e8400-e29b-41d4-a716-446655440000"},
    )


class MessageItem(BaseModel):
    """Single message in conversation history."""

    id: str = Field(..., description="Message identifier")
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    created_at: datetime = Field(..., description="Message timestamp (UTC)")


class ConversationHistory(BaseModel):
    """Response body for GET /api/chat/history."""

    conversation_id: str = Field(..., description="Conversation identifier")
    messages: List[MessageItem] = Field(
        default_factory=list,
        description="List of messages in the conversation",
    )
