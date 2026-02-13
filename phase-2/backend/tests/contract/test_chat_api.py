"""Contract tests for the Chat API.

These tests verify the API conforms to the OpenAPI specification
defined in contracts/chat-api.yaml.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

from app.main import app
from app.core.dependencies import get_current_user


MOCK_USER_ID = "contract-test-user"
MOCK_TOKEN = "contract-test-token"


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


class TestChatRequestContract:
    """Tests for POST /api/chat request format."""

    def test_request_requires_message_field(self, client):
        """Test that message field is required."""
        response = client.post("/api/chat", json={})
        assert response.status_code == 422
        data = response.json()
        assert "message" in str(data).lower()

    def test_message_must_be_string(self, client):
        """Test that message must be a string."""
        response = client.post("/api/chat", json={"message": 123})
        assert response.status_code == 422

    def test_message_min_length(self, client):
        """Test that message must have minimum length of 1."""
        response = client.post("/api/chat", json={"message": ""})
        assert response.status_code == 422

    def test_message_max_length(self, client):
        """Test that message cannot exceed 2000 characters."""
        response = client.post("/api/chat", json={"message": "a" * 2001})
        assert response.status_code == 422


class TestChatResponseContract:
    """Tests for POST /api/chat response format."""

    def test_response_contains_required_fields(self, client):
        """Test that response contains message and conversation_id."""
        with patch("app.agent.task_agent.run_agent") as mock_agent:
            mock_agent.return_value = "Test response"

            response = client.post("/api/chat", json={"message": "Hello"})

            if response.status_code == 200:
                data = response.json()
                assert "message" in data
                assert "conversation_id" in data
                assert isinstance(data["message"], str)
                assert isinstance(data["conversation_id"], str)


class TestChatHistoryContract:
    """Tests for GET /api/chat/history response format."""

    def test_history_returns_correct_structure(self, client):
        """Test that history response has correct structure."""
        response = client.get("/api/chat/history")

        assert response.status_code == 200
        data = response.json()

        # Required fields per contract
        assert "conversation_id" in data
        assert "messages" in data
        assert isinstance(data["messages"], list)

    def test_history_message_structure(self, client):
        """Test that each message has correct structure."""
        # First create some messages
        with patch("app.agent.task_agent.run_agent") as mock_agent:
            mock_agent.return_value = "Test response"

            # Create a message
            client.post("/api/chat", json={"message": "Test message"})

        # Get history
        response = client.get("/api/chat/history")

        assert response.status_code == 200
        data = response.json()

        if data["messages"]:
            for msg in data["messages"]:
                assert "id" in msg
                assert "role" in msg
                assert "content" in msg
                assert "created_at" in msg
                assert msg["role"] in ["user", "assistant"]

    def test_history_limit_parameter(self, client):
        """Test limit parameter validation per contract."""
        # Valid limit
        response = client.get("/api/chat/history?limit=50")
        assert response.status_code == 200

        # Min limit (1)
        response = client.get("/api/chat/history?limit=1")
        assert response.status_code == 200

        # Max limit (100)
        response = client.get("/api/chat/history?limit=100")
        assert response.status_code == 200


class TestAuthenticationContract:
    """Tests for authentication requirements per contract."""

    def test_chat_returns_401_without_token(self, client_no_auth):
        """Test POST /api/chat returns 401 without token."""
        response = client_no_auth.post("/api/chat", json={"message": "Hello"})
        assert response.status_code == 401

    def test_history_returns_401_without_token(self, client_no_auth):
        """Test GET /api/chat/history returns 401 without token."""
        response = client_no_auth.get("/api/chat/history")
        assert response.status_code == 401

    def test_invalid_token_returns_401(self, client_no_auth):
        """Test that invalid token returns 401."""
        response = client_no_auth.post(
            "/api/chat",
            json={"message": "Hello"},
            headers={"Authorization": "Bearer invalid-token"},
        )
        assert response.status_code == 401


class TestErrorResponseContract:
    """Tests for error response format per contract."""

    def test_error_response_has_detail_field(self, client_no_auth):
        """Test that error responses include detail field."""
        response = client_no_auth.post("/api/chat", json={"message": "Hello"})

        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        assert isinstance(data["detail"], str)
