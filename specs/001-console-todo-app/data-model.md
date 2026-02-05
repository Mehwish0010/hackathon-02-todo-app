# Data Model: In-Memory Console Todo Application

**Branch**: `001-console-todo-app` | **Date**: 2026-02-05

## Entities

### Todo

Represents a single todo item managed by the user.

| Field       | Type   | Required | Default     | Constraints                        |
|-------------|--------|----------|-------------|------------------------------------|
| id          | int    | Yes      | Auto-assign | Positive integer, unique, immutable |
| title       | str    | Yes      | —           | Non-empty, whitespace-trimmed      |
| description | str    | No       | ""          | May be empty string                |
| status      | str    | Yes      | "pending"   | One of: "pending", "completed"     |

**Validation Rules**:
- `title` MUST NOT be empty or whitespace-only after trimming.
- `status` MUST be exactly "pending" or "completed".
- `id` is assigned by the system and MUST NOT be set by the user.
- `id` is monotonically incrementing; deleted IDs are never reused.

**State Transitions**:

```text
[Created] → status: "pending"
                ↓ toggle
           status: "completed"
                ↓ toggle
           status: "pending"
                ↓ ...
           (cycles indefinitely)
```

- New todos always start with status "pending".
- Toggle switches between "pending" and "completed".
- There is no "archived", "deleted", or intermediate state.
- Deletion removes the item entirely (not a status change).

### TodoCollection

The in-memory store holding all Todo items for the current session.

| Attribute      | Type            | Description                           |
|----------------|-----------------|---------------------------------------|
| items          | dict[int, Todo] | All todos keyed by their integer ID   |
| next_id        | int             | Counter for the next ID to assign     |

**Invariants**:
- `next_id` starts at 1 and increments by 1 after each creation.
- `next_id` is never decremented, even after deletion.
- Every key in `items` is a positive integer matching its Todo's `id`.
- No two items share the same `id`.

## Relationships

```text
TodoCollection  1 ──── * Todo
    (contains)
```

- A TodoCollection contains zero or more Todo items.
- Each Todo belongs to exactly one TodoCollection.
- There is exactly one TodoCollection per application session.

## Lifecycle

1. **Application starts** → Empty TodoCollection created
   (`items = {}`, `next_id = 1`).
2. **User creates todo** → New Todo added to collection with
   `id = next_id`; `next_id` incremented.
3. **User lists todos** → All items in collection returned in
   insertion order (dict preserves order in Python 3.7+).
4. **User updates todo** → Item looked up by ID; title and/or
   description modified in place.
5. **User toggles status** → Item looked up by ID; status flipped.
6. **User deletes todo** → Item removed from collection by ID.
   ID is not recycled.
7. **Application exits** → Collection is garbage collected. All
   data is lost (expected Phase I behavior).
