# Implementation Plan: In-Memory Console Todo Application

**Branch**: `001-console-todo-app` | **Date**: 2026-02-05 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-console-todo-app/spec.md`

## Summary

Build a single-user, in-memory, console-based todo application in
Python. The app presents a numbered menu, accepts text input, and
performs CRUD operations plus status toggling on todo items stored
in a Python dictionary. The codebase is organized into three
modules (model, service, cli) enforcing separation of concerns per
the constitution, with pytest for testing. No external dependencies,
no file I/O, no database.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: None (stdlib only); pytest for testing
**Storage**: In-memory dictionary keyed by integer ID
**Testing**: pytest with in-memory fixtures
**Target Platform**: Any OS with Python 3.11+ and a terminal
**Project Type**: Single project
**Performance Goals**: Instant response for all operations; supports
100+ todos in a single session without degradation
**Constraints**: No file I/O, no database, no web frameworks, no
external libraries (runtime); stdlib only
**Scale/Scope**: Single user, single session, in-memory only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Simplicity-First | No abstractions beyond what CRUD + menu require. Three modules max. No ORM, no patterns beyond plain functions and a dict. | PASS |
| II. Separation of Concerns | Model (data representation), Service (business logic), CLI (user interaction) as distinct modules. No layer imports internals of another. | PASS |
| III. Deterministic Behavior | All functions are pure or have isolated side effects (print/input). Given same state + input, output is identical. | PASS |
| IV. Progressive Enhancement | Phase I only. No DB, no web, no AI, no containers. Standalone runnable. | PASS |
| V. Production-Minded Design | Structured error messages, clear prompts, no hardcoded secrets (N/A for Phase I but pattern established). Human-readable logging via print. | PASS |
| VI. Fail-Loud Transparency | Invalid input produces immediate, clear error. No silent failures. Validation errors enumerated. | PASS |

All gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-console-todo-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── internal-api.md  # Function signatures and contracts
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
src/
├── __init__.py
├── models/
│   ├── __init__.py
│   └── todo.py          # Todo dataclass, TodoCollection
├── services/
│   ├── __init__.py
│   └── todo_service.py  # CRUD + toggle business logic
├── cli/
│   ├── __init__.py
│   └── menu.py          # Menu display, input capture, routing
└── main.py              # Entry point, main loop

tests/
├── __init__.py
├── unit/
│   ├── __init__.py
│   ├── test_todo_model.py
│   └── test_todo_service.py
└── integration/
    ├── __init__.py
    └── test_cli_flow.py
```

**Structure Decision**: Single project layout selected. This is a
Phase I console application with no frontend/backend split. Three
source modules (`models`, `services`, `cli`) map directly to the
constitution's separation of concerns layers (Data, Logic,
Interface). The `main.py` entry point owns the application loop
and delegates to the CLI module.

## Complexity Tracking

> No violations. All gates pass. No complexity justification needed.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none)    | —          | —                                   |
