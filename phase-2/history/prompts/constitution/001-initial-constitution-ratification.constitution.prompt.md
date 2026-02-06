---
id: 001
title: Initial Constitution Ratification
stage: constitution
date: 2026-02-06
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: main
user: user
command: /sp.constitution
labels: ["constitution", "governance", "security", "spec-driven-development"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

/sp.constitution

Project: Multi-user Task Management Web Application with Agentic Dev Stack

Core principles:
- Spec-driven development (spec → plan → tasks → implementation)
- Security-first architecture (authentication before data access)
- User data isolation and privacy by design
- Deterministic, reviewable agent outputs (no manual coding)
- Reproducibility of development steps and prompts

Key standards:
- All features must be derived directly from written specifications
- No manual code edits; all implementation generated via agent prompts
- All API endpoints must enforce JWT-based authentication
- Every data query must be filtered by authenticated user ID
- Frontend and backend must share a single JWT secret via environment variables
- REST API must follow standard HTTP semantics and status codes

Constraints:
- Development workflow must strictly follow:
  Spec → Plan → Task Breakdown → Agentic Implementation
- Technology stack is fixed and non-negotiable:
  - Frontend: Next.js 16+ (App Router)
  - Backend: Python FastAPI
  - ORM: SQLModel
  - Database: Neon Serverless PostgreSQL
  - Authentication: Better Auth (JWT-based)
- Persistent storage is required; no in-memory or mock data
- All API routes must require a valid JWT token
- Unauthorized requests must return 401 responses
- Each user may only access their own tasks

Security requirements:
- JWT tokens must be validated on every backend request
- Token signature verification must use shared secret only
- Token payload must be the sole source of user identity
- URL user_id must match authenticated token user_id
- No cross-user data leakage is permitted under any scenario

API requirements:
- Implement full CRUD operations for tasks
- Implement task completion toggle endpoint
- Use RESTful endpoint naming and HTTP methods
- Enforce ownership checks on every operation

Frontend requirements:
- Responsive UI across desktop and mobile
- Auth-protected routes for all task-related pages
- API client must automatically attach JWT token
- UI must reflect real backend state (no fake data)

Success criteria:
- All 5 Basic Level features fully implemented
- End-to-end authentication works across frontend and backend
- Each user only sees and modifies their own tasks
- Backend rejects all unauthorized or invalid requests
- Database persists data correctly across sessions
- Entire development process is reviewable via specs, plans, and prompts

## Response snapshot

Created project constitution v1.0.0 for Multi-user Task Management Web Application with 6 core principles:

1. **Spec-Driven Development** - Mandatory workflow: Spec → Plan → Tasks → Implementation
2. **Security-First Architecture** - JWT validation on every request, 401 for unauthorized
3. **User Data Isolation** - All queries filtered by authenticated user ID
4. **Fixed Technology Stack** - Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL, Better Auth
5. **RESTful API Standards** - Standard HTTP methods and status codes
6. **Responsive Frontend Design** - Mobile-first, auth-protected routes

Constitution file written to `.specify/memory/constitution.md` with governance rules, amendment procedures, and compliance review requirements.

## Outcome

- ✅ Impact: Initial constitution ratified - establishes project governance and non-negotiable principles
- 🧪 Tests: N/A (governance document)
- 📁 Files: .specify/memory/constitution.md (created)
- 🔁 Next prompts: /sp.specify to create feature specification
- 🧠 Reflection: Constitution provides clear boundaries for agent implementation and security requirements

## Evaluation notes (flywheel)

- Failure modes observed: None - clean initial creation
- Graders run and results (PASS/FAIL): PASS - all placeholders filled, principles are testable
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Validate constitution check integration in /sp.plan workflow
