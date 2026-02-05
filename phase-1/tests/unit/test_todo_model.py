from src.models.todo import Todo, TodoCollection


class TestTodo:
    def test_create_with_defaults(self):
        todo = Todo(id=1, title="Test")
        assert todo.id == 1
        assert todo.title == "Test"
        assert todo.description == ""
        assert todo.status == "pending"

    def test_create_with_all_fields(self):
        todo = Todo(id=2, title="Buy milk", description="2%", status="completed")
        assert todo.id == 2
        assert todo.title == "Buy milk"
        assert todo.description == "2%"
        assert todo.status == "completed"

    def test_mutable_fields(self):
        todo = Todo(id=1, title="Original")
        todo.title = "Updated"
        todo.status = "completed"
        assert todo.title == "Updated"
        assert todo.status == "completed"


class TestTodoCollection:
    def test_empty_on_init(self):
        collection = TodoCollection()
        assert collection.items == {}
        assert collection.next_id == 1

    def test_items_is_dict(self):
        collection = TodoCollection()
        assert isinstance(collection.items, dict)

    def test_separate_instances_are_independent(self):
        c1 = TodoCollection()
        c2 = TodoCollection()
        c1.items[1] = Todo(id=1, title="Only in c1")
        assert 1 not in c2.items
