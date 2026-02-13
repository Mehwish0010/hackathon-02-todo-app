# Feature Specification: MCP-Based AI Task Management Backend

**Feature Branch**: `005-mcp-ai-task-backend`
**Created**: 2026-02-10
**Status**: Draft
**Phase**: Phase III-A (AI Architecture & Tooling)

## Overview

Build a stateless, tool-driven AI backend that enables an AI agent to manage todos using natural language through MCP (Model Context Protocol) server architecture. The system exposes task operations as tools that AI agents can invoke, while maintaining complete statelessness with all state persisted in the database.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Natural Language Task Creation (Priority: P1)

As an authenticated user, I can send a natural language message like "Create a task to buy groceries" and the AI agent will use the appropriate MCP tool to create the task in my account.

**Why this priority**: Core functionality that demonstrates the agentic workflow - AI reasoning leading to tool invocation for task creation.

**Independent Test**: Can be fully tested by sending a chat message requesting task creation and verifying the task appears in the database for that user.

**Acceptance Scenarios**:

1. **Given** an authenticated user with no tasks, **When** they send "Create a task called 'Buy milk'", **Then** a new task titled "Buy milk" is created in the database associated with their user ID.
2. **Given** an authenticated user, **When** they send "Add three tasks: buy eggs, wash car, call mom", **Then** three separate tasks are created in the database.
3. **Given** an authenticated user, **When** the AI creates a task, **Then** the response confirms the action and reflects the current database state.

---

### User Story 2 - Task Listing via Natural Language (Priority: P2)

As an authenticated user, I can ask "What are my tasks?" or "Show me my todo list" and the AI agent will use the list_tasks MCP tool to retrieve and display my tasks.

**Why this priority**: Essential for users to see their current state and verify AI actions worked correctly.

**Independent Test**: Can be tested by pre-populating tasks in the database, then asking the AI to list them and verifying the response matches database contents.

**Acceptance Scenarios**:

1. **Given** an authenticated user with 3 tasks in the database, **When** they ask "What are my tasks?", **Then** the AI responds with all 3 tasks.
2. **Given** an authenticated user with no tasks, **When** they ask "Show my todos", **Then** the AI responds indicating no tasks exist.
3. **Given** two users each with different tasks, **When** User A asks for their tasks, **Then** only User A's tasks are returned (data isolation enforced).

---

### User Story 3 - Task Completion Toggle (Priority: P2)

As an authenticated user, I can say "Mark 'Buy milk' as complete" or "I finished the grocery task" and the AI agent will use the complete_task MCP tool to toggle the task's completion status.

**Why this priority**: Core task management functionality that demonstrates tool-based state modification.

**Independent Test**: Can be tested by creating a task, sending a completion request, and verifying the task's completed status in the database changes.

**Acceptance Scenarios**:

1. **Given** an authenticated user with an incomplete task "Buy milk", **When** they say "Mark buy milk as done", **Then** the task's completed status becomes true in the database.
2. **Given** an authenticated user with a completed task, **When** they say "Unmark that task", **Then** the task's completed status becomes false.
3. **Given** an authenticated user, **When** they reference a non-existent task, **Then** the AI responds with an appropriate error message.

---

### User Story 4 - Task Update via Natural Language (Priority: P3)

As an authenticated user, I can say "Rename 'Buy milk' to 'Buy oat milk'" or "Change the description of my first task" and the AI agent will use the update_task MCP tool to modify the task.

**Why this priority**: Extends core functionality with edit capabilities.

**Independent Test**: Can be tested by creating a task, sending an update request, and verifying the task's attributes changed in the database.

**Acceptance Scenarios**:

1. **Given** an authenticated user with a task titled "Buy milk", **When** they say "Rename that to Buy oat milk", **Then** the task title is updated in the database.
2. **Given** an authenticated user with a task, **When** they say "Add description: get 2 cartons", **Then** the task's description field is updated.

---

### User Story 5 - Task Deletion via Natural Language (Priority: P3)

As an authenticated user, I can say "Delete the grocery task" or "Remove all completed tasks" and the AI agent will use the delete_task MCP tool to remove tasks.

**Why this priority**: Completes CRUD operations for full task management.

**Independent Test**: Can be tested by creating a task, sending a delete request, and verifying the task no longer exists in the database.

**Acceptance Scenarios**:

1. **Given** an authenticated user with a task "Buy milk", **When** they say "Delete buy milk task", **Then** the task is removed from the database.
2. **Given** an authenticated user with 3 tasks (1 completed), **When** they say "Remove completed tasks", **Then** only the completed task is deleted.

---

### User Story 6 - Conversation Persistence (Priority: P2)

As an authenticated user, when I return to the chat after leaving, I can see my previous conversation history and continue where I left off.

**Why this priority**: Essential for usable chat experience and demonstrates stateless architecture with DB persistence.

**Independent Test**: Can be tested by sending messages, refreshing/reopening the chat interface, and verifying conversation history is displayed.

**Acceptance Scenarios**:

1. **Given** an authenticated user with previous chat messages, **When** they open the chat interface, **Then** previous messages are loaded from the database and displayed.
2. **Given** an authenticated user, **When** they send a new message, **Then** the message and AI response are persisted to the database.
3. **Given** two different users, **When** User A views their chat, **Then** they only see their own conversation history (data isolation).

---

### Edge Cases

- What happens when a user references an ambiguous task (e.g., multiple tasks with similar names)? The AI should ask for clarification.
- What happens when the AI fails to parse user intent? The AI should request clarification rather than taking incorrect action.
- What happens when a database operation fails mid-request? The request should fail gracefully with an error message, no partial state changes.
- What happens when a user tries to access/modify another user's tasks via prompt injection? The system must enforce data isolation at the tool level regardless of AI reasoning.
- What happens during concurrent modifications to the same task? The database handles concurrency; last write wins with appropriate timestamps.

## Requirements *(mandatory)*

### Functional Requirements

#### MCP Server & Tools

- **FR-001**: System MUST expose an MCP server with the following tools: `create_task`, `update_task`, `delete_task`, `list_tasks`, `complete_task`.
- **FR-002**: Each MCP tool MUST be stateless - all state MUST be read from and written to the database.
- **FR-003**: Each MCP tool MUST accept user context (user_id) and filter/validate all operations by that user.
- **FR-004**: MCP tools MUST be deterministic - same inputs produce same outputs given the same database state.
- **FR-005**: MCP tools MUST NOT maintain any in-memory shared state between invocations.

#### AI Agent Integration

- **FR-006**: System MUST use the OpenAI Agents SDK to create an AI agent that reasons about user requests.
- **FR-007**: The AI agent MUST operate exclusively through MCP tool calls - no direct database access.
- **FR-008**: The AI agent MUST be invoked per-request with no long-lived memory (stateless).
- **FR-009**: AI responses MUST reflect the actual database state after any tool operations.

#### Chat Endpoint

- **FR-010**: System MUST expose a stateless chat API endpoint that receives user messages.
- **FR-011**: The chat endpoint MUST validate JWT authentication before processing requests.
- **FR-012**: The chat endpoint MUST pass authenticated user context to the AI agent and MCP tools.
- **FR-013**: The chat endpoint MUST persist conversation messages (user and assistant) to the database.

#### Data Persistence

- **FR-014**: All task data MUST be persisted to the PostgreSQL database.
- **FR-015**: All conversation history MUST be persisted to the PostgreSQL database.
- **FR-016**: The database MUST be the single source of truth for all application state.

#### Security & Isolation

- **FR-017**: All MCP tools MUST enforce user data isolation - users can only access their own tasks.
- **FR-018**: All chat operations MUST enforce user data isolation - users can only see their own conversations.
- **FR-019**: MCP tools MUST validate user ownership before any read, update, or delete operation.
- **FR-020**: System MUST reject any operation that would access another user's data with appropriate error response.

### Key Entities

- **Task**: Represents a todo item. Attributes: id, title, description (optional), completed status, user_id (owner), created_at, updated_at.
- **Conversation**: Represents a chat session. Attributes: id, user_id, created_at, updated_at.
- **Message**: Represents a single message in a conversation. Attributes: id, conversation_id, role (user/assistant), content, timestamp.
- **User**: Represents an authenticated user. Attributes: id, email (from auth system).

## Assumptions

- Authentication is handled by the existing Better Auth system; this spec focuses on the AI/MCP layer.
- The existing Task model from Phase II can be extended or reused.
- The AI model used is GPT-4 or equivalent via OpenAI Agents SDK (specific model determined at implementation).
- Tool definitions follow the MCP SDK standard format.
- Conversation messages are stored per-user, not per-session (user can have one active conversation).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create, read, update, delete, and complete tasks using natural language with 90%+ intent recognition accuracy.
- **SC-002**: AI responses correctly reflect database state 100% of the time after tool operations.
- **SC-003**: System handles 50+ concurrent users without request failures or data corruption.
- **SC-004**: Average response time for AI chat interactions is under 5 seconds (excluding network latency to AI provider).
- **SC-005**: Zero cross-user data leakage - each user sees only their own tasks and conversations.
- **SC-006**: Conversation history persists across sessions - users returning after 24+ hours see their full history.
- **SC-007**: System demonstrates correct agentic workflow: user message → AI reasoning → tool selection → tool execution → response generation.

## Out of Scope

- Frontend UI (covered in Phase III-B)
- Fine-tuned or custom LLMs
- Multi-agent orchestration
- Streaming responses
- Voice input/output
- Offline support
- Manual coding outside of SDD workflow
