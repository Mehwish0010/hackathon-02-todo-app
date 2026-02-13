# Tasks: Frontend Application & Secure API Integration

**Feature**: 003-frontend-api-integration
**Input**: Design documents from `/specs/003-frontend-api-integration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are optional. Manual E2E verification via quickstart.md is the testing strategy for this feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/` for Next.js frontend
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and type definitions for task components

- [x] T001 Create frontend/types/ directory for TypeScript interfaces
- [x] T002 Create frontend/types/task.ts with Task, TaskCreate, TaskUpdate interfaces per data-model.md
- [x] T003 [P] Create frontend/hooks/ directory for custom React hooks
- [x] T004 [P] Create frontend/components/tasks/ directory for task-related components

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create frontend/hooks/use-tasks.ts with useTasks hook skeleton (state, loading, error)
- [x] T006 Implement fetchTasks function in frontend/hooks/use-tasks.ts using existing api-client
- [x] T007 [P] Create frontend/components/ui/card.tsx reusable card container component
- [x] T008 [P] Create frontend/components/ui/modal.tsx reusable modal dialog component
- [x] T009 [P] Create frontend/components/tasks/empty-state.tsx for displaying when no tasks exist

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View My Tasks (Priority: P1) - MVP

**Goal**: Logged-in user can see all their tasks on the dashboard with title, description, and completion status

**Independent Test**: Login, navigate to dashboard, verify task list displays with correct data

### Implementation for User Story 1

- [x] T010 [US1] Create frontend/components/tasks/task-item.tsx displaying single task (title, description preview, completion status)
- [x] T011 [US1] Create frontend/components/tasks/task-list.tsx container that maps tasks to TaskItem components
- [x] T012 [US1] Implement loading state display in frontend/components/tasks/task-list.tsx
- [x] T013 [US1] Implement error state with retry button in frontend/components/tasks/task-list.tsx
- [x] T014 [US1] Integrate EmptyState component when tasks array is empty in task-list.tsx
- [x] T015 [US1] Update frontend/app/(protected)/dashboard/page.tsx to import and render TaskList
- [x] T016 [US1] Connect TaskList to useTasks hook for data fetching in dashboard/page.tsx
- [x] T017 [US1] Style task list for desktop layout (min-width 1024px) using Tailwind CSS

**Checkpoint**: User Story 1 complete - users can view their tasks

---

## Phase 4: User Story 2 - Create a New Task (Priority: P1)

**Goal**: Logged-in user can create a new task with title and optional description

**Independent Test**: Click Add Task, enter title, submit, verify task appears in list

### Implementation for User Story 2

- [x] T018 [US2] Create frontend/components/tasks/task-form.tsx with title and description fields
- [x] T019 [US2] Implement form validation in task-form.tsx (title required, max 200 chars)
- [x] T020 [US2] Implement description validation in task-form.tsx (optional, max 1000 chars)
- [x] T021 [US2] Add createTask function to frontend/hooks/use-tasks.ts calling POST endpoint
- [x] T022 [US2] Implement form submission with loading state in task-form.tsx
- [x] T023 [US2] Handle success: add new task to list, clear form in task-form.tsx
- [x] T024 [US2] Handle error: display error message, preserve form data in task-form.tsx
- [x] T025 [US2] Add TaskForm to dashboard/page.tsx for creating new tasks
- [x] T026 [US2] Add "Add Task" button/section to dashboard triggering form display

**Checkpoint**: User Story 2 complete - users can create tasks

---

## Phase 5: User Story 3 - Mark Task Complete/Incomplete (Priority: P1)

**Goal**: Logged-in user can toggle a task's completion status with immediate visual feedback

**Independent Test**: Click checkbox on task, verify visual change, refresh page, verify status persists

### Implementation for User Story 3

- [x] T027 [US3] Add checkbox/toggle element to frontend/components/tasks/task-item.tsx
- [x] T028 [US3] Add toggleComplete function to frontend/hooks/use-tasks.ts calling PATCH endpoint
- [x] T029 [US3] Implement optimistic UI update in task-item.tsx (immediate visual change)
- [x] T030 [US3] Handle toggle success: confirm state from API response
- [x] T031 [US3] Handle toggle error: revert state, display error message
- [x] T032 [US3] Add visual completed styling (strikethrough, muted colors) in task-item.tsx

**Checkpoint**: User Story 3 complete - users can toggle task completion

---

## Phase 6: User Story 4 - Edit Task Details (Priority: P2)

**Goal**: Logged-in user can edit a task's title and description

**Independent Test**: Click edit on task, modify title/description, save, verify changes persist

### Implementation for User Story 4

- [x] T033 [US4] Add edit button to frontend/components/tasks/task-item.tsx
- [x] T034 [US4] Add updateTask function to frontend/hooks/use-tasks.ts calling PUT endpoint
- [x] T035 [US4] Modify task-form.tsx to support edit mode (pre-populate with existing data)
- [x] T036 [US4] Create edit modal state management in task-item.tsx or parent component
- [x] T037 [US4] Implement edit form submission calling updateTask
- [x] T038 [US4] Handle update success: update task in list, close modal
- [x] T039 [US4] Handle update error: display error message, keep modal open
- [x] T040 [US4] Add cancel button to close edit modal without saving

**Checkpoint**: User Story 4 complete - users can edit tasks

---

## Phase 7: User Story 5 - Delete Task (Priority: P2)

**Goal**: Logged-in user can delete a task with confirmation

**Independent Test**: Click delete on task, confirm in dialog, verify task removed from list

### Implementation for User Story 5

- [x] T041 [US5] Create frontend/components/tasks/task-delete-dialog.tsx confirmation modal
- [x] T042 [US5] Add delete button to frontend/components/tasks/task-item.tsx
- [x] T043 [US5] Add deleteTask function to frontend/hooks/use-tasks.ts calling DELETE endpoint
- [x] T044 [US5] Implement delete dialog open/close state management
- [x] T045 [US5] Implement delete confirmation calling deleteTask
- [x] T046 [US5] Handle delete success: remove task from list, close dialog
- [x] T047 [US5] Handle delete error: display error message, close dialog
- [x] T048 [US5] Add cancel button to dismiss delete confirmation

**Checkpoint**: User Story 5 complete - users can delete tasks

---

## Phase 8: User Story 6 - Secure Authentication Flow (Priority: P1)

**Goal**: Verify existing authentication integrates correctly with task operations

**Independent Test**: Sign in, access dashboard, sign out, verify redirect to signin

**Note**: Authentication UI exists from Spec 001. This phase verifies integration.

### Implementation for User Story 6

- [x] T049 [US6] Verify signin redirects to dashboard after successful authentication
- [x] T050 [US6] Verify signout clears session and redirects to signin page
- [x] T051 [US6] Verify unauthenticated access to /dashboard redirects to /signin
- [x] T052 [US6] Verify JWT token is included in all task API requests (check network tab)
- [x] T053 [US6] Add user info display in dashboard header (email from session)

**Checkpoint**: User Story 6 complete - authentication flow verified

---

## Phase 9: User Story 7 - User Registration (Priority: P2)

**Goal**: Verify existing registration integrates correctly with task flow

**Independent Test**: Sign up new user, verify redirect to dashboard, create first task

**Note**: Registration UI exists from Spec 001. This phase verifies integration.

### Implementation for User Story 7

- [x] T054 [US7] Verify signup creates account and redirects to dashboard
- [x] T055 [US7] Verify new user sees empty state with create task prompt
- [x] T056 [US7] Verify duplicate email shows appropriate error message
- [x] T057 [US7] Verify password validation (min 8 chars) shows error

**Checkpoint**: User Story 7 complete - registration flow verified

---

## Phase 10: Polish & Responsive Design

**Purpose**: Ensure responsive layout and production quality

- [x] T058 [P] Add responsive styles for mobile (320px-480px) in all task components
- [x] T059 [P] Add responsive styles for tablet (481px-1024px) in all task components
- [x] T060 [P] Verify desktop layout works correctly (1025px+)
- [x] T061 Add loading spinner during task operations (create, update, delete)
- [x] T062 [P] Add focus management for accessibility (focus task form on open)
- [x] T063 [P] Ensure error messages are clear and actionable
- [x] T064 Update dashboard to remove old placeholder content
- [ ] T065 Run quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - US1 (View) → US2 (Create) → US3 (Toggle) recommended order for MVP
  - US4-US7 can follow in any order
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (View)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (Create)**: Best after US1 (needs list to show new task)
- **User Story 3 (Toggle)**: Best after US1 (needs tasks to toggle)
- **User Story 4 (Edit)**: Best after US2 (needs tasks to edit)
- **User Story 5 (Delete)**: Best after US1 (needs tasks to delete)
- **User Story 6 (Auth)**: Verification only - can run anytime after Foundational
- **User Story 7 (Register)**: Verification only - can run anytime after Foundational

### Within Each User Story

- UI components before integration
- Hook functions before component usage
- Core functionality before error handling
- Success path before error path

### Parallel Opportunities

- T003 and T004 can run in parallel (directory creation)
- T007, T008, T009 can run in parallel (different components)
- T058, T059, T060 can run in parallel (different viewport testing)
- T062 and T063 can run in parallel (different accessibility concerns)

---

## Parallel Example: Foundational Phase

```bash
# Launch these foundational tasks in parallel:
Task: "Create frontend/components/ui/card.tsx reusable card container component"
Task: "Create frontend/components/ui/modal.tsx reusable modal dialog component"
Task: "Create frontend/components/tasks/empty-state.tsx for displaying when no tasks exist"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T009)
3. Complete Phase 3: User Story 1 - View Tasks (T010-T017)
4. **STOP and VALIDATE**: Login and verify task list displays
5. Complete Phase 4: User Story 2 - Create Task (T018-T026)
6. Complete Phase 5: User Story 3 - Toggle Complete (T027-T032)
7. **MVP COMPLETE**: Core task management functional

### Full Delivery

1. Complete MVP (Phases 1-5)
2. Add Phase 6: User Story 4 - Edit Task (T033-T040)
3. Add Phase 7: User Story 5 - Delete Task (T041-T048)
4. Add Phase 8: User Story 6 - Auth Verification (T049-T053)
5. Add Phase 9: User Story 7 - Register Verification (T054-T057)
6. Complete Phase 10: Polish (T058-T065)

---

## Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 65 |
| Setup Phase | 4 tasks |
| Foundational Phase | 5 tasks |
| User Story 1 (View) | 8 tasks |
| User Story 2 (Create) | 9 tasks |
| User Story 3 (Toggle) | 6 tasks |
| User Story 4 (Edit) | 8 tasks |
| User Story 5 (Delete) | 8 tasks |
| User Story 6 (Auth) | 5 tasks |
| User Story 7 (Register) | 4 tasks |
| Polish Phase | 8 tasks |
| Parallel Opportunities | 14 tasks marked [P] |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- MVP scope: User Stories 1-3 (View, Create, Toggle)
- Existing components from Spec 001: button.tsx, input.tsx, auth forms, api-client.ts
