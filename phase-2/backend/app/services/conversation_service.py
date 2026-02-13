"""Conversation service for chat persistence operations."""

from datetime import datetime, timezone
from typing import List, Optional
from sqlmodel import Session, select

from app.models.conversation import Conversation
from app.models.message import Message


class ConversationService:
    """Service for managing conversations and messages."""

    def __init__(self, session: Session):
        """Initialize with database session."""
        self.session = session

    def get_or_create_conversation(self, user_id: str) -> Conversation:
        """
        Get existing conversation for user or create a new one.

        Args:
            user_id: User ID from JWT token

        Returns:
            Conversation for the user
        """
        statement = select(Conversation).where(Conversation.user_id == user_id)
        conversation = self.session.exec(statement).first()

        if not conversation:
            conversation = Conversation(user_id=user_id)
            self.session.add(conversation)
            self.session.commit()
            self.session.refresh(conversation)

        return conversation

    def get_messages(
        self,
        conversation_id: str,
        limit: Optional[int] = None,
    ) -> List[Message]:
        """
        Get messages for a conversation, ordered by timestamp.

        Args:
            conversation_id: Conversation ID
            limit: Maximum number of messages to return (optional)

        Returns:
            List of messages ordered by created_at
        """
        statement = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at)
        )

        if limit:
            statement = statement.limit(limit)

        return list(self.session.exec(statement).all())

    def save_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
    ) -> Message:
        """
        Save a new message to the conversation.

        Args:
            conversation_id: Parent conversation ID
            role: Message role ('user' or 'assistant')
            content: Message content

        Returns:
            Created message
        """
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
        )
        self.session.add(message)

        # Update conversation's updated_at timestamp
        conversation = self.session.get(Conversation, conversation_id)
        if conversation:
            conversation.updated_at = datetime.now(timezone.utc)

        self.session.commit()
        self.session.refresh(message)
        return message

    def get_conversation_for_user(self, user_id: str) -> Optional[Conversation]:
        """
        Get conversation for a specific user (without creating).

        Args:
            user_id: User ID from JWT token

        Returns:
            Conversation if exists, None otherwise
        """
        statement = select(Conversation).where(Conversation.user_id == user_id)
        return self.session.exec(statement).first()
