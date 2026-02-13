"""Chat API endpoints for AI-powered task management."""

import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.auth import CurrentUser
from app.schemas.chat import ChatRequest, ChatResponse, ConversationHistory, MessageItem
from app.services.conversation_service import ConversationService
from app.agent.task_agent import run_agent

# Import all tools to register them with MCP server
from app.mcp.tools.create_task import create_task  # noqa: F401
from app.mcp.tools.list_tasks import list_tasks  # noqa: F401
from app.mcp.tools.update_task import update_task  # noqa: F401
from app.mcp.tools.complete_task import complete_task  # noqa: F401
from app.mcp.tools.delete_task import delete_task  # noqa: F401

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Send a chat message to the AI agent.

    The agent processes natural language requests and manages tasks via MCP tools.
    Conversation history is persisted to the database.
    """
    user_id = current_user.id

    logger.info(f"Chat request from user {user_id}: {request.message[:50]}...")

    # Get or create conversation
    conversation_service = ConversationService(db)
    conversation = conversation_service.get_or_create_conversation(user_id)

    # Load conversation history
    messages = conversation_service.get_messages(conversation.id)
    conversation_history = [
        {"role": msg.role, "content": msg.content}
        for msg in messages
    ]

    # Save user message
    conversation_service.save_message(
        conversation_id=conversation.id,
        role="user",
        content=request.message,
    )

    try:
        # Run the AI agent
        agent_response = await run_agent(
            user_id=user_id,
            message=request.message,
            conversation_history=conversation_history,
        )

        # Save assistant response
        conversation_service.save_message(
            conversation_id=conversation.id,
            role="assistant",
            content=agent_response,
        )

        logger.info(f"Agent response for user {user_id}: {agent_response[:50]}...")

        return ChatResponse(
            message=agent_response,
            conversation_id=conversation.id,
        )

    except Exception as e:
        logger.error(f"Chat error for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat request",
        )


@router.get("/history", response_model=ConversationHistory)
async def get_chat_history(
    limit: Optional[int] = Query(
        default=50,
        ge=1,
        le=100,
        description="Maximum number of messages to return",
    ),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get conversation history for the authenticated user.

    Returns messages ordered by timestamp (oldest first).
    """
    user_id = current_user.id

    conversation_service = ConversationService(db)
    conversation = conversation_service.get_conversation_for_user(user_id)

    if not conversation:
        return ConversationHistory(
            conversation_id="",
            messages=[],
        )

    messages = conversation_service.get_messages(
        conversation_id=conversation.id,
        limit=limit,
    )

    return ConversationHistory(
        conversation_id=conversation.id,
        messages=[
            MessageItem(
                id=msg.id,
                role=msg.role,
                content=msg.content,
                created_at=msg.created_at,
            )
            for msg in messages
        ],
    )
