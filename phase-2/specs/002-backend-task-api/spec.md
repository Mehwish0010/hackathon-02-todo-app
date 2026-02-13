# Feature Specification: Secure Backend API & Data Layer

**Feature Branch**: `002-backend-task-api`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "Secure Backend API & Data Layer for Task Management"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Task (Priority: P1)

An authenticated user wants to create a new task. They provide task details through the API, and the system creates the task associated with their user ID.

**Why this priority**: Creating tasks is the foundational action that enables all other task management functionality.

**Independent Test**: Make a POST request with valid JWT token and task data, verify task is created and returned with generated ID.

**Acceptance Scenarios**:

1. **Given** an authenticated user with valid JWT, **When** they POST to `/api/v1/users/{user_id}/tasks` with title and description, **Then** a new task is created with status 201 and the task data is returned.

2. **Given** an authenticated user, **When** they POST without a title (required field), **Then** the system returns 400 Bad Request with validation error.

3. **Given** a request without JWT token, **When** POST is made to create task, **Then** the system returns 401 Unauthorized.

4. **Given** an authenticated user, **When** they POST to a different user's endpoint (`user_id` doesn't match token), **Then** the system returns 403 Forbidden.

---

### User Story 2 - List User Tasks (Priority: P1)

An authenticated user wants to view all their tasks. The system returns only tasks belonging to the authenticated user.

**Why this priority**: Viewing tasks is essential for users to manage their work and see what needs to be done.

**Independent Test**: Make a GET request with valid JWT, verify only tasks for that user are returned.

**Acceptance Scenarios**:

1. **Given** an authenticated user with tasks, **When** they GET `/api/v1/users/{user_id}/tasks`, **Then** they receive a list of only their tasks with status 200.

2. **Given** an authenticated user with no tasks, **When** they GET their tasks endpoint, **Then** they receive an empty list with status 200.

3. **Given** an authenticated user, **When** they try to GET another user's tasks, **Then** the system returns 403 Forbidden.

4. **Given** no JWT token, **When** GET request is made, **Then** the system returns 401 Unauthorized.

---

### User Story 3 - Get Single Task (Priority: P1)

An authenticated user wants to view details of a specific task they own.

**Why this priority**: Users need to view individual task details for editing or reference.

**Independent Test**: Make a GET request for a specific task ID, verify correct task is returned.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they GET `/api/v1/users/{user_id}/tasks/{task_id}` for their own task, **Then** they receive the task details with status 200.

2. **Given** an authenticated user, **When** they GET a task that doesn't exist, **Then** the system returns 404 Not Found.

3. **Given** an authenticated user, **When** they GET another user's task, **Then** the system returns 403 Forbidden.

---

### User Story 4 - Update Task (Priority: P1)

An authenticated user wants to modify a task they own, such as changing the title or description.

**Why this priority**: Users need to update task information as requirements change.

**Independent Test**: Make a PUT request with updated data, verify task is modified and returned.

**Acceptance Scenarios**:

1. **Given** an authenticated user with a task, **When** they PUT to `/api/v1/users/{user_id}/tasks/{task_id}` with new data, **Then** the task is updated and returned with status 200.

2. **Given** an authenticated user, **When** they PUT with invalid data (empty title), **Then** the system returns 400 Bad Request.

3. **Given** an authenticated user, **When** they try to update another user's task, **Then** the system returns 403 Forbidden.

4. **Given** an authenticated user, **When** they try to update a non-existent task, **Then** the system returns 404 Not Found.

---

### User Story 5 - Delete Task (Priority: P2)

An authenticated user wants to delete a task they no longer need.

**Why this priority**: Important for task management but less frequent than create/update operations.

**Independent Test**: Make a DELETE request, verify task is removed and cannot be retrieved.

**Acceptance Scenarios**:

1. **Given** an authenticated user with a task, **When** they DELETE `/api/v1/users/{user_id}/tasks/{task_id}`, **Then** the task is deleted with status 204 No Content.

2. **Given** an authenticated user, **When** they try to delete another user's task, **Then** the system returns 403 Forbidden.

3. **Given** an authenticated user, **When** they try to delete a non-existent task, **Then** the system returns 404 Not Found.

4. **Given** a deleted task, **When** user tries to GET it, **Then** the system returns 404 Not Found.

---

### User Story 6 - Toggle Task Completion (Priority: P2)

An authenticated user wants to mark a task as complete or incomplete.

**Why this priority**: Core productivity feature but builds on existing task infrastructure.

**Independent Test**: Make a PATCH request to toggle completion, verify status changes.

**Acceptance Scenarios**:

1. **Given** an authenticated user with an incomplete task, **When** they PATCH `/api/v1/users/{user_id}/tasks/{task_id}/complete`, **Then** the task is marked complete with status 200.

2. **Given** an authenticated user with a complete task, **When** they PATCH the same endpoint, **Then** the task is marked incomplete (toggled) with status 200.

3. **Given** an authenticated user, **When** they try to toggle another user's task, **Then** the system returns 403 Forbidden.

---

### Edge Cases

- What happens when task title exceeds maximum length (200 characters)?
  - System returns 400 Bad Request with validation error.

- What happens when description exceeds maximum length (1000 characters)?
  - System returns 400 Bad Request with validation error.

- What happens when database connection fails during a request?
  - System returns 500 Internal Server Error with generic message (no details leaked).

- What happens when user tries to create task with duplicate title?
  - Task is created successfully (duplicate titles allowed per user).

- What happens when JWT token expires during a long session?
  - Next request returns 401 Unauthorized, user must re-authenticate.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST require valid JWT token for all task endpoints.
- **FR-002**: System MUST extract user identity from JWT token payload.
- **FR-003**: System MUST verify URL `user_id` matches authenticated token `user_id`.
- **FR-004**: System MUST return 401 Unauthorized for missing or invalid tokens.
- **FR-005**: System MUST return 403 Forbidden when `user_id` doesn't match token.
- **FR-006**: System MUST filter all task queries by authenticated user ID.
- **FR-007**: System MUST create tasks with required fields: title (string, max 200 chars).
- **FR-008**: System MUST support optional task fields: description (string, max 1000 chars).
- **FR-009**: System MUST auto-generate task ID (UUID) on creation.
- **FR-010**: System MUST auto-set `completed` to false on task creation.
- **FR-011**: System MUST auto-set `created_at` and `updated_at` timestamps.
- **FR-012**: System MUST return task list for authenticated user only.
- **FR-013**: System MUST return single task details for owner only.
- **FR-014**: System MUST update task fields for owner only.
- **FR-015**: System MUST delete tasks for owner only.
- **FR-016**: System MUST toggle task completion status via PATCH endpoint.
- **FR-017**: System MUST return 404 Not Found for non-existent tasks.
- **FR-018**: System MUST return 400 Bad Request for validation failures.
- **FR-019**: System MUST persist all task data to PostgreSQL database.
- **FR-020**: System MUST use standard HTTP status codes for all responses.

### Key Entities

- **Task**: Represents a user's task item. Key attributes: unique identifier (UUID), title (required, max 200 chars), description (optional, max 1000 chars), completed status (boolean), owner user ID (foreign key), creation timestamp, last update timestamp.

- **User Reference**: Tasks reference the User entity from the auth layer. The `user_id` foreign key links each task to its owner.

### Assumptions

- Task IDs are UUIDs generated server-side.
- Tasks are soft-deleted (not implemented in MVP) or hard-deleted.
- Timestamps use UTC timezone.
- Task list returns all tasks (no pagination in MVP).
- Title is the only required field; description is optional.
- Completed status defaults to `false` on creation.
- No task ordering is guaranteed (database natural order).

### Out of Scope

- Admin or superuser endpoints
- Cross-user task sharing
- Bulk task operations (create/update/delete multiple)
- Advanced filtering or search
- Pagination or sorting
- Task categories or tags
- Task due dates or priorities
- Background jobs or queues
- GraphQL or WebSocket APIs
- Soft delete with recovery

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 6 API endpoints respond correctly (create, list, get, update, delete, toggle).
- **SC-002**: 100% of requests without valid JWT return 401 Unauthorized.
- **SC-003**: 100% of requests with mismatched `user_id` return 403 Forbidden.
- **SC-004**: Users can only see and modify their own tasks (zero cross-user data access).
- **SC-005**: Task creation completes in under 500ms.
- **SC-006**: Task list retrieval completes in under 500ms for up to 100 tasks.
- **SC-007**: All task data persists correctly across server restarts.
- **SC-008**: API returns appropriate HTTP status codes for all scenarios (200, 201, 204, 400, 401, 403, 404, 500).
- **SC-009**: Hackathon judges can trace complete CRUD flow via API calls.
- **SC-010**: No sensitive data (passwords, internal errors) exposed in API responses.
