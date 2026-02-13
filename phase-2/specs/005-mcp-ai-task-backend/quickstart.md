# Quickstart: MCP AI Task Management Backend

**Feature**: 005-mcp-ai-task-backend
**Date**: 2026-02-10

## Prerequisites

- Python 3.11+
- Existing Phase II backend running
- Neon PostgreSQL database configured
- OpenAI API key

## Environment Setup

Add to your `.env` file:

```env
# Existing variables
DATABASE_URL=postgresql://...
JWT_SECRET=your-jwt-secret

# New for Phase III-A
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o  # or gpt-4-turbo
```

## Installation

```bash
cd backend

# Activate virtual environment
source .venv/bin/activate  # or .venv\Scripts\activate on Windows

# Install new dependencies
pip install openai>=1.12.0 mcp>=0.1.0
```

## Database Migration

Run the migration to create conversation and message tables:

```bash
# Option 1: Using SQLModel auto-create (development)
python -c "from app.models import *; from app.core.config import engine; SQLModel.metadata.create_all(engine)"

# Option 2: SQL migration script
psql $DATABASE_URL -f migrations/005_add_conversation_tables.sql
```

## Running the Server

```bash
uvicorn app.main:app --reload --port 8000
```

## Testing the Chat Endpoint

### 1. Get a JWT Token

First, login via the existing auth system:

```bash
# Login and get token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### 2. Send a Chat Message

```bash
# Create a task via natural language
curl -X POST http://localhost:8000/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Create a task to buy groceries"}'
```

Expected response:
```json
{
  "message": "I've created a new task called 'buy groceries' for you.",
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 3. List Tasks

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "What are my tasks?"}'
```

### 4. Complete a Task

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Mark buy groceries as done"}'
```

### 5. Get Conversation History

```bash
curl -X GET http://localhost:8000/api/chat/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Verification Checklist

### Functional Tests

- [ ] Create task via chat message
- [ ] List tasks via chat message
- [ ] Update task via chat message
- [ ] Complete task via chat message
- [ ] Delete task via chat message
- [ ] Conversation history persists across requests

### Security Tests

- [ ] Request without token returns 401
- [ ] Request with invalid token returns 401
- [ ] User A cannot see User B's tasks
- [ ] User A cannot see User B's conversation

### Stateless Tests

- [ ] Stop server, restart, conversation history still available
- [ ] Multiple concurrent requests work correctly
- [ ] No in-memory state leakage between requests

## Troubleshooting

### "OPENAI_API_KEY not set"

Ensure your `.env` file contains a valid OpenAI API key:
```env
OPENAI_API_KEY=sk-...
```

### "Connection refused" to database

Check that your Neon PostgreSQL is accessible:
```bash
psql $DATABASE_URL -c "SELECT 1"
```

### Agent not calling tools

Check the agent logs for reasoning. The agent should log:
1. User message received
2. Tool selection decision
3. Tool call and result
4. Response generation

### Slow responses

AI responses may take 2-5 seconds. This is expected due to:
1. OpenAI API latency
2. Agent reasoning time
3. Tool execution time

## Next Steps

After completing Phase III-A:

1. Run `/sp.tasks` to generate implementation tasks
2. Run `/sp.implement` to execute implementation
3. Proceed to Phase III-B (Frontend Chat UI)
