# API Contract Reference

**Feature**: 003-frontend-api-integration
**Date**: 2026-02-09
**Source**: Spec 002 - Backend Task API

## Overview

This document references the backend API contracts defined in Spec 002. The frontend consumes these existing endpoints.

**API Base URL**: `http://localhost:8000` (configurable via `NEXT_PUBLIC_API_URL`)

**Authentication**: All endpoints require `Authorization: Bearer <token>` header

## Endpoints Summary

| Operation | Method | Endpoint |
|-----------|--------|----------|
| List Tasks | GET | `/api/v1/users/{user_id}/tasks` |
| Create Task | POST | `/api/v1/users/{user_id}/tasks` |
| Get Task | GET | `/api/v1/users/{user_id}/tasks/{task_id}` |
| Update Task | PUT | `/api/v1/users/{user_id}/tasks/{task_id}` |
| Delete Task | DELETE | `/api/v1/users/{user_id}/tasks/{task_id}` |
| Toggle Complete | PATCH | `/api/v1/users/{user_id}/tasks/{task_id}/complete` |

## Detailed Contracts

### List Tasks

```
GET /api/v1/users/{user_id}/tasks

Headers:
  Authorization: Bearer <jwt_token>

Response 200 OK:
  Content-Type: application/json
  Body: [
    {
      "id": "uuid",
      "title": "string",
      "description": "string | null",
      "completed": false,
      "user_id": "uuid",
      "created_at": "2026-02-09T12:00:00Z",
      "updated_at": "2026-02-09T12:00:00Z"
    }
  ]

Response 401 Unauthorized:
  Body: { "detail": "Authorization header required" }

Response 403 Forbidden:
  Body: { "detail": "Access denied" }
```

### Create Task

```
POST /api/v1/users/{user_id}/tasks

Headers:
  Authorization: Bearer <jwt_token>
  Content-Type: application/json

Request Body:
  {
    "title": "string (required, 1-200 chars)",
    "description": "string (optional, max 1000 chars)"
  }

Response 201 Created:
  Body: { ...Task }

Response 400 Bad Request:
  Body: { "detail": "Title is required" }

Response 401 Unauthorized:
  Body: { "detail": "Authorization header required" }

Response 403 Forbidden:
  Body: { "detail": "Access denied" }
```

### Update Task

```
PUT /api/v1/users/{user_id}/tasks/{task_id}

Headers:
  Authorization: Bearer <jwt_token>
  Content-Type: application/json

Request Body:
  {
    "title": "string (optional, 1-200 chars)",
    "description": "string (optional, max 1000 chars)"
  }

Response 200 OK:
  Body: { ...Task }

Response 400 Bad Request:
  Body: { "detail": "validation error" }

Response 404 Not Found:
  Body: { "detail": "Task not found" }
```

### Toggle Complete

```
PATCH /api/v1/users/{user_id}/tasks/{task_id}/complete

Headers:
  Authorization: Bearer <jwt_token>

Response 200 OK:
  Body: { ...Task with toggled completed field }

Response 404 Not Found:
  Body: { "detail": "Task not found" }
```

### Delete Task

```
DELETE /api/v1/users/{user_id}/tasks/{task_id}

Headers:
  Authorization: Bearer <jwt_token>

Response 204 No Content:
  (empty body)

Response 404 Not Found:
  Body: { "detail": "Task not found" }
```

## Error Response Format

All error responses follow this format:

```json
{
  "detail": "Human-readable error message"
}
```

## Status Code Summary

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 200 | Success | Update state with response |
| 201 | Created | Add to list, close form |
| 204 | Deleted | Remove from list |
| 400 | Validation Error | Show error message |
| 401 | Unauthorized | Redirect to signin |
| 403 | Forbidden | Show access denied |
| 404 | Not Found | Remove from list if present |
| 500 | Server Error | Show generic error, allow retry |

## Full Contract Reference

For complete OpenAPI specification, see:
- `specs/002-backend-task-api/contracts/tasks-api.yaml`
- `specs/002-backend-task-api/quickstart.md`
