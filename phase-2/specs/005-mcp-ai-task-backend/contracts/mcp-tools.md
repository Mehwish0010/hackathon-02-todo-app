# MCP Tool Definitions: Task Management

**Feature**: 005-mcp-ai-task-backend
**Date**: 2026-02-10
**MCP Version**: 1.0

## Overview

These tools are exposed via the MCP server and registered with the OpenAI Agents SDK agent. All tools are stateless - they read from and write to the database directly. Every tool receives `user_id` from the authenticated request context.

## Tool Definitions

### 1. create_task

Creates a new task for the authenticated user.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| user_id | string | Yes | User ID from JWT (injected by system) |
| title | string | Yes | Task title (1-200 chars) |
| description | string | No | Task description (max 1000 chars) |

**Returns**: String message confirming creation with task details.

**Example Usage**:
```json
{
  "name": "create_task",
  "arguments": {
    "user_id": "user_123",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }
}
```

**Example Response**:
```
Created task "Buy groceries" (ID: abc123). Description: Milk, eggs, bread.
```

**Error Cases**:
- Empty title → "Error: Task title is required"
- Title too long → "Error: Title must be 200 characters or less"

---

### 2. list_tasks

Lists all tasks for the authenticated user.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| user_id | string | Yes | User ID from JWT (injected by system) |
| include_completed | boolean | No | Include completed tasks (default: true) |

**Returns**: String listing all tasks with their status.

**Example Usage**:
```json
{
  "name": "list_tasks",
  "arguments": {
    "user_id": "user_123",
    "include_completed": true
  }
}
```

**Example Response**:
```
You have 3 tasks:
1. Buy groceries - pending
2. Call mom - pending
3. Finish report - completed
```

**Empty State**:
```
You have no tasks.
```

---

### 3. update_task

Updates an existing task's title or description.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| user_id | string | Yes | User ID from JWT (injected by system) |
| task_id | string | Yes | Task ID to update |
| title | string | No | New title (if provided) |
| description | string | No | New description (if provided) |

**Returns**: String message confirming update.

**Example Usage**:
```json
{
  "name": "update_task",
  "arguments": {
    "user_id": "user_123",
    "task_id": "abc123",
    "title": "Buy organic groceries"
  }
}
```

**Example Response**:
```
Updated task "Buy organic groceries" (ID: abc123).
```

**Error Cases**:
- Task not found → "Error: Task not found"
- Task belongs to another user → "Error: Task not found" (same message for security)
- No fields to update → "Error: No fields to update provided"

---

### 4. complete_task

Toggles the completion status of a task.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| user_id | string | Yes | User ID from JWT (injected by system) |
| task_id | string | Yes | Task ID to toggle |

**Returns**: String message confirming the new status.

**Example Usage**:
```json
{
  "name": "complete_task",
  "arguments": {
    "user_id": "user_123",
    "task_id": "abc123"
  }
}
```

**Example Response (completing)**:
```
Marked task "Buy groceries" as completed.
```

**Example Response (uncompleting)**:
```
Marked task "Buy groceries" as pending.
```

**Error Cases**:
- Task not found → "Error: Task not found"

---

### 5. delete_task

Deletes a task permanently.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| user_id | string | Yes | User ID from JWT (injected by system) |
| task_id | string | Yes | Task ID to delete |

**Returns**: String message confirming deletion.

**Example Usage**:
```json
{
  "name": "delete_task",
  "arguments": {
    "user_id": "user_123",
    "task_id": "abc123"
  }
}
```

**Example Response**:
```
Deleted task "Buy groceries".
```

**Error Cases**:
- Task not found → "Error: Task not found"

---

## Security Model

### User ID Injection

The `user_id` parameter is NOT provided by the AI agent. It is injected by the system from the authenticated JWT token. This prevents:

1. Agent attempting to access other users' data
2. Prompt injection attacks trying to override user context

**Implementation**:
```python
# In chat endpoint
user_id = get_user_id_from_jwt(token)

# When calling tool, inject user_id
async def call_tool_with_context(tool_name, args):
    args["user_id"] = user_id  # Always inject, never trust agent
    return await mcp_server.call_tool(tool_name, args)
```

### Data Isolation

Every tool query includes `user_id` in the WHERE clause:

```python
# Never do this (security vulnerability)
task = session.get(Task, task_id)

# Always do this (secure)
task = session.exec(
    select(Task).where(
        Task.id == task_id,
        Task.user_id == user_id
    )
).first()
```

### Error Message Consistency

When a task is not found OR belongs to another user, return the same error message: "Error: Task not found". This prevents information leakage about task existence.

---

## MCP Server Registration

```python
from mcp.server import Server

server = Server("task-management")

@server.tool()
async def create_task(user_id: str, title: str, description: str = None) -> str:
    """Create a new task for the user."""
    # Implementation
    pass

@server.tool()
async def list_tasks(user_id: str, include_completed: bool = True) -> str:
    """List all tasks for the user."""
    # Implementation
    pass

@server.tool()
async def update_task(user_id: str, task_id: str, title: str = None, description: str = None) -> str:
    """Update an existing task."""
    # Implementation
    pass

@server.tool()
async def complete_task(user_id: str, task_id: str) -> str:
    """Toggle task completion status."""
    # Implementation
    pass

@server.tool()
async def delete_task(user_id: str, task_id: str) -> str:
    """Delete a task permanently."""
    # Implementation
    pass
```

---

## Agent System Prompt

The AI agent receives this system prompt to guide its use of tools:

```
You are a helpful task management assistant. You help users manage their todo list through natural language.

You have access to the following tools:
- create_task: Create a new task
- list_tasks: List all tasks
- update_task: Update a task's title or description
- complete_task: Mark a task as complete or pending
- delete_task: Delete a task

Guidelines:
1. When the user asks to see their tasks, use list_tasks first
2. When creating tasks, confirm the title with the user if ambiguous
3. When updating or deleting, identify the correct task by title or context
4. If multiple tasks match a description, ask the user to clarify
5. Always confirm actions taken (created, updated, deleted, completed)
6. Be concise but helpful in your responses

You cannot access tasks directly - you must use the provided tools.
```
