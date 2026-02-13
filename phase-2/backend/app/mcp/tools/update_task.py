"""MCP tool for updating tasks."""

from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Session, select

from app.core.database import engine
from app.models.task import Task
from app.mcp.server import register_mcp_tool


@register_mcp_tool(
    name="update_task",
    description="Update a task's title and/or description. At least one field must be provided.",
    parameters={
        "type": "object",
        "properties": {
            "task_id": {
                "type": "string",
                "description": "The ID of the task to update",
            },
            "task_title_search": {
                "type": "string",
                "description": "The current title of the task to find (used if task_id unknown)",
            },
            "title": {
                "type": "string",
                "description": "New title for the task (max 200 characters)",
            },
            "description": {
                "type": "string",
                "description": "New description for the task (max 1000 characters)",
            },
        },
        "required": [],
    },
)
async def update_task(
    user_id: str,
    task_id: str = None,
    task_title_search: str = None,
    title: Optional[str] = None,
    description: Optional[str] = None,
) -> str:
    """
    Update a task's title and/or description.

    Args:
        user_id: User ID from JWT (injected by system)
        task_id: Task ID to update (optional)
        task_title_search: Current task title to find (optional)
        title: New title (optional)
        description: New description (optional)

    Returns:
        Confirmation message or error
    """
    if not task_id and not task_title_search:
        return "Error: Please provide either a task ID or current task title"

    if not title and description is None:
        return "Error: No fields to update provided"

    # Validate new values
    if title:
        title = title.strip()
        if len(title) > 200:
            return "Error: Title must be 200 characters or less"
        if not title:
            return "Error: Title cannot be empty"

    if description is not None:
        description = description.strip() if description else None
        if description and len(description) > 1000:
            return "Error: Description must be 1000 characters or less"

    with Session(engine) as session:
        # Find task with ownership check
        if task_id:
            statement = select(Task).where(
                Task.id == task_id,
                Task.user_id == user_id  # Security: ownership check
            )
        else:
            statement = select(Task).where(
                Task.user_id == user_id,
                Task.title.ilike(f"%{task_title_search}%")
            )

        task = session.exec(statement).first()

        if not task:
            return "Error: Task not found"

        # Update fields
        if title:
            task.title = title
        if description is not None:
            task.description = description if description else None

        task.updated_at = datetime.now(timezone.utc)

        session.add(task)
        session.commit()
        session.refresh(task)

        return f'Updated task "{task.title}" (ID: {task.id}).'
