<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version Change: 1.0.0 → 1.1.0 (MINOR - Phase III agentic architecture additions)

Modified Principles:
  - IV. Fixed Technology Stack: Updated to include OpenAI ChatKit, Agents SDK, MCP SDK

Added Sections:
  - VII. Agentic Architecture (NON-NEGOTIABLE)
  - VIII. MCP Tool Standards (NON-NEGOTIABLE)
  - IX. Stateless Chat Architecture (NON-NEGOTIABLE)
  - Phase III Judging Focus

Removed Sections: None

Templates Requiring Updates:
  - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
  - .specify/templates/spec-template.md: ✅ Compatible (Requirements section aligns)
  - .specify/templates/tasks-template.md: ✅ Compatible (Phase structure aligns)

Follow-up TODOs: None
================================================================================
-->

# Agentic Dev Stack — Project Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

All features MUST be derived directly from written specifications following the workflow:
**Spec → Plan → Tasks → Claude Code**

- No feature work begins without a completed specification in `specs/<feature>/spec.md`
- Implementation plans MUST be documented in `specs/<feature>/plan.md` before coding
- Tasks MUST be broken down in `specs/<feature>/tasks.md` before execution
- All implementation MUST be generated via agent prompts; no manual coding allowed
- Development steps and prompts MUST be reproducible and reviewable
- Every phase MUST be reviewable and reproducible

**Rationale**: Ensures deterministic, reviewable agent outputs and maintains traceability from
requirements to implementation.

### II. Security-First Architecture (NON-NEGOTIABLE)

Authentication MUST be enforced before any data access. All API endpoints MUST require
valid JWT tokens.

- JWT tokens MUST be validated on every backend request
- Token signature verification MUST use shared secret only (environment variable)
- Token payload MUST be the sole source of user identity
- URL user_id MUST match authenticated token user_id
- Unauthorized requests MUST return 401 responses
- No cross-user data leakage is permitted under any scenario

**Rationale**: Security is foundational; authentication before data access prevents
unauthorized operations and data breaches.

### III. User Data Isolation (NON-NEGOTIABLE)

Each user MUST only access their own data. Privacy by design is mandatory.

- Every data query MUST be filtered by authenticated user ID
- Each user may only access their own tasks
- Ownership checks MUST be enforced on every CRUD operation
- No implicit trust of client-provided user identifiers

**Rationale**: Multi-tenant applications require strict data isolation to maintain
user privacy and prevent data leakage between users.

### IV. Fixed Technology Stack (NON-NEGOTIABLE)

The technology stack is fixed and non-negotiable:

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16+ (App Router) |
| Frontend Chat UI | OpenAI ChatKit |
| Backend | Python FastAPI |
| AI Framework | OpenAI Agents SDK |
| MCP | Official MCP SDK |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth (JWT-based) |
| Spec-Driven | Claude Code + Spec-Kit Plus |

- Persistent storage is required; no in-memory or mock data
- Frontend and backend MUST share a single JWT secret via environment variables
- Never hardcode secrets, tokens, or credentials
- Backend and frontend are strictly separated

**Rationale**: Consistency across the codebase enables predictable agent behavior
and reduces integration complexity.

### V. RESTful API Standards (NON-NEGOTIABLE)

REST API MUST follow standard HTTP semantics and status codes.

- Implement full CRUD operations for tasks (Create, Read, Update, Delete)
- Implement task completion toggle endpoint
- Use RESTful endpoint naming and HTTP methods:
  - GET for retrieval (200 OK, 404 Not Found)
  - POST for creation (201 Created, 400 Bad Request)
  - PUT/PATCH for updates (200 OK, 404 Not Found)
  - DELETE for removal (204 No Content, 404 Not Found)
- 401 Unauthorized for missing/invalid tokens
- 403 Forbidden for valid token but unauthorized resource access

**Rationale**: Standard REST conventions ensure predictable API behavior and
enable consistent error handling across frontend and backend.

### VI. Responsive Frontend Design

Frontend UI MUST be responsive across desktop and mobile.

- Auth-protected routes for all task-related pages
- API client MUST automatically attach JWT token to requests
- UI MUST reflect real backend state (no fake or mock data)
- User feedback for loading, error, and success states

**Rationale**: Users access applications from multiple devices; responsive design
ensures consistent experience regardless of screen size.

### VII. Agentic Architecture (NON-NEGOTIABLE)

All AI logic MUST be tool-driven via the OpenAI Agents SDK.

- All AI agents MUST use OpenAI Agents SDK
- Agents MUST NOT directly access the database
- All task operations MUST be exposed via MCP tools
- Conversation state MUST be persisted in the database
- AI responses MUST reflect actual database state

**Rationale**: Tool-driven AI ensures deterministic behavior, auditability, and
prevents agents from bypassing security controls or data isolation.

### VIII. MCP Tool Standards (NON-NEGOTIABLE)

MCP (Model Context Protocol) tools MUST follow strict stateless patterns.

- Use Official MCP SDK only
- MCP tools MUST be stateless
- MCP tools MUST be deterministic
- No in-memory shared state between tool invocations
- Database is the single source of truth

**Rationale**: Stateless tools ensure reliability, testability, and prevent
race conditions or inconsistent state across agent invocations.

### IX. Stateless Chat Architecture (NON-NEGOTIABLE)

Chat endpoints and frontend MUST maintain strict statelessness.

- Chat API endpoints MUST be stateless
- Frontend holds no business logic
- All business logic resides in backend/MCP tools
- Conversation history MUST be fetched from database on each request
- AI responses MUST be based on current database state only

**Rationale**: Stateless architecture enables horizontal scaling, simplifies
debugging, and ensures consistency across multiple client sessions.

## Technology Stack

| Component | Specification |
|-----------|---------------|
| Frontend Framework | Next.js 16+ with App Router |
| Frontend Language | TypeScript |
| Frontend Chat UI | OpenAI ChatKit |
| Backend Framework | Python FastAPI |
| AI Framework | OpenAI Agents SDK |
| MCP | Official MCP SDK |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth with JWT tokens |
| Development Tool | Claude Code + Spec-Kit Plus |

### Authentication Flow

```
1. User logs in on Frontend → Better Auth creates session and issues JWT token
2. Frontend makes API call → Includes JWT in Authorization: Bearer <token> header
3. Backend receives request → Extracts token, verifies signature using shared secret
4. Backend identifies user → Decodes token to get user ID, email, etc.
5. Backend filters data → Returns only tasks belonging to that user
```

### Agentic Chat Flow

```
1. User sends message → Frontend sends request to /api/chat
2. Backend receives request → Validates JWT, extracts user context
3. Backend invokes AI agent → Agent reasons about user intent
4. Agent uses MCP tools → Tools execute against database (filtered by user)
5. Agent returns response → Response reflects actual database state
6. Frontend updates UI → Conversation and task list reflect changes
```

## Development Workflow

### Mandatory Workflow Sequence

All development MUST follow this strict sequence:

1. **Specification** (`/sp.specify`)
   - Create feature specification from natural language description
   - Define user stories with acceptance criteria
   - Document requirements and success criteria

2. **Planning** (`/sp.plan`)
   - Generate implementation plan from specification
   - Document technical approach and architecture
   - Identify dependencies and risks

3. **Task Breakdown** (`/sp.tasks`)
   - Break plan into actionable, ordered tasks
   - Assign priorities and dependencies
   - Include test tasks where applicable

4. **Implementation** (`/sp.implement`)
   - Execute tasks via agent prompts only
   - No manual code edits permitted
   - Record all prompts in PHR (Prompt History Records)

### Success Criteria

- All 5 Basic Level features fully implemented
- End-to-end authentication works across frontend and backend
- Each user only sees and modifies their own tasks
- Backend rejects all unauthorized or invalid requests
- Database persists data correctly across sessions
- Entire development process is reviewable via specs, plans, and prompts
- AI chatbot correctly manages tasks via MCP tools
- Conversation state persists across sessions

## Phase III Judging Focus

Evaluation criteria for Phase III agentic features:

| Criterion | Description |
|-----------|-------------|
| Correct Agentic Workflow | AI agent properly reasons and selects appropriate tools |
| Clean MCP Tool Usage | Tools are stateless, deterministic, and properly scoped |
| Stateless Design | No in-memory state; database is single source of truth |
| Security Compliance | All operations respect user isolation and JWT validation |
| UI/UX Quality | Chat interface is responsive, intuitive, and reflects state |

## Governance

### Amendment Procedure

1. Proposed amendments MUST be documented with rationale
2. Amendments require explicit user approval
3. All amendments MUST include migration plan for existing artifacts
4. Version MUST be incremented according to semantic versioning:
   - MAJOR: Backward incompatible changes (principle removal/redefinition)
   - MINOR: New principles/sections added
   - PATCH: Clarifications, typo fixes, non-semantic refinements

### Compliance Review

- All PRs/reviews MUST verify compliance with these principles
- Spec-Kit Plus commands MUST enforce Constitution Check gates
- Complexity deviations MUST be justified and documented
- Security violations are blocking and non-negotiable

### Versioning Policy

- Constitution supersedes all other practices
- Version changes MUST be tracked in Sync Impact Report
- Dependent templates MUST be updated when principles change

**Version**: 1.1.0 | **Ratified**: 2026-02-06 | **Last Amended**: 2026-02-10
