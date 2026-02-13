# Research: Secure Backend API & Data Layer

**Feature**: 002-backend-task-api
**Date**: 2026-02-07
**Status**: Complete

## Research Questions

### RQ-1: SQLModel vs SQLAlchemy for FastAPI

**Question**: Should we use SQLModel or raw SQLAlchemy for the Task model?

**Decision**: Use SQLModel

**Rationale**:
- SQLModel is built on SQLAlchemy and Pydantic, perfect for FastAPI
- Single model definition serves as both database model and Pydantic schema
- Native integration with FastAPI's dependency injection
- Type hints work seamlessly
- Simpler code with less boilerplate

**Alternatives Considered**:
| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Raw SQLAlchemy | More control, mature | Separate schema definitions | Extra boilerplate |
| Tortoise ORM | Async native | Different paradigm | Less FastAPI integration |
| Prisma Python | Type-safe | Newer, less mature | Constitution specifies SQLModel |

---

### RQ-2: Sync vs Async Database Access

**Question**: Should we use synchronous or asynchronous database connections?

**Decision**: Use synchronous connections with sync SQLModel

**Rationale**:
- SQLModel's async support is still maturing
- Neon PostgreSQL works well with sync connections
- Simpler code and easier debugging
- FastAPI handles concurrency via thread pool for sync code
- Performance is adequate for MVP requirements

**Alternatives Considered**:
| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| asyncpg + async SQLModel | Better concurrency | More complex, less stable | Unnecessary complexity for MVP |
| databases library | Async native | Another dependency | SQLModel sufficient |

---

### RQ-3: Database Session Management Pattern

**Question**: How should database sessions be managed in FastAPI routes?

**Decision**: Use FastAPI dependency injection with yield

**Rationale**:
- Clean session lifecycle management
- Automatic cleanup on request completion
- Works with FastAPI's DI system
- Proper transaction boundaries

**Implementation Pattern**:
```python
from sqlmodel import Session, create_engine

engine = create_engine(settings.DATABASE_URL)

def get_db():
    with Session(engine) as session:
        yield session
```

---

### RQ-4: UUID Generation Strategy

**Question**: Should UUIDs be generated in Python or by the database?

**Decision**: Generate UUIDs in Python using `uuid.uuid4()`

**Rationale**:
- Consistent behavior across database backends
- IDs known before database insert (useful for responses)
- SQLModel Field with default_factory handles this cleanly
- No database-specific extensions needed

**Implementation**:
```python
from uuid import uuid4
from sqlmodel import Field

class Task(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
```

---

### RQ-5: Timestamp Handling

**Question**: How should created_at and updated_at timestamps be managed?

**Decision**: Use Python datetime with UTC, auto-update on save

**Rationale**:
- Consistent UTC timestamps across all environments
- SQLModel Field with default_factory for created_at
- Manual update of updated_at in service layer for clarity
- Avoid database-specific triggers

**Implementation**:
```python
from datetime import datetime, timezone

class Task(SQLModel, table=True):
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

---

### RQ-6: User ID Reference Strategy

**Question**: Should Task have a foreign key to User table?

**Decision**: Store user_id as string without database-level foreign key

**Rationale**:
- User table is managed by Better Auth (separate system)
- Avoid cross-system database constraints
- user_id validated at application layer via JWT
- Simpler deployment (no migration coordination)
- Index on user_id for query performance

**Implementation**:
```python
class Task(SQLModel, table=True):
    user_id: str = Field(index=True)  # No foreign_key constraint
```

---

### RQ-7: Error Response Format

**Question**: What format should API errors use?

**Decision**: Use FastAPI's standard HTTPException format

**Rationale**:
- Consistent with FastAPI conventions
- Automatic OpenAPI documentation
- Frontend can handle uniformly
- Simple `{ "detail": "message" }` structure

**Error Mapping**:
| Scenario | Status | Detail Message |
|----------|--------|----------------|
| No token | 401 | "Authorization header required" |
| Invalid token | 401 | "Invalid or expired token" |
| Wrong user_id | 403 | "Access denied" |
| Task not found | 404 | "Task not found" |
| Validation error | 400 | Specific validation message |
| Server error | 500 | "Internal server error" |

---

## Summary of Decisions

| Area | Decision | Key Technology |
|------|----------|----------------|
| ORM | SQLModel | Pydantic + SQLAlchemy |
| DB Access | Synchronous | create_engine, Session |
| Sessions | Dependency injection | yield pattern |
| UUIDs | Python-generated | uuid.uuid4() |
| Timestamps | UTC datetime | timezone-aware |
| User Reference | String, no FK | Index for performance |
| Errors | HTTPException | FastAPI standard |

## Dependencies Confirmed

### Backend (additions to Spec 1)
- `sqlmodel`: ^0.0.14
- `psycopg2-binary`: ^2.9.9 (already confirmed working)

## Next Steps

1. Proceed to data-model.md for Task entity definition
2. Create API contracts in contracts/
3. Generate tasks.md for implementation
