# Tasks: In-Memory Console Todo Application

**Input**: Design documents from `/specs/001-console-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included. The constitution specifies pytest for Phase I, and the plan defines unit and integration test files.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create project directory structure and initialize Python project

- [x] T001 Create source directory structure: `src/`, `src/models/`, `src/services/`, `src/cli/` with `__init__.py` files in each
- [x] T002 Create test directory structure: `tests/`, `tests/unit/`, `tests/integration/` with `__init__.py` files in each
- [x] T003 Create entry point file `src/main.py` with `if __name__ == "__main__"` guard that calls `run_app()` from `src/cli/menu.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core model and service infrastructure that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `Todo` dataclass in `src/models/todo.py` with fields: `id` (int), `title` (str), `description` (str, default ""), `status` (str, default "pending")
- [x] T005 Create `TodoCollection` class in `src/models/todo.py` with `items: dict[int, Todo]` (default empty) and `next_id: int` (default 1)
- [x] T006 Implement `display_menu()` function in `src/cli/menu.py` that prints the numbered menu (Add, List, Update, Toggle, Delete, Exit)
- [x] T007 Implement `get_user_choice()` function in `src/cli/menu.py` that reads a line from stdin via `input()` and returns the raw string
- [x] T008 Implement `run_app()` skeleton in `src/cli/menu.py` that creates a `TodoCollection`, loops displaying menu and getting choice, handles exit option with farewell message, and catches invalid menu choices with error message
- [x] T009 [P] Write unit tests for `Todo` dataclass creation and defaults in `tests/unit/test_todo_model.py`
- [x] T010 [P] Write unit tests for `TodoCollection` initialization (empty items, next_id=1) in `tests/unit/test_todo_model.py`

**Checkpoint**: Foundation ready — project runs, shows menu, handles exit and invalid choices. User story implementation can begin.

---

## Phase 3: User Story 1 - Create and View Todos (Priority: P1) MVP

**Goal**: Users can add todo items and view all existing todos in a list

**Independent Test**: Create 2-3 todos, then list all. Verify each appears with correct title, default status "pending", and a unique identifier.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T011 [P] [US1] Write unit tests for `add_todo()` in `tests/unit/test_todo_service.py`: test successful creation returns Todo with correct fields, test ID auto-increments, test empty title raises ValueError
- [x] T012 [P] [US1] Write unit tests for `list_todos()` in `tests/unit/test_todo_service.py`: test empty collection returns empty list, test returns all todos in insertion order

### Implementation for User Story 1

- [x] T013 [US1] Implement `add_todo(collection, title, description="")` in `src/services/todo_service.py` per contract: validate title non-empty, create Todo with next_id, add to collection, increment counter, return Todo
- [x] T014 [US1] Implement `list_todos(collection)` in `src/services/todo_service.py` per contract: return `list(collection.items.values())`
- [x] T015 [US1] Wire "Add todo" menu option in `run_app()` in `src/cli/menu.py`: prompt for title, prompt for optional description, call `add_todo()`, display confirmation with ID
- [x] T016 [US1] Wire "List todos" menu option in `run_app()` in `src/cli/menu.py`: call `list_todos()`, display formatted table (ID, Title, Status, Description), handle empty list message
- [x] T017 [US1] Add error handling in `run_app()` for add_todo: catch `ValueError` for empty title and display "Error: Title cannot be empty"

**Checkpoint**: User Story 1 complete — users can create todos and list them. Run `pytest tests/unit/test_todo_service.py -v` to verify.

---

## Phase 4: User Story 2 - Update a Todo (Priority: P2)

**Goal**: Users can edit the title and/or description of an existing todo

**Independent Test**: Create a todo, update its title, list all todos. Verify the updated title appears.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T018 [P] [US2] Write unit tests for `update_todo()` in `tests/unit/test_todo_service.py`: test update title only, test update description only, test update both, test non-existent ID raises ValueError, test empty title raises ValueError

### Implementation for User Story 2

- [x] T019 [US2] Implement `update_todo(collection, todo_id, title=None, description=None)` in `src/services/todo_service.py` per contract: validate ID exists, validate title non-empty if provided, update fields, return updated Todo
- [x] T020 [US2] Wire "Update todo" menu option in `run_app()` in `src/cli/menu.py`: prompt for ID (with int conversion and error handling), prompt for new title (Enter to keep current), prompt for new description (Enter to keep current), call `update_todo()`, display confirmation
- [x] T021 [US2] Add error handling in `run_app()` for update path: catch `ValueError` for not-found ID and empty title, catch non-numeric ID input

**Checkpoint**: User Stories 1 and 2 complete — users can create, list, and update todos.

---

## Phase 5: User Story 3 - Mark Todo as Completed or Pending (Priority: P2)

**Goal**: Users can toggle a todo's status between "pending" and "completed"

**Independent Test**: Create a todo, toggle to "completed", verify listing shows "completed". Toggle again, verify "pending".

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T022 [P] [US3] Write unit tests for `toggle_todo_status()` in `tests/unit/test_todo_service.py`: test pending→completed, test completed→pending, test non-existent ID raises ValueError

### Implementation for User Story 3

- [x] T023 [US3] Implement `toggle_todo_status(collection, todo_id)` in `src/services/todo_service.py` per contract: validate ID exists, flip status, return updated Todo
- [x] T024 [US3] Wire "Toggle status" menu option in `run_app()` in `src/cli/menu.py`: prompt for ID (with int conversion and error handling), call `toggle_todo_status()`, display confirmation with new status
- [x] T025 [US3] Add error handling in `run_app()` for toggle path: catch `ValueError` for not-found ID, catch non-numeric ID input

**Checkpoint**: User Stories 1, 2, and 3 complete — users can create, list, update, and toggle todos.

---

## Phase 6: User Story 4 - Delete a Todo (Priority: P3)

**Goal**: Users can permanently remove a todo from the list

**Independent Test**: Create a todo, delete it, list all todos. Verify deleted todo no longer appears.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T026 [P] [US4] Write unit tests for `delete_todo()` in `tests/unit/test_todo_service.py`: test successful deletion removes from collection and returns deleted Todo, test non-existent ID raises ValueError, test deleted ID is not reused

### Implementation for User Story 4

- [x] T027 [US4] Implement `delete_todo(collection, todo_id)` in `src/services/todo_service.py` per contract: validate ID exists, remove from items dict, return deleted Todo
- [x] T028 [US4] Wire "Delete todo" menu option in `run_app()` in `src/cli/menu.py`: prompt for ID (with int conversion and error handling), call `delete_todo()`, display confirmation with deleted todo title
- [x] T029 [US4] Add error handling in `run_app()` for delete path: catch `ValueError` for not-found ID, catch non-numeric ID input

**Checkpoint**: User Stories 1-4 complete — full CRUD cycle works.

---

## Phase 7: User Story 5 - Exit the Application (Priority: P3)

**Goal**: Users can cleanly exit the application with a farewell message

**Independent Test**: Launch the application, select exit. Verify clean termination with farewell message.

### Implementation for User Story 5

- [x] T030 [US5] Verify exit handling in `run_app()` in `src/cli/menu.py`: confirm farewell message is printed, loop terminates, no error on exit (this was scaffolded in T008; verify it works end-to-end with all menu options active)

**Checkpoint**: All 5 user stories complete — full application functional.

---

## Phase 8: Integration Tests & Polish

**Purpose**: End-to-end tests and cross-cutting improvements

- [x] T031 Write integration test for full CRUD flow in `tests/integration/test_cli_flow.py`: simulate input sequence (add, list, update, toggle, delete, exit) using `monkeypatch` on `input()` and `capsys` to capture output, verify all confirmations and listing output
- [x] T032 Write integration test for error handling in `tests/integration/test_cli_flow.py`: simulate invalid menu choice, empty title, non-existent ID, non-numeric input — verify error messages displayed and menu re-presented
- [x] T033 Run full test suite `pytest tests/ -v` and verify all tests pass
- [x] T034 Run `quickstart.md` smoke test checklist manually: verify all 12 items pass
- [x] T035 Verify no file I/O, no database, no external imports in `src/` (stdlib only at runtime)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Phase 2 completion
  - US1 (Phase 3): No dependencies on other stories — MVP
  - US2 (Phase 4): Independent of other stories (uses shared model/collection from Phase 2)
  - US3 (Phase 5): Independent of other stories
  - US4 (Phase 6): Independent of other stories
  - US5 (Phase 7): Independent (exit scaffolded in Phase 2, verified here)
- **Polish (Phase 8)**: Depends on all user stories being complete

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Service function before CLI wiring
- CLI wiring before error handling refinement
- Story complete before moving to next priority

### Parallel Opportunities

- T009 and T010 (foundational tests) can run in parallel
- T011 and T012 (US1 tests) can run in parallel
- Once Phase 2 is complete, US2, US3, US4, US5 can start in parallel (all touch different service functions and different menu branches)
- Within US2/US3/US4: test tasks are parallelizable with each other

---

## Parallel Example: User Story 1

```bash
# Write US1 tests in parallel:
Task: T011 "Unit tests for add_todo in tests/unit/test_todo_service.py"
Task: T012 "Unit tests for list_todos in tests/unit/test_todo_service.py"

# Then implement sequentially:
Task: T013 "Implement add_todo in src/services/todo_service.py"
Task: T014 "Implement list_todos in src/services/todo_service.py"
Task: T015 "Wire Add menu option in src/cli/menu.py"
Task: T016 "Wire List menu option in src/cli/menu.py"
Task: T017 "Error handling for add in src/cli/menu.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Create & View)
4. **STOP and VALIDATE**: Run `pytest tests/unit/ -v`, manually test add + list
5. Demo if ready — users can create and view todos

### Incremental Delivery

1. Setup + Foundational → Application runs, shows menu, handles exit
2. Add US1 → Create & view todos → Test → Demo (MVP!)
3. Add US2 → Update todos → Test → Demo
4. Add US3 → Toggle status → Test → Demo
5. Add US4 → Delete todos → Test → Demo
6. Add US5 → Verify clean exit → Test → Demo
7. Polish → Integration tests, smoke test, final validation

### Single Developer Strategy (Recommended for Phase I)

Sequential execution in priority order:

1. Phase 1 + Phase 2 (Setup + Foundation)
2. Phase 3 (US1 — MVP)
3. Phase 4 (US2 — Update)
4. Phase 5 (US3 — Toggle)
5. Phase 6 (US4 — Delete)
6. Phase 7 (US5 — Exit verification)
7. Phase 8 (Integration tests + polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Tests MUST fail before implementing the corresponding service function
- Commit after each task or logical group
- Stop at any checkpoint to validate the story independently
- All service functions share the same `todo_service.py` file but operate on different code paths — no conflicts between stories
