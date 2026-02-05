# Internal API Contracts: In-Memory Console Todo Application

**Branch**: `001-console-todo-app` | **Date**: 2026-02-05

This document defines the function-level contracts between modules.
Phase I has no HTTP API; these are internal Python function signatures
that the CLI layer calls on the service layer, and the service layer
calls on the model layer.

## Model Layer (`src/models/todo.py`)

### `Todo` (dataclass)

```text
Todo(id: int, title: str, description: str = "", status: str = "pending")
```

- `id`: Positive integer, unique, assigned by TodoCollection.
- `title`: Non-empty string (whitespace-trimmed).
- `description`: String, may be empty.
- `status`: One of "pending" or "completed".

### `TodoCollection`

```text
TodoCollection()
```

**Attributes**:
- `items: dict[int, Todo]` — starts empty
- `next_id: int` — starts at 1

**Methods**: None on the collection itself. The service layer
operates on it directly via its public attributes. This keeps the
model layer as a pure data container.

## Service Layer (`src/services/todo_service.py`)

All service functions accept a `TodoCollection` as their first
argument. They return data or raise `ValueError` on invalid input.

### `add_todo`

```text
add_todo(collection: TodoCollection, title: str, description: str = "") -> Todo
```

- **Preconditions**: `title` is non-empty after stripping whitespace.
- **Postconditions**: New Todo added to `collection.items` with
  `id = collection.next_id`. Counter incremented. Returns the
  created Todo.
- **Errors**: Raises `ValueError("Title cannot be empty")` if title
  is blank.

### `list_todos`

```text
list_todos(collection: TodoCollection) -> list[Todo]
```

- **Preconditions**: None.
- **Postconditions**: Returns list of all Todo items in insertion
  order. Returns empty list if no todos exist.
- **Errors**: None.

### `update_todo`

```text
update_todo(collection: TodoCollection, todo_id: int,
            title: str | None = None,
            description: str | None = None) -> Todo
```

- **Preconditions**: `todo_id` exists in collection. If `title` is
  provided, it MUST be non-empty after stripping.
- **Postconditions**: Updates the specified fields on the Todo. Returns
  the updated Todo.
- **Errors**:
  - `ValueError("Todo with ID {todo_id} not found")` if ID missing.
  - `ValueError("Title cannot be empty")` if title is blank.

### `toggle_todo_status`

```text
toggle_todo_status(collection: TodoCollection, todo_id: int) -> Todo
```

- **Preconditions**: `todo_id` exists in collection.
- **Postconditions**: Flips status from "pending" to "completed" or
  vice versa. Returns the updated Todo.
- **Errors**: `ValueError("Todo with ID {todo_id} not found")` if
  ID missing.

### `delete_todo`

```text
delete_todo(collection: TodoCollection, todo_id: int) -> Todo
```

- **Preconditions**: `todo_id` exists in collection.
- **Postconditions**: Removes the Todo from `collection.items`.
  Returns the deleted Todo (for confirmation display).
- **Errors**: `ValueError("Todo with ID {todo_id} not found")` if
  ID missing.

## CLI Layer (`src/cli/menu.py`)

### `display_menu`

```text
display_menu() -> None
```

- Prints the numbered menu to stdout.
- Menu options: Add, List, Update, Toggle Status, Delete, Exit.

### `get_user_choice`

```text
get_user_choice() -> str
```

- Reads one line from stdin via `input()`.
- Returns the raw string (validation happens in the router).

### `run_app`

```text
run_app() -> None
```

- Creates a `TodoCollection`.
- Enters a loop: display menu → get choice → route to service
  function → display result or error → repeat.
- Exits loop when user selects the exit option.
- Catches `ValueError` from service calls and displays user-friendly
  messages.
- Catches `ValueError` from `int()` conversion for non-numeric IDs.

## Entry Point (`src/main.py`)

```text
main() -> None
```

- Calls `run_app()` from the CLI module.
- Guarded by `if __name__ == "__main__":`.

## Error Contract

All errors between layers use `ValueError` with a descriptive message
string. The CLI layer catches these and prints them to stdout prefixed
with "Error: ". The application never crashes on user input; it always
returns to the menu.

| Error Scenario        | Raised By     | Message Template                      |
|-----------------------|---------------|---------------------------------------|
| Empty title           | Service layer | "Title cannot be empty"               |
| Todo not found        | Service layer | "Todo with ID {id} not found"         |
| Invalid menu choice   | CLI layer     | "Invalid choice. Please try again."   |
| Non-numeric input     | CLI layer     | "Please enter a valid number."        |
