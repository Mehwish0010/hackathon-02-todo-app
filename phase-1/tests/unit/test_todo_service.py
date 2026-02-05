import pytest

from src.models.todo import TodoCollection
from src.services.todo_service import (
    add_todo,
    delete_todo,
    list_todos,
    toggle_todo_status,
    update_todo,
)


# --- T011: add_todo tests ---


class TestAddTodo:
    def test_returns_todo_with_correct_fields(self):
        c = TodoCollection()
        todo = add_todo(c, "Buy groceries", "Milk, eggs")
        assert todo.id == 1
        assert todo.title == "Buy groceries"
        assert todo.description == "Milk, eggs"
        assert todo.status == "pending"

    def test_id_auto_increments(self):
        c = TodoCollection()
        t1 = add_todo(c, "First")
        t2 = add_todo(c, "Second")
        assert t1.id == 1
        assert t2.id == 2
        assert c.next_id == 3

    def test_added_to_collection(self):
        c = TodoCollection()
        todo = add_todo(c, "Task")
        assert c.items[1] is todo

    def test_empty_title_raises_value_error(self):
        c = TodoCollection()
        with pytest.raises(ValueError, match="Title cannot be empty"):
            add_todo(c, "")

    def test_whitespace_only_title_raises_value_error(self):
        c = TodoCollection()
        with pytest.raises(ValueError, match="Title cannot be empty"):
            add_todo(c, "   ")

    def test_title_is_stripped(self):
        c = TodoCollection()
        todo = add_todo(c, "  Trimmed  ")
        assert todo.title == "Trimmed"

    def test_description_defaults_to_empty(self):
        c = TodoCollection()
        todo = add_todo(c, "No desc")
        assert todo.description == ""


# --- T012: list_todos tests ---


class TestListTodos:
    def test_empty_collection_returns_empty_list(self):
        c = TodoCollection()
        assert list_todos(c) == []

    def test_returns_all_todos_in_insertion_order(self):
        c = TodoCollection()
        t1 = add_todo(c, "First")
        t2 = add_todo(c, "Second")
        t3 = add_todo(c, "Third")
        result = list_todos(c)
        assert result == [t1, t2, t3]

    def test_returns_list_type(self):
        c = TodoCollection()
        add_todo(c, "Item")
        result = list_todos(c)
        assert isinstance(result, list)


# --- T018: update_todo tests ---


class TestUpdateTodo:
    def test_update_title_only(self):
        c = TodoCollection()
        add_todo(c, "Original", "Desc")
        updated = update_todo(c, 1, title="New Title")
        assert updated.title == "New Title"
        assert updated.description == "Desc"

    def test_update_description_only(self):
        c = TodoCollection()
        add_todo(c, "Title", "Old desc")
        updated = update_todo(c, 1, description="New desc")
        assert updated.title == "Title"
        assert updated.description == "New desc"

    def test_update_both(self):
        c = TodoCollection()
        add_todo(c, "Old Title", "Old Desc")
        updated = update_todo(c, 1, title="New Title", description="New Desc")
        assert updated.title == "New Title"
        assert updated.description == "New Desc"

    def test_nonexistent_id_raises_value_error(self):
        c = TodoCollection()
        with pytest.raises(ValueError, match="Todo with ID 99 not found"):
            update_todo(c, 99, title="X")

    def test_empty_title_raises_value_error(self):
        c = TodoCollection()
        add_todo(c, "Valid")
        with pytest.raises(ValueError, match="Title cannot be empty"):
            update_todo(c, 1, title="")

    def test_title_is_stripped(self):
        c = TodoCollection()
        add_todo(c, "Original")
        updated = update_todo(c, 1, title="  Stripped  ")
        assert updated.title == "Stripped"

    def test_no_changes_when_none_passed(self):
        c = TodoCollection()
        add_todo(c, "Keep", "Same")
        updated = update_todo(c, 1)
        assert updated.title == "Keep"
        assert updated.description == "Same"


# --- T022: toggle_todo_status tests ---


class TestToggleTodoStatus:
    def test_pending_to_completed(self):
        c = TodoCollection()
        add_todo(c, "Task")
        toggled = toggle_todo_status(c, 1)
        assert toggled.status == "completed"

    def test_completed_to_pending(self):
        c = TodoCollection()
        add_todo(c, "Task")
        toggle_todo_status(c, 1)
        toggled = toggle_todo_status(c, 1)
        assert toggled.status == "pending"

    def test_nonexistent_id_raises_value_error(self):
        c = TodoCollection()
        with pytest.raises(ValueError, match="Todo with ID 42 not found"):
            toggle_todo_status(c, 42)


# --- T026: delete_todo tests ---


class TestDeleteTodo:
    def test_successful_deletion(self):
        c = TodoCollection()
        add_todo(c, "To delete")
        deleted = delete_todo(c, 1)
        assert deleted.title == "To delete"
        assert 1 not in c.items

    def test_returns_deleted_todo(self):
        c = TodoCollection()
        original = add_todo(c, "Item")
        deleted = delete_todo(c, 1)
        assert deleted is original

    def test_nonexistent_id_raises_value_error(self):
        c = TodoCollection()
        with pytest.raises(ValueError, match="Todo with ID 5 not found"):
            delete_todo(c, 5)

    def test_deleted_id_not_reused(self):
        c = TodoCollection()
        add_todo(c, "First")
        delete_todo(c, 1)
        second = add_todo(c, "Second")
        assert second.id == 2
        assert 1 not in c.items
