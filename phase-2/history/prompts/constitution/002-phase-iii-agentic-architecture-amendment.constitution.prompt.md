---
id: 002
title: Phase III Agentic Architecture Amendment
stage: constitution
date: 2026-02-10
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: 004-frontend-ui-redesign
user: Dell
command: /sp.constitution
labels: ["constitution", "phase-iii", "agentic", "mcp", "openai-agents"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A (constitution amendment, no tests)
---

## Prompt

# Project Constitution — Agentic Dev Stack

## Core Rules
1. No manual coding is allowed
2. All development follows:
   Spec → Plan → Tasks → Claude Code
3. Every phase must be reviewable and reproducible
4. Backend and frontend are strictly separated
5. All AI logic must be tool-driven

---

## Phase III Additions

### AI Architecture Rules
- All AI agents must use OpenAI Agents SDK
- Agents may not directly access the database
- All task operations must be exposed via MCP tools
- MCP tools must be stateless
- Conversation state must be persisted in DB

### MCP Rules
- Use Official MCP SDK only
- Tools must be deterministic
- No in-memory shared state
- Database is the single source of truth

### Chat Rules
- Chat endpoints must be stateless
- Frontend holds no business logic
- AI responses must reflect actual DB state

---

## Technology Lock
- Frontend: OpenAI ChatKit
- Backend: Python FastAPI
- AI Framework: OpenAI Agents SDK
- MCP: Official MCP SDK
- ORM: SQLModel
- DB: Neon PostgreSQL
- Auth: Better Auth

---

## Judging Focus
- Correct agentic workflow
- Clean MCP tool usage
- Stateless d

## Response snapshot

Updated constitution from v1.0.0 → v1.1.0 (MINOR version bump) with Phase III agentic architecture additions:

**Added Principles:**
- VII. Agentic Architecture (NON-NEGOTIABLE) - OpenAI Agents SDK, tool-driven AI, no direct DB access
- VIII. MCP Tool Standards (NON-NEGOTIABLE) - Stateless, deterministic MCP tools
- IX. Stateless Chat Architecture (NON-NEGOTIABLE) - Stateless endpoints, DB as source of truth

**Updated Sections:**
- IV. Fixed Technology Stack - Added OpenAI ChatKit, Agents SDK, MCP SDK
- Technology Stack table - Added new components
- Added Agentic Chat Flow diagram
- Added Phase III Judging Focus section

## Outcome

- ✅ Impact: Constitution amended with 3 new principles for Phase III agentic architecture
- 🧪 Tests: N/A (constitution amendment)
- 📁 Files: .specify/memory/constitution.md updated
- 🔁 Next prompts: /sp.specify for AI chatbot feature, /sp.plan for implementation
- 🧠 Reflection: Version bump correctly identified as MINOR (new sections added, no breaking changes)

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
