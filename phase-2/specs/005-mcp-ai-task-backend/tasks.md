# Tasks: MCP-Based AI Task Management Backend

**Input**: Design documents from `/specs/005-mcp-ai-task-backend/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/mcp-tools.md, contracts/chat-api.yaml

**Tests**: Tests are included for integration validation as this is an agentic system requiring end-to-end verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/app/` for source, `backend/tests/` for tests
- Existing structure from Phase II is extended

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add new dependencies and create module structure for MCP and Agent

- [x] T001 Add OpenAI and MCP dependencies to backend/requirements.txt (openai>=1.12.0, mcp>=0.1.0)
- [x] T002 Add OPENAI_API_KEY and OPENAI_MODEL to backend/app/core/config.py settings
- [x] T003 [P] Create backend/app/mcp/__init__.py module initialization
- [x] T004 [P] Create backend/app/agent/__init__.py module initialization
- [x] T005 [P] Create backend/app/schemas/chat.py with ChatRequest and ChatResponse schemas

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create Conversation model in backend/app/models/conversation.py per data-model.md
- [x] T007 Create Message model in backend/app/models/message.py per data-model.md
- [x] T008 Update backend/app/models/__init__.py to export Conversation and Message
- [x] T009 Create database tables for conversation and message (run SQLModel.metadata.create_all)
- [x] T010 Create ConversationService in backend/app/services/conversation_service.py with get_or_create, get_messages, save_message
- [x] T011 Create MCP server base in backend/app/mcp/server.py with Server initialization
- [x] T012 Create agent system prompt in backend/app/agent/prompts.py per contracts/mcp-tools.md
- [x] T013 Create base TaskAgent in backend/app/agent/task_agent.py with OpenAI client setup

**Checkpoint**: Foundation ready - MCP tools and user story implementation can now begin

---

## Phase 3: User Story 1 - Natural Language Task Creation (Priority: P1) MVP

**Goal**: Users can create tasks via natural language chat

**Independent Test**: Send "Create a task called 'Buy milk'" via POST /api/chat and verify task appears in database

### Implementation for User Story 1

- [x] T014 [US1] Create create_task MCP tool in backend/app/mcp/tools/create_task.py with user_id injection
- [x] T015 [US1] Register create_task tool with MCP server in backend/app/mcp/server.py
- [x] T016 [US1] Implement tool-to-function bridge for create_task in backend/app/agent/task_agent.py
- [x] T017 [US1] Create chat endpoint POST /api/chat in backend/app/api/routes/chat.py with JWT validation
- [x] T018 [US1] Wire chat endpoint to TaskAgent: load conversation, invoke agent, save messages
- [x] T019 [US1] Register chat router in backend/app/main.py
- [x] T020 [US1] Add logging for agent tool calls in backend/app/agent/task_agent.py

**Checkpoint**: User Story 1 complete - can create tasks via natural language

---

## Phase 4: User Story 2 - Task Listing via Natural Language (Priority: P2)

**Goal**: Users can list their tasks via natural language chat

**Independent Test**: Pre-populate tasks, send "What are my tasks?" and verify response matches database

### Implementation for User Story 2

- [x] T021 [P] [US2] Create list_tasks MCP tool in backend/app/mcp/tools/list_tasks.py with user_id filter
- [x] T022 [US2] Register list_tasks tool with MCP server in backend/app/mcp/server.py
- [x] T023 [US2] Add list_tasks to agent tools in backend/app/agent/task_agent.py

**Checkpoint**: User Story 2 complete - can list tasks via natural language

---

## Phase 5: User Story 3 - Task Completion Toggle (Priority: P2)

**Goal**: Users can mark tasks complete/incomplete via natural language

**Independent Test**: Create task, send "Mark it as done", verify completed=true in database

### Implementation for User Story 3

- [x] T024 [P] [US3] Create complete_task MCP tool in backend/app/mcp/tools/complete_task.py with ownership check
- [x] T025 [US3] Register complete_task tool with MCP server in backend/app/mcp/server.py
- [x] T026 [US3] Add complete_task to agent tools in backend/app/agent/task_agent.py

**Checkpoint**: User Story 3 complete - can toggle task completion via natural language

---

## Phase 6: User Story 4 - Task Update via Natural Language (Priority: P3)

**Goal**: Users can update task title/description via natural language

**Independent Test**: Create task, send "Rename it to 'Buy oat milk'", verify title changed in database

### Implementation for User Story 4

- [x] T027 [P] [US4] Create update_task MCP tool in backend/app/mcp/tools/update_task.py with ownership check
- [x] T028 [US4] Register update_task tool with MCP server in backend/app/mcp/server.py
- [x] T029 [US4] Add update_task to agent tools in backend/app/agent/task_agent.py

**Checkpoint**: User Story 4 complete - can update tasks via natural language

---

## Phase 7: User Story 5 - Task Deletion via Natural Language (Priority: P3)

**Goal**: Users can delete tasks via natural language

**Independent Test**: Create task, send "Delete that task", verify task removed from database

### Implementation for User Story 5

- [x] T030 [P] [US5] Create delete_task MCP tool in backend/app/mcp/tools/delete_task.py with ownership check
- [x] T031 [US5] Register delete_task tool with MCP server in backend/app/mcp/server.py
- [x] T032 [US5] Add delete_task to agent tools in backend/app/agent/task_agent.py

**Checkpoint**: User Story 5 complete - can delete tasks via natural language

---

## Phase 8: User Story 6 - Conversation Persistence (Priority: P2)

**Goal**: Conversation history persists across sessions

**Independent Test**: Send messages, restart server, GET /api/chat/history returns previous messages

### Implementation for User Story 6

- [x] T033 [US6] Create GET /api/chat/history endpoint in backend/app/api/routes/chat.py
- [x] T034 [US6] Ensure conversation updated_at is updated on each message in ConversationService
- [x] T035 [US6] Add message limit parameter to history endpoint per contracts/chat-api.yaml

**Checkpoint**: User Story 6 complete - conversation history persists

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Integration testing and validation

- [x] T036 Create integration test for full agent flow in backend/tests/integration/test_agent_flow.py
- [x] T037 Create contract test for chat API in backend/tests/contract/test_chat_api.py
- [x] T038 Add user isolation test (User A cannot see User B's tasks/conversations)
- [x] T039 Validate all MCP tools are stateless (no shared state between calls)
- [x] T040 Run quickstart.md validation steps and document any issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (P1) should be completed first as MVP
  - US2, US3, US6 (P2) can proceed after US1 or in parallel
  - US4, US5 (P3) can proceed after US1 or in parallel
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - Core chat + create_task
- **User Story 2 (P2)**: Can start after US1 - Adds list_tasks tool
- **User Story 3 (P2)**: Can start after US1 - Adds complete_task tool
- **User Story 4 (P3)**: Can start after US1 - Adds update_task tool
- **User Story 5 (P3)**: Can start after US1 - Adds delete_task tool
- **User Story 6 (P2)**: Can start after US1 - Adds history endpoint

### Within Each User Story

- Create tool file first
- Register tool with MCP server
- Add tool to agent
- Test independently

### Parallel Opportunities

- T003, T004, T005 can run in parallel (different files)
- T006, T007 can run in parallel (different model files)
- T021, T024, T027, T030 can run in parallel (different tool files) after US1 complete
- All [P] marked tasks within a phase can run together

---

## Parallel Execution Examples

### Phase 1 Parallel Tasks
```bash
# Launch together:
Task: "Create backend/app/mcp/__init__.py module initialization"
Task: "Create backend/app/agent/__init__.py module initialization"
Task: "Create backend/app/schemas/chat.py with ChatRequest and ChatResponse schemas"
```

### After Phase 2 Complete - Tool Creation Parallel
```bash
# Launch all MCP tools together (after US1 establishes pattern):
Task: "Create list_tasks MCP tool in backend/app/mcp/tools/list_tasks.py"
Task: "Create complete_task MCP tool in backend/app/mcp/tools/complete_task.py"
Task: "Create update_task MCP tool in backend/app/mcp/tools/update_task.py"
Task: "Create delete_task MCP tool in backend/app/mcp/tools/delete_task.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Natural Language Task Creation)
4. **STOP and VALIDATE**: Test creating tasks via chat
5. Demo MVP: User can chat and create tasks

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo (MVP: create tasks via chat)
3. Add User Story 2 → Test independently → Demo (list tasks via chat)
4. Add User Story 3 → Test independently → Demo (complete tasks via chat)
5. Add User Stories 4, 5, 6 → Full CRUD + persistence

### Suggested Execution Order

1. T001-T005 (Setup)
2. T006-T013 (Foundational)
3. T014-T020 (US1 - MVP)
4. T021-T023 (US2 - list)
5. T024-T026 (US3 - complete)
6. T033-T035 (US6 - history)
7. T027-T029 (US4 - update)
8. T030-T032 (US5 - delete)
9. T036-T040 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- user_id MUST be injected into all MCP tools from JWT, never from agent
- All database queries MUST filter by user_id for data isolation
