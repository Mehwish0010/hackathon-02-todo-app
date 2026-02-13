# Data Model: Secure Backend API & Data Layer

**Feature**: 002-backend-task-api
**Date**: 2026-02-07
**Status**: Complete

## Entity Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Task                                  │
│  (Persisted in Neon PostgreSQL via SQLModel)                │
├─────────────────────────────────────────────────────────────┤
│  id: str (UUID)               [PK]                          │
│  title: str                   [NOT NULL, max 200]           │
│  description: str | None      [max 1000]                    │
│  completed: bool              [NOT NULL, default: false]    │
│  user_id: str                 [NOT NULL, indexed]           │
│  created_at: datetime         [NOT NULL, UTC]               │
│  updated_at: datetime         [NOT NULL, UTC]               │
└─────────────────────────────────────────────────────────────┘
           │
           │ N:1 (logical reference, no FK constraint)
           ▼
┌─────────────────────────────────────────────────────────────┐
│                        User                                  │
│  (Managed by Better Auth - from Spec 1)                     │
├─────────────────────────────────────────────────────────────┤
│  id: str (UUID)               [PK]                          │
│  email: str                   [UNIQUE]                      │
│  ...                          (other fields from Spec 1)    │
└─────────────────────────────────────────────────────────────┘
```

## Entity Definitions

### Task

**Purpose**: Represents a user's task item in the todo application.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | str (UUID) | PRIMARY KEY | Unique identifier, generated server-side |
| title | str | NOT NULL, max 200 chars | Task title (required) |
| description | str \| None | max 1000 chars | Optional task description |
| completed | bool | NOT NULL, default false | Whether task is completed |
| user_id | str | NOT NULL, indexed | Owner's user ID from JWT |
| created_at | datetime | NOT NULL | Creation timestamp (UTC) |
| updated_at | datetime | NOT NULL | Last update timestamp (UTC) |

**Validation Rules**:
- `title` is required and cannot be empty
- `title` maximum length is 200 characters
- `description` maximum length is 1000 characters
- `user_id` must match authenticated JWT token's user_id
- `completed` defaults to `false` on creation
- Timestamps are automatically set in UTC

**Indexes**:
- Primary key on `id`
- Index on `user_id` for efficient user task queries

---

## SQLModel Implementation

```python
from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4
from sqlmodel import Field, SQLModel


class Task(SQLModel, table=True):
    """Task entity for user todo items."""

    __tablename__ = "task"

    id: str = Field(
        default_factory=lambda: str(uuid4()),
        primary_key=True,
        description="Unique task identifier (UUID)",
    )
    title: str = Field(
        max_length=200,
        description="Task title (required)",
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Optional task description",
    )
    completed: bool = Field(
        default=False,
        description="Whether task is completed",
    )
    user_id: str = Field(
        index=True,
        description="Owner user ID (from JWT token)",
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Creation timestamp (UTC)",
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Last update timestamp (UTC)",
    )
```

---

## Request/Response Schemas

### TaskCreate (Request)

```python
class TaskCreate(SQLModel):
    """Schema for creating a new task."""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
```

### TaskUpdate (Request)

```python
class TaskUpdate(SQLModel):
    """Schema for updating an existing task."""
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None
```

### TaskResponse (Response)

```python
class TaskResponse(SQLModel):
    """Schema for task response."""
    id: str
    title: str
    description: Optional[str]
    completed: bool
    user_id: str
    created_at: datetime
    updated_at: datetime
```

---

## Database Schema (SQL)

```sql
CREATE TABLE task (
    id VARCHAR PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for efficient user task queries
CREATE INDEX idx_task_user_id ON task(user_id);
```

---

## Entity Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| Task → User | N:1 | Many tasks belong to one user |
| User → Task | 1:N | One user can have many tasks |

**Note**: No database-level foreign key constraint. User ID is validated at the application layer via JWT token verification. This allows Better Auth (managing users) and the Task API to be deployed independently.

---

## State Transitions

### Task Lifecycle

```
[No Task]
    │
    │ POST /api/v1/users/{user_id}/tasks
    │ (title, description)
    ▼
[Active Task] (completed: false)
    │
    ├──── PUT (update title/description) ────┐
    │                                         │
    │     PATCH /complete                     │
    ▼                                         │
[Completed Task] (completed: true) ◄─────────┘
    │
    │     PATCH /complete (toggle back)
    ▼
[Active Task] (completed: false)
    │
    │ DELETE /api/v1/users/{user_id}/tasks/{id}
    ▼
[Deleted] (removed from database)
```

### Completion Toggle

```
┌─────────────────┐     PATCH /complete     ┌─────────────────┐
│ completed: false│ ──────────────────────► │ completed: true │
│                 │ ◄────────────────────── │                 │
└─────────────────┘     PATCH /complete     └─────────────────┘
```

---

## Query Patterns

### List User Tasks
```sql
SELECT * FROM task WHERE user_id = :user_id ORDER BY created_at DESC;
```

### Get Single Task (with ownership check)
```sql
SELECT * FROM task WHERE id = :task_id AND user_id = :user_id;
```

### Create Task
```sql
INSERT INTO task (id, title, description, completed, user_id, created_at, updated_at)
VALUES (:id, :title, :description, false, :user_id, :now, :now)
RETURNING *;
```

### Update Task
```sql
UPDATE task
SET title = :title, description = :description, updated_at = :now
WHERE id = :task_id AND user_id = :user_id
RETURNING *;
```

### Delete Task
```sql
DELETE FROM task WHERE id = :task_id AND user_id = :user_id;
```

### Toggle Completion
```sql
UPDATE task
SET completed = NOT completed, updated_at = :now
WHERE id = :task_id AND user_id = :user_id
RETURNING *;
```

---

## Security Considerations

1. **User Isolation**: Every query includes `user_id = :user_id` filter
2. **No Cross-User Access**: Task queries always scoped to authenticated user
3. **ID Validation**: UUIDs prevent sequential ID enumeration attacks
4. **No FK Constraint**: Prevents user deletion from cascading (explicit handling required)
