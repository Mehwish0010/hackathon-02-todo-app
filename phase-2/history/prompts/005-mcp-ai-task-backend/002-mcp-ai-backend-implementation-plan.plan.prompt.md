---
id: 002
title: MCP AI Backend Implementation Plan
stage: plan
date: 2026-02-10
surface: agent
model: claude-opus-4-5-20251101
feature: 005-mcp-ai-task-backend
branch: 005-mcp-ai-task-backend
user: Dell
command: /sp.plan
labels: ["mcp", "ai-agent", "openai-agents-sdk", "phase-iii", "planning", "architecture"]
links:
  spec: specs/005-mcp-ai-task-backend/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/005-mcp-ai-task-backend/plan.md
  - specs/005-mcp-ai-task-backend/research.md
  - specs/005-mcp-ai-task-backend/data-model.md
  - specs/005-mcp-ai-task-backend/contracts/chat-api.yaml
  - specs/005-mcp-ai-task-backend/contracts/mcp-tools.md
  - specs/005-mcp-ai-task-backend/quickstart.md
tests:
  - N/A (planning phase)
---

## Prompt

# Plan — Phase III-A: MCP-Based AI Backend

## 1. Objective
Implement a stateless, MCP-driven backend where AI agents manage todos exclusively through exposed tools, with all state persisted in the database.

---

## 2. Architecture Overview

- FastAPI backend
- MCP Server exposing task tools
- OpenAI Agent using MCP tools
- SQLModel ORM
- Neon PostgreSQL for persistence

---

## 3. MCP Server Design

### Tools exposed:
- create_task(title, description, due_date)
- list_tasks(user_id)
- update_task(task_id, fields)
- complete_task(task_id)
- delete_task(task_id)

Rules:
- Tools are stateless
- Each tool reads/writes DB directly
- No shared memory between calls

---

## 4. AI Agent Design

- Uses OpenAI Agents SDK
- Receives:
  - User input
  - Conversation history from DB
- Decides when to call MCP tools
- Returns natural language response

---

## 5. Chat Endpoint

- POST /api/chat
- Stateless per request
- Loads conversation from DB
- Passes context to agent
- Stores new messages in DB

---

## 6. Authentication

- Use Better Auth
- Ensure:
  - User isolation
  - Secure task access
  - Scoped DB queries

---

## 7. Execution Steps

1. Define SQLModel schemas
2. Implement MCP server
3. Register task tools
4. Integrate OpenAI Agents SDK
5. Create stateless chat endpoint
6. Persist conversation state
7. Validate concurrent usage

---

## 8. Validation Checklist

- AI only acts via MCP tools
- No in-memory state leakage
- Tasks persist correctly
- Multiple users supported
- Agent reasoning visible in logs

---

## 9. Deliverables

- MCP server
- Task tools
- Stateless chat API
- Persisted conversation flow

## Response snapshot

Generated complete implementation plan for MCP-Based AI Task Management Backend:

**Artifacts Created**:
1. `plan.md` - Full implementation plan with architecture, constitution check, project structure
2. `research.md` - Technical research: OpenAI Agents SDK, MCP SDK integration patterns
3. `data-model.md` - SQLModel schemas for Conversation and Message entities
4. `contracts/chat-api.yaml` - OpenAPI spec for POST /api/chat and GET /api/chat/history
5. `contracts/mcp-tools.md` - MCP tool definitions with parameters, returns, security model
6. `quickstart.md` - Setup guide, environment config, verification steps

**Constitution Check**: All 9 principles PASSED
- Spec-Driven Development: Following workflow
- Security-First: JWT validation, user context injection
- User Data Isolation: All queries filtered by user_id
- Fixed Technology Stack: FastAPI, SQLModel, OpenAI Agents SDK, MCP SDK
- Agentic Architecture: Agent uses tools only, no direct DB access
- MCP Tool Standards: Stateless, deterministic tools
- Stateless Chat: No in-memory state, DB is source of truth

**Key Design Decisions**:
- In-process MCP server (not separate service)
- One conversation per user (append-only)
- Stateless agent per request
- user_id injected to tools (never from agent)

## Outcome

- Impact: Complete Phase 0 and Phase 1 planning artifacts generated
- Tests: N/A (planning phase)
- Files: 6 artifacts created in specs/005-mcp-ai-task-backend/
- Next prompts: /sp.tasks to generate implementation tasks
- Reflection: Plan follows all constitution principles, architecture enables clean agentic workflow

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution check PASS (9/9)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
