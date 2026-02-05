# Quickstart: In-Memory Console Todo Application

**Branch**: `001-console-todo-app` | **Date**: 2026-02-05

## Prerequisites

- Python 3.11 or later installed
- A terminal/command prompt
- (For testing) pytest installed: `pip install pytest`

## Run the Application

```bash
python src/main.py
```

The application displays a numbered menu:

```text
=== Todo Application ===
1. Add todo
2. List todos
3. Update todo
4. Toggle todo status
5. Delete todo
6. Exit
========================
Choose an option:
```

Type the number of your choice and press Enter.

## Usage Examples

### Add a todo

```text
Choose an option: 1
Enter title: Buy groceries
Enter description (press Enter to skip): Milk, eggs, bread
Todo created: [1] Buy groceries
```

### List all todos

```text
Choose an option: 2

ID  | Title           | Status    | Description
----|-----------------|-----------|------------------
1   | Buy groceries   | pending   | Milk, eggs, bread
```

### Update a todo

```text
Choose an option: 3
Enter todo ID: 1
Enter new title (press Enter to keep current): Buy organic groceries
Enter new description (press Enter to keep current):
Todo updated: [1] Buy organic groceries
```

### Toggle status

```text
Choose an option: 4
Enter todo ID: 1
Todo [1] status changed to: completed
```

### Delete a todo

```text
Choose an option: 5
Enter todo ID: 1
Todo deleted: [1] Buy organic groceries
```

### Exit

```text
Choose an option: 6
Goodbye!
```

## Run Tests

```bash
pytest tests/ -v
```

Expected test categories:
- `tests/unit/test_todo_model.py` — Todo dataclass creation and
  validation
- `tests/unit/test_todo_service.py` — CRUD and toggle operations
- `tests/integration/test_cli_flow.py` — End-to-end menu interaction
  using monkeypatched input/output

## Smoke Test Checklist

After running the app, verify these manually:

1. [ ] Add a todo with title and description — confirmation shown
2. [ ] Add a todo with title only — confirmation shown
3. [ ] List todos — all items displayed with ID, title, status
4. [ ] Update a todo's title — updated title shown in listing
5. [ ] Toggle a todo to "completed" — status changes in listing
6. [ ] Toggle same todo back to "pending" — status reverts
7. [ ] Delete a todo — removed from listing
8. [ ] Enter invalid menu choice — error shown, menu re-displayed
9. [ ] Enter non-numeric ID — error shown, menu re-displayed
10. [ ] Try to add todo with empty title — error shown
11. [ ] Try to update non-existent ID — error shown
12. [ ] Exit — farewell message, clean termination

## Project Structure

```text
src/
├── __init__.py
├── models/
│   ├── __init__.py
│   └── todo.py
├── services/
│   ├── __init__.py
│   └── todo_service.py
├── cli/
│   ├── __init__.py
│   └── menu.py
└── main.py

tests/
├── __init__.py
├── unit/
│   ├── __init__.py
│   ├── test_todo_model.py
│   └── test_todo_service.py
└── integration/
    ├── __init__.py
    └── test_cli_flow.py
```

## Notes

- All data is in-memory only. Closing the application discards all
  todos. This is expected behavior for Phase I.
- No external libraries are used at runtime (stdlib only).
- pytest is the only development dependency.
