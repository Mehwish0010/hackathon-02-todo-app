# Data Model: MCP-Based AI Task Management Backend

**Feature**: 005-mcp-ai-task-backend
**Date**: 2026-02-10

## Entity Overview

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│      User        │     │   Conversation   │     │     Message      │
│  (from auth)     │────<│                  │────<│                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
         │
         │
         ▼
┌──────────────────┐
│      Task        │
│   (existing)     │
└──────────────────┘
```

## Entities

### Task (Existing)

Already implemented in Phase II. No changes required.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| title | VARCHAR(200) | NOT NULL | Task title |
| description | VARCHAR(1000) | NULLABLE | Optional description |
| completed | BOOLEAN | DEFAULT FALSE | Completion status |
| user_id | VARCHAR | NOT NULL, INDEX | Owner (from JWT) |
| created_at | TIMESTAMP | NOT NULL | Creation time (UTC) |
| updated_at | TIMESTAMP | NOT NULL | Last update time (UTC) |

**Location**: `backend/app/models/task.py`

### Conversation (New)

Represents a user's chat conversation. One conversation per user (simplified model).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | VARCHAR | NOT NULL, UNIQUE, INDEX | Owner (from JWT) |
| created_at | TIMESTAMP | NOT NULL | Creation time (UTC) |
| updated_at | TIMESTAMP | NOT NULL | Last activity time (UTC) |

**Relationships**:
- One-to-many with Message (a conversation has many messages)
- Many-to-one with User (via user_id)

**Location**: `backend/app/models/conversation.py`

### Message (New)

Represents a single message in a conversation.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| conversation_id | UUID | FK, NOT NULL, INDEX | Parent conversation |
| role | VARCHAR(20) | NOT NULL | 'user' or 'assistant' |
| content | TEXT | NOT NULL | Message content |
| created_at | TIMESTAMP | NOT NULL | Message timestamp (UTC) |

**Relationships**:
- Many-to-one with Conversation

**Constraints**:
- role MUST be one of: 'user', 'assistant'
- Messages ordered by created_at for conversation context

**Location**: `backend/app/models/message.py`

## SQLModel Definitions

### Conversation Model

```python
from datetime import datetime, timezone
from typing import Optional, List
from uuid import uuid4
from sqlmodel import Field, SQLModel, Relationship


class Conversation(SQLModel, table=True):
    """Chat conversation for a user."""

    __tablename__ = "conversation"

    id: str = Field(
        default_factory=lambda: str(uuid4()),
        primary_key=True,
        description="Unique conversation identifier (UUID)",
    )
    user_id: str = Field(
        unique=True,
        index=True,
        description="Owner user ID (from JWT token)",
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Creation timestamp (UTC)",
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Last activity timestamp (UTC)",
    )

    # Relationship
    messages: List["Message"] = Relationship(back_populates="conversation")
```

### Message Model

```python
from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4
from sqlmodel import Field, SQLModel, Relationship


class Message(SQLModel, table=True):
    """Single message in a conversation."""

    __tablename__ = "message"

    id: str = Field(
        default_factory=lambda: str(uuid4()),
        primary_key=True,
        description="Unique message identifier (UUID)",
    )
    conversation_id: str = Field(
        foreign_key="conversation.id",
        index=True,
        description="Parent conversation ID",
    )
    role: str = Field(
        description="Message role: 'user' or 'assistant'",
    )
    content: str = Field(
        description="Message content",
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Message timestamp (UTC)",
    )

    # Relationship
    conversation: Optional["Conversation"] = Relationship(back_populates="messages")
```

## Database Migration

New tables to create:

```sql
-- Create conversation table
CREATE TABLE conversation (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversation_user_id ON conversation(user_id);

-- Create message table
CREATE TABLE message (
    id VARCHAR PRIMARY KEY,
    conversation_id VARCHAR NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_message_conversation_id ON message(conversation_id);
CREATE INDEX idx_message_created_at ON message(created_at);
```

## Validation Rules

### Conversation
- user_id must be valid (from authenticated JWT)
- Only one conversation per user (UNIQUE constraint)

### Message
- role must be 'user' or 'assistant'
- content cannot be empty
- conversation_id must reference existing conversation
- created_at is immutable (set once on creation)

### Task (existing)
- title required, max 200 chars
- description optional, max 1000 chars
- user_id required (from JWT)

## Query Patterns

### Load Conversation History
```python
# Get or create conversation for user
async def get_or_create_conversation(user_id: str) -> Conversation:
    conversation = session.exec(
        select(Conversation).where(Conversation.user_id == user_id)
    ).first()
    if not conversation:
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        session.commit()
    return conversation

# Load messages for conversation (ordered)
async def get_messages(conversation_id: str) -> List[Message]:
    return session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    ).all()
```

### Save Message
```python
async def save_message(conversation_id: str, role: str, content: str) -> Message:
    message = Message(
        conversation_id=conversation_id,
        role=role,
        content=content
    )
    session.add(message)
    # Update conversation's updated_at
    conversation = session.get(Conversation, conversation_id)
    conversation.updated_at = datetime.now(timezone.utc)
    session.commit()
    return message
```

### Task Operations (for MCP tools)
```python
# All task queries filter by user_id
async def list_tasks_for_user(user_id: str) -> List[Task]:
    return session.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()

async def get_task_for_user(task_id: str, user_id: str) -> Optional[Task]:
    return session.exec(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == user_id  # Security: ownership check
        )
    ).first()
```

## Data Isolation Enforcement

Every database query for tasks and conversations MUST include user_id filter:

| Operation | User Isolation |
|-----------|----------------|
| list_tasks | WHERE user_id = :user_id |
| get_task | WHERE id = :task_id AND user_id = :user_id |
| update_task | WHERE id = :task_id AND user_id = :user_id |
| delete_task | WHERE id = :task_id AND user_id = :user_id |
| get_conversation | WHERE user_id = :user_id |
| get_messages | Via conversation_id (which is user-scoped) |

This ensures compliance with Constitution Principle III (User Data Isolation).
