# Tasks: Secure Backend API & Data Layer

**Feature**: 002-backend-task-api
**Input**: Design documents from `/specs/002-backend-task-api/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/tasks-api.yaml

**Tests**: Tests are included as optional verification tasks in the Polish phase. Core implementation prioritized.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/app/` for FastAPI backend
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database layer and dependencies setup

- [x] T001 Update backend/requirements.txt to add sqlmodel and psycopg2-binary dependencies
- [x] T002 [P] Update backend/app/core/config.py to add DATABASE_URL setting
- [x] T003 Create backend/app/core/database.py with SQLModel engine and session dependency

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create backend/app/models/__init__.py for models package
- [x] T005 Create backend/app/models/task.py with Task SQLModel entity per data-model.md
- [x] T006 [P] Create backend/app/schemas/task.py with TaskCreate, TaskUpdate, TaskResponse schemas
- [x] T007 [P] Create backend/app/services/__init__.py for services package
- [x] T008 Create backend/app/api/routes/tasks.py with router initialization and auth dependencies

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create Task (Priority: P1) - MVP

**Goal**: Authenticated user can create a new task with title and optional description

**Independent Test**: POST /api/v1/users/{user_id}/tasks with valid JWT returns 201 with task data

### Implementation for User Story 1

- [x] T009 [US1] Implement create_task service function in backend/app/services/task_service.py
- [x] T010 [US1] Implement POST /api/v1/users/{user_id}/tasks endpoint in backend/app/api/routes/tasks.py
- [x] T011 [US1] Add title validation (required, max 200 chars) in create endpoint
- [x] T012 [US1] Add description validation (optional, max 1000 chars) in create endpoint
- [x] T013 [US1] Return 400 Bad Request for missing/empty title
- [x] T014 [US1] Return 401 Unauthorized for missing token
- [x] T015 [US1] Return 403 Forbidden for user_id mismatch

**Checkpoint**: User Story 1 complete - users can create tasks

---

## Phase 4: User Story 2 - List User Tasks (Priority: P1)

**Goal**: Authenticated user can view all their tasks

**Independent Test**: GET /api/v1/users/{user_id}/tasks with valid JWT returns 200 with task array

### Implementation for User Story 2

- [x] T016 [US2] Implement get_tasks service function in backend/app/services/task_service.py
- [x] T017 [US2] Implement GET /api/v1/users/{user_id}/tasks endpoint in backend/app/api/routes/tasks.py
- [x] T018 [US2] Filter tasks by authenticated user_id only
- [x] T019 [US2] Return empty array when user has no tasks
- [x] T020 [US2] Order tasks by created_at descending

**Checkpoint**: User Story 2 complete - users can list their tasks

---

## Phase 5: User Story 3 - Get Single Task (Priority: P1)

**Goal**: Authenticated user can view details of a specific task they own

**Independent Test**: GET /api/v1/users/{user_id}/tasks/{task_id} with valid JWT returns 200 with task

### Implementation for User Story 3

- [x] T021 [US3] Implement get_task service function in backend/app/services/task_service.py
- [x] T022 [US3] Implement GET /api/v1/users/{user_id}/tasks/{task_id} endpoint in backend/app/api/routes/tasks.py
- [x] T023 [US3] Return 404 Not Found for non-existent task
- [x] T024 [US3] Verify task belongs to authenticated user (403 for mismatch)

**Checkpoint**: User Story 3 complete - users can view individual tasks

---

## Phase 6: User Story 4 - Update Task (Priority: P1)

**Goal**: Authenticated user can modify a task they own (title, description, completed)

**Independent Test**: PUT /api/v1/users/{user_id}/tasks/{task_id} with valid JWT returns 200 with updated task

### Implementation for User Story 4

- [x] T025 [US4] Implement update_task service function in backend/app/services/task_service.py
- [x] T026 [US4] Implement PUT /api/v1/users/{user_id}/tasks/{task_id} endpoint in backend/app/api/routes/tasks.py
- [x] T027 [US4] Support partial updates (only update provided fields)
- [x] T028 [US4] Validate title constraints if provided (min 1, max 200 chars)
- [x] T029 [US4] Update updated_at timestamp on modification
- [x] T030 [US4] Return 404 Not Found for non-existent task
- [x] T031 [US4] Return 400 Bad Request for invalid data

**Checkpoint**: User Story 4 complete - users can update their tasks

---

## Phase 7: User Story 5 - Delete Task (Priority: P2)

**Goal**: Authenticated user can delete a task they no longer need

**Independent Test**: DELETE /api/v1/users/{user_id}/tasks/{task_id} with valid JWT returns 204 No Content

### Implementation for User Story 5

- [x] T032 [US5] Implement delete_task service function in backend/app/services/task_service.py
- [x] T033 [US5] Implement DELETE /api/v1/users/{user_id}/tasks/{task_id} endpoint in backend/app/api/routes/tasks.py
- [x] T034 [US5] Return 204 No Content on successful delete
- [x] T035 [US5] Return 404 Not Found for non-existent task
- [x] T036 [US5] Verify task belongs to authenticated user before delete

**Checkpoint**: User Story 5 complete - users can delete their tasks

---

## Phase 8: User Story 6 - Toggle Task Completion (Priority: P2)

**Goal**: Authenticated user can mark a task as complete or toggle back to incomplete

**Independent Test**: PATCH /api/v1/users/{user_id}/tasks/{task_id}/complete toggles completed status

### Implementation for User Story 6

- [x] T037 [US6] Implement toggle_task_complete service function in backend/app/services/task_service.py
- [x] T038 [US6] Implement PATCH /api/v1/users/{user_id}/tasks/{task_id}/complete endpoint in backend/app/api/routes/tasks.py
- [x] T039 [US6] Toggle completed from false to true and vice versa
- [x] T040 [US6] Update updated_at timestamp on toggle
- [x] T041 [US6] Return 404 Not Found for non-existent task

**Checkpoint**: User Story 6 complete - users can toggle task completion

---

## Phase 9: Router Integration & Polish

**Purpose**: Integrate routes and add cross-cutting concerns

- [x] T042 Update backend/app/main.py to import and include tasks router
- [x] T043 Add database table creation on startup event in main.py
- [x] T044 [P] Verify CORS settings include frontend origin in main.py
- [x] T045 [P] Add global exception handler for database errors
- [x] T046 Run quickstart.md verification (manual API testing)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2)
  - P1 stories (US1-US4) are core MVP functionality
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (Create Task)**: Can start after Foundational (Phase 2) - No dependencies
- **User Story 2 (List Tasks)**: Can start after US1 (needs created tasks to test)
- **User Story 3 (Get Task)**: Can start after US1 (needs task to retrieve)
- **User Story 4 (Update Task)**: Can start after US1 (needs task to update)
- **User Story 5 (Delete Task)**: Can start after US1 (needs task to delete)
- **User Story 6 (Toggle)**: Can start after US1 (needs task to toggle)

### Within Each User Story

- Service function before endpoint
- Core implementation before error handling
- Validation as part of endpoint implementation

### Parallel Opportunities

- T002 and T003 can run in parallel (config vs database)
- T006 and T007 can run in parallel (schemas vs services init)
- After US1 complete: US2-US6 can theoretically run in parallel (different endpoints, same file but additive)
- T044 and T045 can run in parallel (CORS vs error handling)

---

## Parallel Example: Foundational Phase

```bash
# Launch these foundational tasks in parallel:
Task: "Create backend/app/schemas/task.py with TaskCreate, TaskUpdate, TaskResponse schemas"
Task: "Create backend/app/services/__init__.py for services package"
```

---

## Implementation Strategy

### MVP First (User Stories 1-4)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T008)
3. Complete Phase 3: User Story 1 - Create Task (T009-T015)
4. Complete Phase 4: User Story 2 - List Tasks (T016-T020)
5. Complete Phase 5: User Story 3 - Get Task (T021-T024)
6. Complete Phase 6: User Story 4 - Update Task (T025-T031)
7. **STOP and VALIDATE**: Test CRUD operations via quickstart.md
8. Deploy/demo if ready

### Full Delivery

1. Complete MVP (Phases 1-6)
2. Add Phase 7: User Story 5 - Delete Task (T032-T036)
3. Add Phase 8: User Story 6 - Toggle Completion (T037-T041)
4. Complete Phase 9: Router Integration & Polish (T042-T046)

---

## Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 46 |
| Setup Phase | 3 tasks |
| Foundational Phase | 5 tasks |
| User Story 1 (Create) | 7 tasks |
| User Story 2 (List) | 5 tasks |
| User Story 3 (Get) | 4 tasks |
| User Story 4 (Update) | 7 tasks |
| User Story 5 (Delete) | 5 tasks |
| User Story 6 (Toggle) | 5 tasks |
| Polish Phase | 5 tasks |
| Parallel Opportunities | 8 tasks marked [P] |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All endpoints reuse verify_user_access dependency from Spec 1
