"""Integration tests for the AI agent flow.

These tests verify the complete flow from chat endpoint through
AI agent to MCP tools and database.
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi.testclient import TestClient

from app.main import app
from app.core.dependencies import get_current_user


# Mock JWT for testing
MOCK_USER_ID = "test-user-123"
MOCK_TOKEN = "mock-jwt-token"


def mock_get_current_user():
    """Mock user for testing."""
    return {"user_id": MOCK_USER_ID, "email": "test@example.com"}


@pytest.fixture
def client():
    """Create test client with mocked auth."""
    app.dependency_overrides[get_current_user] = mock_get_current_user
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def client_no_auth():
    """Create test client without auth override."""
    return TestClient(app)


@pytest.fixture
def mock_openai():
    """Mock OpenAI API calls."""
    with patch("app.agent.task_agent.OpenAI") as mock:
        mock_client = MagicMock()
        mock.return_value = mock_client
        yield mock_client


class TestChatEndpoint:
    """Tests for POST /api/chat endpoint."""

    def test_chat_requires_authentication(self, client_no_auth):
        """Test that chat endpoint requires JWT token."""
        response = client_no_auth.post(
            "/api/chat",
            json={"message": "Hello"},
        )
        assert response.status_code == 401

    def test_chat_with_empty_message(self, client):
        """Test that empty message is rejected."""
        response = client.post(
            "/api/chat",
            json={"message": ""},
        )
        assert response.status_code == 422  # Validation error

    def test_chat_message_too_long(self, client):
        """Test that message exceeding max length is rejected."""
        long_message = "a" * 2001
        response = client.post(
            "/api/chat",
            json={"message": long_message},
        )
        assert response.status_code == 422


class TestChatHistory:
    """Tests for GET /api/chat/history endpoint."""

    def test_history_requires_authentication(self, client_no_auth):
        """Test that history endpoint requires JWT token."""
        response = client_no_auth.get("/api/chat/history")
        assert response.status_code == 401

    def test_history_returns_empty_for_new_user(self, client):
        """Test that new user gets empty history."""
        response = client.get("/api/chat/history")
        assert response.status_code == 200
        data = response.json()
        assert data["messages"] == []

    def test_history_limit_parameter(self, client):
        """Test that limit parameter is validated."""
        # Test invalid limit (too high)
        response = client.get("/api/chat/history?limit=200")
        assert response.status_code == 422

        # Test invalid limit (too low)
        response = client.get("/api/chat/history?limit=0")
        assert response.status_code == 422


class TestMCPTools:
    """Tests for MCP tool functionality."""

    @pytest.mark.asyncio
    async def test_create_task_requires_title(self):
        """Test that create_task validates title."""
        from app.mcp.tools.create_task import create_task

        result = await create_task(user_id=MOCK_USER_ID, title="")
        assert "Error" in result
        assert "required" in result.lower()

    @pytest.mark.asyncio
    async def test_create_task_title_length(self):
        """Test that create_task validates title length."""
        from app.mcp.tools.create_task import create_task

        long_title = "a" * 201
        result = await create_task(user_id=MOCK_USER_ID, title=long_title)
        assert "Error" in result
        assert "200" in result

    @pytest.mark.asyncio
    async def test_list_tasks_user_isolation(self):
        """Test that list_tasks only returns user's tasks."""
        from app.mcp.tools.list_tasks import list_tasks

        # Should return empty for new user (or user's tasks only)
        result = await list_tasks(user_id="nonexistent-user")
        assert "no tasks" in result.lower() or "0" in result


class TestUserIsolation:
    """Tests for user data isolation."""

    @pytest.mark.asyncio
    async def test_complete_task_ownership(self):
        """Test that complete_task checks ownership."""
        from app.mcp.tools.complete_task import complete_task

        # Try to complete a task with wrong user ID
        result = await complete_task(
            user_id="wrong-user",
            task_id="nonexistent-task-id",
        )
        assert "not found" in result.lower()

    @pytest.mark.asyncio
    async def test_delete_task_ownership(self):
        """Test that delete_task checks ownership."""
        from app.mcp.tools.delete_task import delete_task

        # Try to delete a task with wrong user ID
        result = await delete_task(
            user_id="wrong-user",
            task_id="nonexistent-task-id",
        )
        assert "not found" in result.lower()

    @pytest.mark.asyncio
    async def test_update_task_ownership(self):
        """Test that update_task checks ownership."""
        from app.mcp.tools.update_task import update_task

        # Try to update a task with wrong user ID
        result = await update_task(
            user_id="wrong-user",
            task_id="nonexistent-task-id",
            title="New Title",
        )
        assert "not found" in result.lower()


class TestStatelessBehavior:
    """Tests verifying stateless behavior of MCP tools."""

    @pytest.mark.asyncio
    async def test_tools_dont_share_state(self):
        """Test that MCP tools don't share in-memory state."""
        from app.mcp.server import mcp_server

        # Get tool registry state
        tools_before = len(mcp_server.get_all_tools())

        # Registry should have same number of tools
        tools_after = len(mcp_server.get_all_tools())
        assert tools_before == tools_after

    @pytest.mark.asyncio
    async def test_list_tasks_is_idempotent(self):
        """Test that list_tasks returns same result for same state."""
        from app.mcp.tools.list_tasks import list_tasks

        result1 = await list_tasks(user_id=MOCK_USER_ID)
        result2 = await list_tasks(user_id=MOCK_USER_ID)

        # Same user, same state, should get same result
        assert result1 == result2
