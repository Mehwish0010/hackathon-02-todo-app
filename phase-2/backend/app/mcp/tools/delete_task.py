"""MCP tool for deleting tasks."""

from sqlmodel import Session, select

from app.core.database import engine
from app.models.task import Task
from app.mcp.server import register_mcp_tool


@register_mcp_tool(
    name="delete_task",
    description="Delete a task permanently. This action cannot be undone.",
    parameters={
        "type": "object",
        "properties": {
            "task_id": {
                "type": "string",
                "description": "The ID of the task to delete",
            },
            "task_title": {
                "type": "string",
                "description": "The title of the task to delete (used to find task if ID unknown)",
            },
        },
        "required": [],
    },
)
async def delete_task(
    user_id: str,
    task_id: str = None,
    task_title: str = None,
) -> str:
    """
    Delete a task permanently.

    Args:
        user_id: User ID from JWT (injected by system)
        task_id: Task ID to delete (optional)
        task_title: Task title to find and delete (optional)

    Returns:
        Confirmation message or error
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
            statement = select(Task).where(
                Task.user_id == user_id,
                Task.title.ilike(f"%{task_title}%")
            )

        task = session.exec(statement).first()

        if not task:
            return "Error: Task not found"

        task_title_saved = task.title

        # Delete task
        session.delete(task)
        session.commit()

        return f'Deleted task "{task_title_saved}".'
