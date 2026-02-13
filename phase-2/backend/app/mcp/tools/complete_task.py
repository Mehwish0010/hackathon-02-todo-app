"""MCP tool for completing/uncompleting tasks."""

from datetime import datetime, timezone
from sqlmodel import Session, select

from app.core.database import engine
from app.models.task import Task
from app.mcp.server import register_mcp_tool


@register_mcp_tool(
    name="complete_task",
    description="Toggle the completion status of a task. If the task is pending, mark it as completed. If completed, mark it as pending.",
    parameters={
        "type": "object",
        "properties": {
            "task_id": {
                "type": "string",
                "description": "The ID of the task to toggle",
            },
            "task_title": {
                "type": "string",
                "description": "The title of the task to toggle (used to find task if ID unknown)",
            },
        },
        "required": [],
    },
)
async def complete_task(
    user_id: str,
    task_id: str = None,
    task_title: str = None,
) -> str:
    """
    Toggle completion status of a task.

    Args:
        user_id: User ID from JWT (injected by system)
        task_id: Task ID to toggle (optional)
        task_title: Task title to find and toggle (optional)

    Returns:
        Confirmation message with new status
    """
    if not task_id and not task_title:
        return "Error: Please provide either a task ID or task title"

    with Session(engine) as session:
        # Find task with ownership check
        if task_id:
            statement = select(Task).where(
                Task.id == task_id,
                Task.user_id == user_id  # Security: ownership check
            )
        else:
            # Search by title (case-insensitive partial match)
            statement = select(Task).where(
                Task.user_id == user_id,
                Task.title.ilike(f"%{task_title}%")
            )

        task = session.exec(statement).first()

        if not task:
            return "Error: Task not found"

        # Toggle completion status
        task.completed = not task.completed
        task.updated_at = datetime.now(timezone.utc)

        session.add(task)
        session.commit()
        session.refresh(task)

        new_status = "completed" if task.completed else "pending"
        return f'Marked task "{task.title}" as {new_status}.'
