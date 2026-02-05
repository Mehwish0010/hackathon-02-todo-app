# Research: In-Memory Console Todo Application

**Branch**: `001-console-todo-app` | **Date**: 2026-02-05

## Decision 1: In-Memory Data Structure

**Decision**: Use a Python `dict[int, Todo]` keyed by integer ID,
with a monotonically incrementing counter for ID generation.

**Rationale**:
- O(1) lookup by ID for update, delete, and toggle operations.
- Insertion order preserved in Python 3.7+ dicts, so listing todos
  returns them in creation order without extra sorting.
- Simpler than a list (no index shifting on delete, no linear scan
  for ID lookup).
- The integer counter never resets or recycles IDs, preventing
  confusion when items are deleted.

**Alternatives considered**:
- `list[Todo]` with linear scan: Simpler conceptually but O(n) for
  lookup by ID. Rejected because dict is equally simple in Python
  and performs better.
- `OrderedDict`: Unnecessary since Python 3.7+ dicts maintain
  insertion order natively.
- SQLite in-memory: Violates the "no database" constraint and adds
  unnecessary complexity for Phase I.

## Decision 2: Todo Data Representation

**Decision**: Use a Python `dataclass` for the Todo entity with
fields: `id` (int), `title` (str), `description` (str, default
empty string), `status` (str, default "pending").

**Rationale**:
- Dataclasses provide clear field declarations, automatic `__init__`,
  `__repr__`, and `__eq__` — reducing boilerplate.
- Part of Python stdlib (no external dependency).
- Fields are mutable by default, allowing in-place updates.
- Beginner-friendly and readable.

**Alternatives considered**:
- Plain dict: Less readable, no type hints, no automatic repr.
  Rejected for reduced clarity.
- NamedTuple: Immutable by default, requiring replacement on update.
  Rejected because todos need mutable status and title/description.
- Pydantic model: External dependency. Rejected per Phase I stdlib
  constraint.
- Regular class with manual `__init__`: More verbose with no benefit
  over dataclass. Rejected.

## Decision 3: Module Organization

**Decision**: Three modules under `src/`:
- `models/todo.py` — Todo dataclass and TodoCollection (dict wrapper)
- `services/todo_service.py` — Business logic functions (add, list,
  update, toggle, delete)
- `cli/menu.py` — Menu display, input handling, routing

Entry point at `src/main.py`.

**Rationale**:
- Directly maps to constitution's Separation of Concerns layers:
  Data, Logic, Interface.
- The service layer operates on TodoCollection without knowing how
  the CLI works. The CLI calls service functions without knowing
  how data is stored.
- This structure scales to Phase II: the service layer can be
  wrapped by FastAPI endpoints without modification.

**Alternatives considered**:
- Single file: Simplest possible, but violates Separation of
  Concerns (Constitution Principle II). Rejected.
- Two files (logic + cli): Merges model and service, which makes
  Phase II extraction harder. Rejected.
- Four+ modules (adding utils, config, etc.): Over-engineered for
  Phase I. Rejected per Simplicity-First (Constitution Principle I).

## Decision 4: Testing Approach

**Decision**: Use `pytest` with unit tests for model and service
layers, and integration tests that simulate CLI input/output using
`monkeypatch` and `capsys`.

**Rationale**:
- pytest is the de facto Python testing standard and is already
  specified in the constitution's Phase I standards.
- Unit tests for model and service are straightforward since these
  layers are pure functions operating on in-memory data.
- CLI integration tests use pytest's built-in `monkeypatch` to
  simulate `input()` and `capsys` to capture `print()` output,
  avoiding any external test dependencies.

**Alternatives considered**:
- unittest (stdlib): More verbose, less ergonomic. pytest is
  explicitly named in the constitution.
- Manual testing only: Insufficient for regression detection.
  Rejected.
- Hypothesis (property-based testing): Overkill for Phase I CRUD
  operations. Could be added later if needed.

## Decision 5: Error Handling Strategy

**Decision**: Service functions raise `ValueError` with descriptive
messages for invalid operations (not found, empty title). The CLI
layer catches these and displays user-friendly error messages, then
re-presents the menu.

**Rationale**:
- Keeps the service layer unaware of the presentation layer.
- `ValueError` is a stdlib exception, no custom exception hierarchy
  needed for Phase I (Simplicity-First).
- The CLI catches specific exceptions and formats them for the user,
  satisfying Fail-Loud Transparency.
- Non-numeric input is caught at the CLI layer with `try/except
  ValueError` on `int()` conversion before reaching the service.

**Alternatives considered**:
- Return error codes/tuples: Less Pythonic, harder to read. Rejected.
- Custom exception classes: Over-engineered for 2-3 error types in
  Phase I. Can be introduced in Phase II if needed. Rejected.
- Let exceptions propagate to user: Violates user-friendly error
  requirement. Rejected.
