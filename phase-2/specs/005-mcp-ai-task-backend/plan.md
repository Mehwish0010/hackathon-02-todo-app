# Implementation Plan: MCP-Based AI Task Management Backend

**Branch**: `005-mcp-ai-task-backend` | **Date**: 2026-02-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-mcp-ai-task-backend/spec.md`
**Phase**: Phase III-A (AI Architecture & Tooling)

## Summary

Build a stateless, MCP-driven backend where AI agents manage todos exclusively through exposed tools. The system uses the OpenAI Agents SDK to create an AI agent that reasons about user requests and invokes MCP tools for task operations. All state (tasks and conversations) is persisted in Neon PostgreSQL. The chat endpoint is stateless, loading conversation history from the database on each request.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, OpenAI Agents SDK, MCP SDK (official), SQLModel
**Storage**: Neon Serverless PostgreSQL (via existing connection)
**Testing**: pytest (contract + integration tests)
**Target Platform**: Linux server / Docker container
**Project Type**: Web application (backend only for this phase)
**Performance Goals**: <5s response time for AI interactions, 50+ concurrent users
**Constraints**: Stateless tools, no in-memory state, database as single source of truth
**Scale/Scope**: Multi-user, conversation persistence, 5 MCP tools

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | ✅ PASS | Following Spec → Plan → Tasks → Claude Code |
| II. Security-First Architecture | ✅ PASS | JWT validation on chat endpoint, user context passed to tools |
| III. User Data Isolation | ✅ PASS | All MCP tools filter by user_id from JWT |
| IV. Fixed Technology Stack | ✅ PASS | Using FastAPI, SQLModel, OpenAI Agents SDK, MCP SDK |
| V. RESTful API Standards | ✅ PASS | POST /api/chat follows REST conventions |
| VI. Responsive Frontend Design | N/A | Backend-only phase |
| VII. Agentic Architecture | ✅ PASS | AI agent uses OpenAI Agents SDK, operates via MCP tools only |
| VIII. MCP Tool Standards | ✅ PASS | Tools are stateless, deterministic, use official SDK |
| IX. Stateless Chat Architecture | ✅ PASS | Chat endpoint stateless, conversation from DB |

**Gate Status**: ✅ PASSED - All applicable principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/005-mcp-ai-task-backend/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── chat-api.yaml    # OpenAPI spec for chat endpoint
│   └── mcp-tools.md     # MCP tool definitions
└── tasks.md             # Phase 2 output (/sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── models/
│   │   ├── task.py              # Existing Task model
│   │   ├── conversation.py      # NEW: Conversation model
│   │   └── message.py           # NEW: Message model
│   ├── services/
│   │   ├── task_service.py      # Existing task service
│   │   └── conversation_service.py  # NEW: Conversation service
│   ├── mcp/                     # NEW: MCP server module
│   │   ├── __init__.py
│   │   ├── server.py            # MCP server setup
│   │   └── tools/               # MCP tool implementations
│   │       ├── __init__.py
│   │       ├── create_task.py
│   │       ├── list_tasks.py
│   │       ├── update_task.py
│   │       ├── complete_task.py
│   │       └── delete_task.py
│   ├── agent/                   # NEW: AI agent module
│   │   ├── __init__.py
│   │   ├── task_agent.py        # OpenAI Agents SDK agent
│   │   └── prompts.py           # System prompts
│   ├── api/routes/
│   │   ├── tasks.py             # Existing task routes
│   │   └── chat.py              # NEW: Chat endpoint
│   └── core/
│       ├── config.py            # Add OPENAI_API_KEY
│       └── dependencies.py      # Existing auth dependency
└── tests/
    ├── contract/
    │   └── test_chat_api.py     # Chat endpoint contract tests
    └── integration/
        └── test_agent_flow.py   # End-to-end agent tests
```

**Structure Decision**: Extends existing backend structure with new `mcp/` and `agent/` modules. Reuses existing Task model, security, and database configuration.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Phase III-B)                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    POST /api/chat                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 1. Validate JWT                                             │ │
│  │ 2. Extract user_id from token                               │ │
│  │ 3. Load conversation history from DB                        │ │
│  │ 4. Invoke AI Agent with user message + history              │ │
│  │ 5. Agent reasons and calls MCP tools                        │ │
│  │ 6. Persist user message + assistant response                │ │
│  │ 7. Return response                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OpenAI Agents SDK                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Task Management Agent                                       │ │
│  │ - System prompt: "You manage tasks for users..."           │ │
│  │ - Tools: MCP tools registered                               │ │
│  │ - Model: gpt-4o (or configured)                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MCP Server (In-Process)                       │
│  ┌──────────┐ ┌───────────┐ ┌─────────────┐ ┌───────────────┐  │
│  │create_   │ │list_tasks │ │update_task  │ │complete_task  │  │
│  │task      │ │           │ │             │ │               │  │
│  └────┬─────┘ └─────┬─────┘ └──────┬──────┘ └───────┬───────┘  │
│       │             │              │                │           │
│  ┌────┴─────────────┴──────────────┴────────────────┴─────────┐ │
│  │ delete_task                                                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                   All tools receive user_id
                   All tools filter by user_id
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Neon PostgreSQL                               │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────────────┐   │
│  │  task    │  │ conversation │  │       message           │   │
│  │ (exists) │  │    (new)     │  │        (new)            │   │
│  └──────────┘  └──────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. MCP Integration Approach

**Decision**: In-process MCP server (not separate service)
**Rationale**: Simplifies deployment, reduces latency, sufficient for hackathon scope
**Alternative Rejected**: Separate MCP server process - adds complexity without benefit for single-backend architecture

### 2. Conversation Model

**Decision**: One conversation per user (append-only message log)
**Rationale**: Simpler than session-based; conversation persists across all sessions
**Alternative Rejected**: Session-based conversations - adds complexity, unclear UX benefit

### 3. Agent Invocation Pattern

**Decision**: Create new agent instance per request (stateless)
**Rationale**: Aligns with constitution's stateless requirement; conversation context loaded from DB
**Alternative Rejected**: Long-lived agent - violates stateless principle, complex state management

### 4. Tool Parameter Design

**Decision**: user_id passed to every tool (not stored in tool state)
**Rationale**: Enforces isolation at tool level; tools cannot operate without user context
**Alternative Rejected**: Tool-level user state - violates stateless MCP principle

## Execution Steps

1. **Add new dependencies** to requirements.txt (openai-agents, mcp-sdk)
2. **Create Conversation and Message models** (SQLModel)
3. **Create database migration** for new tables
4. **Implement MCP server** with tool registration
5. **Implement 5 MCP tools** (create, list, update, complete, delete)
6. **Implement AI agent** using OpenAI Agents SDK
7. **Create chat endpoint** (POST /api/chat)
8. **Implement conversation service** (load/save messages)
9. **Wire up agent to MCP tools**
10. **Add integration tests**

## Validation Checklist

- [ ] AI only acts via MCP tools (no direct DB access in agent)
- [ ] No in-memory state leakage between requests
- [ ] Tasks persist correctly to database
- [ ] Conversations persist correctly to database
- [ ] Multiple users supported with data isolation
- [ ] Agent reasoning visible in logs
- [ ] JWT validation on chat endpoint
- [ ] 401 returned for invalid/missing tokens
- [ ] User A cannot see User B's tasks or conversations

## Complexity Tracking

No constitution violations requiring justification. Design follows all principles.

## Deliverables

- MCP server with 5 registered tools
- AI agent using OpenAI Agents SDK
- Stateless chat API endpoint
- Conversation/Message persistence
- Integration tests demonstrating agentic workflow
