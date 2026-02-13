"""MCP tool for creating tasks."""

from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Session

from app.core.database import engine
from app.models.task import Task
from app.mcp.server import register_mcp_tool


@register_mcp_tool(
    name="create_task",
    description="Create a new task for the user with a title and optional description.",
    parameters={
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "description": "Task title (required, max 200 characters)",
            },
            "description": {
                "type": "string",
                "description": "Task description (optional, max 1000 characters)",
            },
        },
        "required": ["title"],
    },
)
async def create_task(
    user_id: str,
    title: str,
    description: Optional[str] = None,
) -> str:
    """
    Create a new task for the authenticated user.

    Args:
        user_id: User ID from JWT (injected by system)
        title: Task title (required)
        description: Task description (optional)

    Returns:
        Confirmation message with task details
    """
    # Validate title
    if not title or not title.strip():
        return "Error: Task title is required"

    title = title.strip()
    if len(title) > 200:
        return "Error: Title must be 200 characters or less"

    # Validate description if provided
    if description:
        description = description.strip()
        if len(description) > 1000:
            return "Error: Description must be 1000 characters or less"

    # Create task in database
    with Session(engine) as session:
        task = Task(
            title=title,
            description=description,
            user_id=user_id,
            completed=False,
        )
        session.add(task)
        session.commit()
        session.refresh(task)

        # Build response message
        if description:
            return f'Created task "{task.title}" (ID: {task.id}). Description: {description}'
        else:
            return f'Created task "{task.title}" (ID: {task.id}).'
