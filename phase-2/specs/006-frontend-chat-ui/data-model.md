# Data Model: AI Chatbot Interface

**Feature Branch**: `006-frontend-chat-ui`
**Created**: 2026-02-12

## Overview

This feature is frontend-only and does not introduce new database entities. All conversation data is managed by the Phase III-A backend. This document defines the TypeScript types used by the frontend chat components.

## Frontend Types

### ChatMessage

Represents a single message in the chat UI.

```typescript
interface ChatMessage {
  id: string;           // Unique message identifier
  role: "user" | "assistant";  // Message sender role
  content: string;      // Message text content
  createdAt: Date;      // Message timestamp
  status?: "sending" | "sent" | "error";  // Message delivery status
}
```

**Validation Rules**:
- `id`: Required, non-empty string (UUID from backend)
- `role`: Required, must be "user" or "assistant"
- `content`: Required, 1-2000 characters
- `createdAt`: Required, valid Date object
- `status`: Optional, used for optimistic UI updates

---

### ChatState

Represents the current state of the chat widget.

```typescript
interface ChatState {
  isOpen: boolean;           // Whether chat widget is expanded
  messages: ChatMessage[];   // Conversation history
  inputValue: string;        // Current input field value
  isLoading: boolean;        // Whether AI is processing
  error: string | null;      // Error message if any
  conversationId: string | null;  // Current conversation ID
}
```

**State Transitions**:
- `isOpen`: false → true (user clicks chat button)
- `isLoading`: false → true (user sends message) → false (response received)
- `error`: null → string (on error) → null (on retry or new message)

---

### ChatApiRequest

Request payload for POST /api/chat.

```typescript
interface ChatApiRequest {
  message: string;  // User message (1-2000 chars)
}
```

---

### ChatApiResponse

Response payload from POST /api/chat.

```typescript
interface ChatApiResponse {
  message: string;        // AI response text
  conversation_id: string; // Conversation identifier
}
```

---

### ConversationHistoryResponse

Response payload from GET /api/chat/history.

```typescript
interface ConversationHistoryResponse {
  conversation_id: string;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    created_at: string;  // ISO 8601 timestamp
  }>;
}
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │  ChatWidget     │    │  ChatState      │                 │
│  │  (Component)    │◄───│  (React State)  │                 │
│  └────────┬────────┘    └─────────────────┘                 │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────┐                                        │
│  │  useChatApi     │  Custom hook for API calls             │
│  │  (Hook)         │                                        │
│  └────────┬────────┘                                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────┐                                        │
│  │  api-client.ts  │  HTTP client with JWT                  │
│  └────────┬────────┘                                        │
└───────────┼─────────────────────────────────────────────────┘
            │
            ▼ HTTP (JWT in Authorization header)
┌───────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                        │
├───────────────────────────────────────────────────────────┤
│  POST /api/chat                                           │
│  GET /api/chat/history                                    │
└───────────────────────────────────────────────────────────┘
```

## Type Mapping: Backend → Frontend

| Backend Field | Frontend Field | Transformation |
|---------------|----------------|----------------|
| `id` | `id` | Direct |
| `role` | `role` | Direct |
| `content` | `content` | Direct |
| `created_at` | `createdAt` | ISO string → Date object |
| `conversation_id` | `conversationId` | snake_case → camelCase |

## Validation Constraints

| Field | Constraint | Error Message |
|-------|------------|---------------|
| message (input) | Min 1 character | "Message cannot be empty" |
| message (input) | Max 2000 characters | "Message is too long (max 2000 characters)" |
| role | Must be "user" or "assistant" | N/A (enforced by type system) |
