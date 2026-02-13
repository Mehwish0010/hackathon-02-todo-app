"""MCP tool for listing tasks."""

from typing import Optional
from sqlmodel import Session, select

from app.core.database import engine
from app.models.task import Task
from app.mcp.server import register_mcp_tool


@register_mcp_tool(
    name="list_tasks",
    description="List all tasks for the authenticated user. Returns task titles, completion status, and IDs.",
    parameters={
        "type": "object",
        "properties": {
            "include_completed": {
                "type": "boolean",
                "description": "Whether to include completed tasks (default: true)",
            },
        },
        "required": [],
    },
)
async def list_tasks(
    user_id: str,
    include_completed: bool = True,
) -> str:
    """
    List all tasks for the authenticated user.

    Args:
        user_id: User ID from JWT (injected by system)
        include_completed: Whether to include completed tasks

    Returns:
        Formatted list of tasks or message if none exist
    """
    with Session(engine) as session:
        # Build query with user isolation
        statement = select(Task).where(Task.user_id == user_id)

        if not include_completed:
            statement = statement.where(Task.completed == False)

        # Order by creation date (newest first)
        statement = statement.order_by(Task.created_at.desc())

        tasks = list(session.exec(statement).all())

        if not tasks:
            if include_completed:
                return "You have no tasks."
            else:
                return "You have no pending tasks."

        # Format task list
        lines = [f"You have {len(tasks)} task(s):"]
        for i, task in enumerate(tasks, 1):
            status = "completed" if task.completed else "pending"
            line = f"{i}. {task.title} - {status}"
            if task.description:
                line += f" (Description: {task.description[:50]}...)" if len(task.description) > 50 else f" (Description: {task.description})"
            lines.append(line)

        return "\n".join(lines)
