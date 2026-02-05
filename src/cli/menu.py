from src.models.todo import TodoCollection
from src.services.todo_service import (
    add_todo,
    delete_todo,
    list_todos,
    toggle_todo_status,
    update_todo,
)


def display_menu() -> None:
    print("\n=== Todo Application ===")
    print("1. Add todo")
    print("2. List todos")
    print("3. Update todo")
    print("4. Toggle todo status")
    print("5. Delete todo")
    print("6. Exit")
    print("========================")


def get_user_choice() -> str:
    return input("Choose an option: ")


def _prompt_id() -> int:
    raw = input("Enter todo ID: ")
    return int(raw)


def _handle_add(collection: TodoCollection) -> None:
    title = input("Enter title: ")
    description = input("Enter description (press Enter to skip): ")
    todo = add_todo(collection, title, description)
    print(f"Todo created: [{todo.id}] {todo.title}")


def _handle_list(collection: TodoCollection) -> None:
    todos = list_todos(collection)
    if not todos:
        print("\nNo todos found.")
        return
    print(f"\n{'ID':<4} | {'Title':<20} | {'Status':<10} | Description")
    print("-" * 4 + "-+-" + "-" * 20 + "-+-" + "-" * 10 + "-+-" + "-" * 20)
    for todo in todos:
        print(
            f"{todo.id:<4} | {todo.title:<20} | {todo.status:<10} | "
            f"{todo.description}"
        )


def _handle_update(collection: TodoCollection) -> None:
    todo_id = _prompt_id()
    new_title = input("Enter new title (press Enter to keep current): ")
    new_desc = input(
        "Enter new description (press Enter to keep current): "
    )
    todo = update_todo(
        collection,
        todo_id,
        title=new_title if new_title else None,
        description=new_desc if new_desc else None,
    )
    print(f"Todo updated: [{todo.id}] {todo.title}")


def _handle_toggle(collection: TodoCollection) -> None:
    todo_id = _prompt_id()
    todo = toggle_todo_status(collection, todo_id)
    print(f"Todo [{todo.id}] status changed to: {todo.status}")


def _handle_delete(collection: TodoCollection) -> None:
    todo_id = _prompt_id()
    todo = delete_todo(collection, todo_id)
    print(f"Todo deleted: [{todo.id}] {todo.title}")


def run_app() -> None:
    collection = TodoCollection()

    while True:
        display_menu()
        choice = get_user_choice().strip()

        if choice == "6":
            print("Goodbye!")
            break

        handlers = {
            "1": _handle_add,
            "2": _handle_list,
            "3": _handle_update,
            "4": _handle_toggle,
            "5": _handle_delete,
        }

        handler = handlers.get(choice)
        if handler is None:
            print("Error: Invalid choice. Please try again.")
            continue

        try:
            handler(collection)
        except ValueError as e:
            if "invalid literal" in str(e).lower():
                print("Error: Please enter a valid number.")
            else:
                print(f"Error: {e}")
