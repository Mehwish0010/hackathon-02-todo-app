<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version Change: 0.0.0 → 1.0.0 (MAJOR - Initial ratification)

Modified Principles: N/A (Initial creation)

Added Sections:
  - Core Principles (6 principles)
  - Technology Stack (fixed, non-negotiable)
  - Development Workflow
  - Governance

Removed Sections: N/A (Initial creation)

Templates Requiring Updates:
  - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
  - .specify/templates/spec-template.md: ✅ Compatible (Requirements section aligns)
  - .specify/templates/tasks-template.md: ✅ Compatible (Phase structure aligns)

Follow-up TODOs: None
================================================================================
-->

# Multi-user Task Management Web Application Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

All features MUST be derived directly from written specifications following the workflow:
**Spec → Plan → Tasks → Implementation**

- No feature work begins without a completed specification in `specs/<feature>/spec.md`
- Implementation plans MUST be documented in `specs/<feature>/plan.md` before coding
- Tasks MUST be broken down in `specs/<feature>/tasks.md` before execution
- All implementation MUST be generated via agent prompts; no manual coding allowed
- Development steps and prompts MUST be reproducible and reviewable

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
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth (JWT-based) |
| Spec-Driven | Claude Code + Spec-Kit Plus |

- Persistent storage is required; no in-memory or mock data
- Frontend and backend MUST share a single JWT secret via environment variables
- Never hardcode secrets, tokens, or credentials

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

## Technology Stack

| Component | Specification |
|-----------|---------------|
| Frontend Framework | Next.js 16+ with App Router |
| Frontend Language | TypeScript |
| Backend Framework | Python FastAPI |
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

**Version**: 1.0.0 | **Ratified**: 2026-02-06 | **Last Amended**: 2026-02-06
