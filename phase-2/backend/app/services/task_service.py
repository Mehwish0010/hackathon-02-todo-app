from datetime import datetime, timezone
from typing import List, Optional
from sqlmodel import Session, select
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


def create_task(db: Session, user_id: str, task_data: TaskCreate) -> Task:
    """
    Create a new task for the specified user.

    Args:
        db: Database session
        user_id: Owner user ID
        task_data: Task creation data

    Returns:
        Created task
    """
    task = Task(
        title=task_data.title,
        description=task_data.description,
        user_id=user_id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_tasks(db: Session, user_id: str) -> List[Task]:
    """
    Get all tasks for the specified user, ordered by created_at descending.

    Args:
        db: Database session
        user_id: Owner user ID

    Returns:
        List of tasks belonging to the user
    """
    statement = (
        select(Task)
        .where(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
    )
    results = db.exec(statement)
    return list(results.all())


def get_task(db: Session, user_id: str, task_id: str) -> Optional[Task]:
    """
    Get a specific task by ID for the specified user.

    Args:
        db: Database session
        user_id: Owner user ID
        task_id: Task UUID

    Returns:
        Task if found and belongs to user, None otherwise
    """
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = db.exec(statement)
    return result.first()


def update_task(
    db: Session, user_id: str, task_id: str, task_data: TaskUpdate
) -> Optional[Task]:
    """
    Update an existing task for the specified user.

    Args:
        db: Database session
        user_id: Owner user ID
        task_id: Task UUID
        task_data: Fields to update

    Returns:
        Updated task if found, None otherwise
    """
    task = get_task(db, user_id, task_id)
    if not task:
        return None

    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    task.updated_at = datetime.now(timezone.utc)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, user_id: str, task_id: str) -> bool:
    """
    Delete a task for the specified user.

    Args:
        db: Database session
        user_id: Owner user ID
        task_id: Task UUID

    Returns:
        True if task was deleted, False if not found
    """
    task = get_task(db, user_id, task_id)
    if not task:
        return False

    db.delete(task)
    db.commit()
    return True


def toggle_task_complete(db: Session, user_id: str, task_id: str) -> Optional[Task]:
    """
    Toggle the completed status of a task.

    Args:
        db: Database session
        user_id: Owner user ID
        task_id: Task UUID

    Returns:
        Updated task if found, None otherwise
    """
    task = get_task(db, user_id, task_id)
    if not task:
        return None

    task.completed = not task.completed
    task.updated_at = datetime.now(timezone.utc)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task
