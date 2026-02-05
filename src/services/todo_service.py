from src.models.todo import Todo, TodoCollection


def add_todo(
    collection: TodoCollection, title: str, description: str = ""
) -> Todo:
    stripped = title.strip()
    if not stripped:
        raise ValueError("Title cannot be empty")
    todo = Todo(
        id=collection.next_id,
        title=stripped,
        description=description.strip(),
    )
    collection.items[todo.id] = todo
    collection.next_id += 1
    return todo


def list_todos(collection: TodoCollection) -> list[Todo]:
    return list(collection.items.values())


def update_todo(
    collection: TodoCollection,
    todo_id: int,
    title: str | None = None,
    description: str | None = None,
) -> Todo:
    if todo_id not in collection.items:
        raise ValueError(f"Todo with ID {todo_id} not found")
    todo = collection.items[todo_id]
    if title is not None:
        stripped = title.strip()
        if not stripped:
            raise ValueError("Title cannot be empty")
        todo.title = stripped
    if description is not None:
        todo.description = description.strip()
    return todo


def toggle_todo_status(collection: TodoCollection, todo_id: int) -> Todo:
    if todo_id not in collection.items:
        raise ValueError(f"Todo with ID {todo_id} not found")
    todo = collection.items[todo_id]
    todo.status = "completed" if todo.status == "pending" else "pending"
    return todo


def delete_todo(collection: TodoCollection, todo_id: int) -> Todo:
    if todo_id not in collection.items:
        raise ValueError(f"Todo with ID {todo_id} not found")
    return collection.items.pop(todo_id)
