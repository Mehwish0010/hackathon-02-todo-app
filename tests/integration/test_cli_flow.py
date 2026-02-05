from src.cli.menu import run_app


class TestFullCrudFlow:
    """T031: Integration test for full CRUD flow."""

    def test_add_list_update_toggle_delete_exit(self, monkeypatch, capsys):
        inputs = iter([
            "1",                    # Add todo
            "Buy groceries",       # Title
            "Milk, eggs, bread",   # Description
            "2",                    # List todos
            "3",                    # Update todo
            "1",                    # Todo ID
            "Buy organic groceries",  # New title
            "",                     # Keep description
            "4",                    # Toggle status
            "1",                    # Todo ID
            "2",                    # List to verify
            "5",                    # Delete todo
            "1",                    # Todo ID
            "2",                    # List to verify empty
            "6",                    # Exit
        ])
        monkeypatch.setattr("builtins.input", lambda prompt="": next(inputs))

        run_app()

        output = capsys.readouterr().out

        # Verify add confirmation
        assert "Todo created: [1] Buy groceries" in output

        # Verify listing shows the todo
        assert "Buy groceries" in output
        assert "pending" in output

        # Verify update confirmation
        assert "Todo updated: [1] Buy organic groceries" in output

        # Verify toggle confirmation
        assert "status changed to: completed" in output

        # Verify delete confirmation
        assert "Todo deleted: [1] Buy organic groceries" in output

        # Verify empty list after deletion
        assert "No todos found." in output

        # Verify exit message
        assert "Goodbye!" in output


class TestErrorHandling:
    """T032: Integration test for error handling."""

    def test_invalid_menu_choice(self, monkeypatch, capsys):
        inputs = iter(["99", "6"])
        monkeypatch.setattr("builtins.input", lambda prompt="": next(inputs))
        run_app()
        output = capsys.readouterr().out
        assert "Invalid choice" in output

    def test_empty_title_error(self, monkeypatch, capsys):
        inputs = iter([
            "1",    # Add
            "",     # Empty title
            "",     # Description (won't be reached but needed)
            "6",    # Exit
        ])
        monkeypatch.setattr("builtins.input", lambda prompt="": next(inputs))
        run_app()
        output = capsys.readouterr().out
        assert "Title cannot be empty" in output

    def test_nonexistent_id_on_update(self, monkeypatch, capsys):
        inputs = iter([
            "3",    # Update
            "999",  # Non-existent ID
            "",     # Title
            "",     # Description
            "6",    # Exit
        ])
        monkeypatch.setattr("builtins.input", lambda prompt="": next(inputs))
        run_app()
        output = capsys.readouterr().out
        assert "not found" in output

    def test_non_numeric_id_input(self, monkeypatch, capsys):
        inputs = iter([
            "3",      # Update
            "abc",    # Non-numeric ID
            "",       # Title
            "",       # Description
            "6",      # Exit
        ])
        monkeypatch.setattr("builtins.input", lambda prompt="": next(inputs))
        run_app()
        output = capsys.readouterr().out
        assert "valid number" in output

    def test_nonexistent_id_on_toggle(self, monkeypatch, capsys):
        inputs = iter([
            "4",    # Toggle
            "50",   # Non-existent ID
            "6",    # Exit
        ])
        monkeypatch.setattr("builtins.input", lambda prompt="": next(inputs))
        run_app()
        output = capsys.readouterr().out
        assert "not found" in output

    def test_nonexistent_id_on_delete(self, monkeypatch, capsys):
        inputs = iter([
            "5",    # Delete
            "50",   # Non-existent ID
            "6",    # Exit
        ])
        monkeypatch.setattr("builtins.input", lambda prompt="": next(inputs))
        run_app()
        output = capsys.readouterr().out
        assert "not found" in output

    def test_list_when_empty(self, monkeypatch, capsys):
        inputs = iter(["2", "6"])
        monkeypatch.setattr("builtins.input", lambda prompt="": next(inputs))
        run_app()
        output = capsys.readouterr().out
        assert "No todos found" in output

    def test_exit_with_existing_todos(self, monkeypatch, capsys):
        inputs = iter([
            "1",          # Add
            "My Task",    # Title
            "",           # Description
            "6",          # Exit
        ])
        monkeypatch.setattr("builtins.input", lambda prompt="": next(inputs))
        run_app()
        output = capsys.readouterr().out
        assert "Goodbye!" in output
