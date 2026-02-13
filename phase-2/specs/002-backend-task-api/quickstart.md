# Quickstart: Task API Testing

**Feature**: 002-backend-task-api
**Date**: 2026-02-07

## Prerequisites

- Backend running from Spec 1 (authentication working)
- Valid JWT token from signup/signin
- Neon PostgreSQL database connected

## API Base URL

```
http://localhost:8000
```

## Authentication

All endpoints require JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Task

```bash
curl -X POST "http://localhost:8000/api/v1/users/{user_id}/tasks" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My first task",
    "description": "This is a test task"
  }'
```

**Expected Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "My first task",
  "description": "This is a test task",
  "completed": false,
  "user_id": "your-user-id",
  "created_at": "2026-02-07T10:00:00Z",
  "updated_at": "2026-02-07T10:00:00Z"
}
```

### 2. List Tasks

```bash
curl -X GET "http://localhost:8000/api/v1/users/{user_id}/tasks" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response** (200 OK):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My first task",
    "description": "This is a test task",
    "completed": false,
    "user_id": "your-user-id",
    "created_at": "2026-02-07T10:00:00Z",
    "updated_at": "2026-02-07T10:00:00Z"
  }
]
```

### 3. Get Single Task

```bash
curl -X GET "http://localhost:8000/api/v1/users/{user_id}/tasks/{task_id}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "My first task",
  "description": "This is a test task",
  "completed": false,
  "user_id": "your-user-id",
  "created_at": "2026-02-07T10:00:00Z",
  "updated_at": "2026-02-07T10:00:00Z"
}
```

### 4. Update Task

```bash
curl -X PUT "http://localhost:8000/api/v1/users/{user_id}/tasks/{task_id}" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "description": "Updated description"
  }'
```

**Expected Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated task title",
  "description": "Updated description",
  "completed": false,
  "user_id": "your-user-id",
  "created_at": "2026-02-07T10:00:00Z",
  "updated_at": "2026-02-07T10:05:00Z"
}
```

### 5. Toggle Completion

```bash
curl -X PATCH "http://localhost:8000/api/v1/users/{user_id}/tasks/{task_id}/complete" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true,
  "user_id": "your-user-id",
  "created_at": "2026-02-07T10:00:00Z",
  "updated_at": "2026-02-07T10:10:00Z"
}
```

### 6. Delete Task

```bash
curl -X DELETE "http://localhost:8000/api/v1/users/{user_id}/tasks/{task_id}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response** (204 No Content):
No body returned.

---

## Error Scenarios

### No Token (401)

```bash
curl -X GET "http://localhost:8000/api/v1/users/{user_id}/tasks"
```

**Response**:
```json
{"detail": "Authorization header required"}
```

### Wrong User ID (403)

```bash
curl -X GET "http://localhost:8000/api/v1/users/other-user-id/tasks" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{"detail": "Access denied"}
```

### Task Not Found (404)

```bash
curl -X GET "http://localhost:8000/api/v1/users/{user_id}/tasks/nonexistent-id" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{"detail": "Task not found"}
```

### Validation Error (400)

```bash
curl -X POST "http://localhost:8000/api/v1/users/{user_id}/tasks" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": ""
  }'
```

**Response**:
```json
{"detail": "Title is required"}
```

---

## Verification Checklist

- [ ] Create task returns 201 with task data
- [ ] List tasks returns only authenticated user's tasks
- [ ] Get task returns 404 for non-existent task
- [ ] Update task modifies and returns updated data
- [ ] Toggle completion flips completed status
- [ ] Delete task returns 204 and removes task
- [ ] No token returns 401
- [ ] Wrong user_id returns 403
- [ ] Data persists after server restart

---

## Running the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Health check:
```bash
curl http://localhost:8000/health
# {"status":"healthy","timestamp":"2026-02-07T10:00:00Z"}
```
