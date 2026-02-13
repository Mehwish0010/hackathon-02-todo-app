# Implementation Plan: Secure Backend API & Data Layer

**Branch**: `002-backend-task-api` | **Date**: 2026-02-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-backend-task-api/spec.md`

## Summary

Implement a secure, user-isolated REST API for task management using FastAPI, SQLModel, and Neon Serverless PostgreSQL. The API provides full CRUD operations for tasks, with JWT-based authentication ensuring each user can only access their own data.

**Primary Requirements**:
- 6 RESTful endpoints for task management (create, list, get, update, delete, toggle)
- JWT authentication on all endpoints (reuse from Spec 1)
- User ownership verification (URL user_id must match token user_id)
- Persistent storage with Neon PostgreSQL via SQLModel

**Technical Approach**:
- Extend existing FastAPI backend from Spec 1
- Create Task SQLModel with user_id foreign key
- Reuse `get_current_user` and `verify_user_access` dependencies
- Implement task service layer for business logic
- All queries filtered by authenticated user ID

## Technical Context

**Language/Version**: Python 3.11+

**Primary Dependencies**:
- FastAPI (from Spec 1)
- SQLModel (ORM)
- python-jose (JWT, from Spec 1)
- psycopg2-binary (PostgreSQL driver)
- pydantic-settings (configuration)

**Storage**: Neon Serverless PostgreSQL (persistent, production-ready)

**Testing**: pytest with httpx for API tests

**Target Platform**: Linux server (Docker-compatible)

**Project Type**: Web application backend (extends Spec 1)

**Performance Goals**:
- Task CRUD operations < 500ms
- Support 100+ tasks per user

**Constraints**:
- JWT is sole authentication mechanism
- No backend session storage
- All queries must filter by user_id
- URL user_id must match token user_id

**Scale/Scope**: Multi-user application, ~1000 concurrent users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Spec-Driven Development | ✅ PASS | Spec exists at `spec.md`, plan being created before tasks |
| II. Security-First Architecture | ✅ PASS | JWT required on all endpoints, 401/403 for auth failures |
| III. User Data Isolation | ✅ PASS | All queries filtered by user_id, ownership verified |
| IV. Fixed Technology Stack | ✅ PASS | Using FastAPI, SQLModel, Neon PostgreSQL |
| V. RESTful API Standards | ✅ PASS | Standard HTTP methods and status codes |
| VI. Responsive Frontend Design | N/A | Backend-only feature |

**Gate Result**: PASS - All applicable constitution principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/002-backend-task-api/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - Task entity definition
├── quickstart.md        # Phase 1 output - API testing guide
├── contracts/           # Phase 1 output - API contracts
│   └── tasks-api.yaml   # OpenAPI specification
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (extends existing backend)

```text
backend/
├── app/
│   ├── main.py                    # FastAPI app (update to include tasks router)
│   ├── core/
│   │   ├── config.py              # Settings (exists from Spec 1)
│   │   ├── security.py            # JWT verification (exists from Spec 1)
│   │   ├── dependencies.py        # Auth dependencies (exists from Spec 1)
│   │   └── database.py            # NEW: Database engine and session
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.py            # Auth routes (exists from Spec 1)
│   │   │   └── tasks.py           # NEW: Task CRUD routes
│   │   └── deps.py                # NEW: Shared API dependencies
│   ├── models/
│   │   └── task.py                # NEW: Task SQLModel
│   ├── schemas/
│   │   ├── auth.py                # Auth schemas (exists from Spec 1)
│   │   └── task.py                # NEW: Task request/response schemas
│   └── services/
│       └── task_service.py        # NEW: Task business logic
├── tests/
│   ├── conftest.py                # NEW: Test fixtures
│   └── test_tasks.py              # NEW: Task API tests
└── requirements.txt               # Updated with sqlmodel, psycopg2-binary
```

**Structure Decision**: Extend existing backend structure from Spec 1. Add database layer, Task model, and task routes.

## Implementation Phases

### Phase 1: Database Layer Setup

**Purpose**: Configure database connection and session management

**Steps**:
1. Update `backend/requirements.txt` to add `sqlmodel` and `psycopg2-binary`
2. Update `backend/app/core/config.py` to include DATABASE_URL setting
3. Create `backend/app/core/database.py` with SQLModel engine and session
4. Create database session dependency for route handlers
5. Add startup event to create tables on app initialization

**Inputs**: DATABASE_URL from environment
**Outputs**: Working database connection, session dependency

### Phase 2: Task Model Definition

**Purpose**: Define Task entity with SQLModel

**Steps**:
1. Create `backend/app/models/__init__.py`
2. Create `backend/app/models/task.py` with Task SQLModel class
3. Define fields: id (UUID), title, description, completed, user_id, created_at, updated_at
4. Add field validators for max lengths (title: 200, description: 1000)
5. Configure table name and indexes

**Inputs**: Entity definition from data-model.md
**Outputs**: Task model ready for CRUD operations

### Phase 3: Task Schemas

**Purpose**: Define Pydantic schemas for request/response validation

**Steps**:
1. Create `backend/app/schemas/task.py`
2. Define `TaskCreate` schema (title required, description optional)
3. Define `TaskUpdate` schema (all fields optional for partial update)
4. Define `TaskResponse` schema (full task with all fields)
5. Define `TaskListResponse` schema (list of tasks)

**Inputs**: API contract definitions
**Outputs**: Request/response validation schemas

### Phase 4: Task Service Layer

**Purpose**: Implement business logic for task operations

**Steps**:
1. Create `backend/app/services/__init__.py`
2. Create `backend/app/services/task_service.py`
3. Implement `create_task(db, user_id, task_data)` function
4. Implement `get_tasks(db, user_id)` function
5. Implement `get_task(db, user_id, task_id)` function
6. Implement `update_task(db, user_id, task_id, task_data)` function
7. Implement `delete_task(db, user_id, task_id)` function
8. Implement `toggle_task_complete(db, user_id, task_id)` function
9. All functions filter by user_id for security

**Inputs**: Task model, database session
**Outputs**: Reusable service functions

### Phase 5: Task API Routes

**Purpose**: Implement REST endpoints for task management

**Steps**:
1. Create `backend/app/api/routes/tasks.py`
2. Implement `POST /api/v1/users/{user_id}/tasks` - create task
3. Implement `GET /api/v1/users/{user_id}/tasks` - list tasks
4. Implement `GET /api/v1/users/{user_id}/tasks/{task_id}` - get task
5. Implement `PUT /api/v1/users/{user_id}/tasks/{task_id}` - update task
6. Implement `DELETE /api/v1/users/{user_id}/tasks/{task_id}` - delete task
7. Implement `PATCH /api/v1/users/{user_id}/tasks/{task_id}/complete` - toggle
8. All routes use `verify_user_access` dependency from Spec 1
9. Return appropriate HTTP status codes (200, 201, 204, 400, 404)

**Inputs**: Task service, auth dependencies
**Outputs**: Complete task API

### Phase 6: Router Integration

**Purpose**: Register task routes in main application

**Steps**:
1. Update `backend/app/main.py` to import tasks router
2. Include tasks router with prefix `/api/v1`
3. Add database startup event to create tables
4. Verify CORS settings include frontend origin

**Inputs**: Task router module
**Outputs**: Integrated API with all endpoints

### Phase 7: Error Handling

**Purpose**: Implement consistent error responses

**Steps**:
1. Create custom exception handlers for common errors
2. Handle 400 Bad Request for validation errors
3. Handle 404 Not Found for missing tasks
4. Handle 403 Forbidden for ownership violations
5. Handle 500 Internal Server Error with safe messages
6. Ensure no sensitive data leaked in error responses

**Inputs**: Exception types from FastAPI
**Outputs**: Consistent error handling

### Phase 8: Testing & Verification

**Purpose**: Verify API functionality and security

**Steps**:
1. Create `backend/tests/conftest.py` with test fixtures
2. Create `backend/tests/test_tasks.py` with API tests
3. Test all CRUD operations with valid tokens
4. Test 401 response without token
5. Test 403 response with mismatched user_id
6. Test 404 response for non-existent tasks
7. Test validation errors (empty title, too long fields)
8. Verify data persistence across requests

**Inputs**: Test client, test database
**Outputs**: Verified API functionality

## Handoff Points

### Handoff to Spec 3 (Frontend Task UI)

The task API provides:

1. **Task Endpoints** - All CRUD operations ready for frontend integration:
   ```
   POST   /api/v1/users/{user_id}/tasks           - Create task
   GET    /api/v1/users/{user_id}/tasks           - List tasks
   GET    /api/v1/users/{user_id}/tasks/{id}      - Get task
   PUT    /api/v1/users/{user_id}/tasks/{id}      - Update task
   DELETE /api/v1/users/{user_id}/tasks/{id}      - Delete task
   PATCH  /api/v1/users/{user_id}/tasks/{id}/complete - Toggle complete
   ```

2. **Request/Response Formats**:
   - Create: `{ "title": "...", "description": "..." }` → 201
   - List: `[]` array of tasks → 200
   - Update: `{ "title": "...", "description": "..." }` → 200
   - Delete: No body → 204

3. **Error Responses**:
   - 400: `{ "detail": "Validation error message" }`
   - 401: `{ "detail": "Authorization header required" }`
   - 403: `{ "detail": "Access denied" }`
   - 404: `{ "detail": "Task not found" }`

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Database connection pool exhaustion | API becomes unresponsive | Configure connection pooling, use Neon's pooler |
| User_id in URL bypass attempt | Data leakage | verify_user_access checks token vs URL |
| SQL injection | Data breach | SQLModel uses parameterized queries |
| Large task lists slow response | Poor UX | Future: add pagination (out of scope for MVP) |

## Complexity Tracking

No constitution violations requiring justification. Implementation follows all principles.

## Next Steps

1. Run `/sp.tasks` to generate task breakdown
2. Execute tasks via `/sp.implement`
3. Create Spec 3 for Frontend Task UI after API complete
