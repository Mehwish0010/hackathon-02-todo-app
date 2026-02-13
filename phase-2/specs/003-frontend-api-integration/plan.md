# Implementation Plan: Frontend Application & Secure API Integration

**Branch**: `003-frontend-api-integration` | **Date**: 2026-02-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-frontend-api-integration/spec.md`

## Summary

Implement a responsive task management frontend that integrates with the existing FastAPI backend via JWT-protected API calls. The frontend will extend the existing Next.js application (from Spec 001) with a complete task dashboard featuring CRUD operations, real-time UI updates, and production-ready responsive design.

**Primary Requirements**:
- Task list view displaying user's tasks with completion status
- Task creation form with title (required) and description (optional)
- Task editing capability with inline or modal form
- Task deletion with confirmation dialog
- Task completion toggle with immediate visual feedback
- All operations sync with backend and reflect accurate state

**Technical Approach**:
- Extend existing dashboard page with task components
- Use existing API client (`lib/api-client.ts`) for all backend calls
- Leverage existing Better Auth session for JWT token access
- Component-based architecture with reusable UI elements
- Optimistic UI updates with error recovery

## Technical Context

**Language/Version**:
- TypeScript 5.x on Node.js 20+
- React 19+ with Next.js 16+ App Router

**Primary Dependencies**:
- Next.js 16+ (App Router) - already configured
- Better Auth - already configured
- Tailwind CSS - already configured
- Existing API client (`lib/api-client.ts`)

**Storage**: Neon Serverless PostgreSQL (via FastAPI backend - already configured)

**Testing**:
- Manual E2E testing via quickstart guide
- Browser testing for responsive layout

**Target Platform**: Web (all modern browsers, desktop and mobile)

**Project Type**: Web application frontend extension

**Performance Goals**:
- Task list load < 2 seconds for up to 100 tasks
- UI updates reflect backend response < 1 second
- Form submission feedback < 500ms

**Constraints**:
- Must use existing API client (no new HTTP libraries)
- Must use existing Better Auth session for tokens
- No mock or static data - all from backend API
- No manual coding - all generated via agent prompts
- Responsive design (320px to 1920px viewports)

**Scale/Scope**: Single-user task list, up to several hundred tasks per user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Spec-Driven Development | ✅ PASS | Spec exists at `spec.md`, plan being created before tasks |
| II. Security-First Architecture | ✅ PASS | All API calls via existing JWT-enabled client, token auto-attached |
| III. User Data Isolation | ✅ PASS | Backend already filters by user_id; frontend displays only returned data |
| IV. Fixed Technology Stack | ✅ PASS | Using Next.js 16+, existing Better Auth, existing FastAPI backend |
| V. RESTful API Standards | ✅ PASS | Consuming existing REST endpoints from Spec 002 |
| VI. Responsive Frontend Design | ✅ PASS | Spec requires mobile (320px) to desktop (1920px) support |

**Gate Result**: PASS - All constitution principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/003-frontend-api-integration/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - entity definitions (references Spec 002)
├── quickstart.md        # Phase 1 output - testing guide
├── contracts/           # Phase 1 output - API contracts (references Spec 002)
│   └── tasks-api.yaml   # Reference to existing backend API
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── (auth)/                    # Existing auth pages
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (protected)/
│   │   ├── dashboard/
│   │   │   └── page.tsx           # MODIFY: Add task list integration
│   │   └── layout.tsx             # Existing protected layout
│   ├── api/auth/[...all]/route.ts # Existing Better Auth handler
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts                    # Existing Better Auth config
│   ├── auth-client.ts             # Existing client auth hooks
│   └── api-client.ts              # Existing API client (reuse)
├── components/
│   ├── auth/                      # Existing auth components
│   │   ├── signin-form.tsx
│   │   ├── signup-form.tsx
│   │   └── signout-button.tsx
│   ├── ui/                        # Existing + new UI components
│   │   ├── input.tsx              # Existing
│   │   ├── button.tsx             # Existing
│   │   ├── card.tsx               # NEW: Card wrapper component
│   │   └── modal.tsx              # NEW: Modal for edit/delete confirm
│   └── tasks/                     # NEW: Task-related components
│       ├── task-list.tsx          # Task list container
│       ├── task-item.tsx          # Individual task display
│       ├── task-form.tsx          # Create/edit task form
│       ├── task-delete-dialog.tsx # Delete confirmation
│       └── empty-state.tsx        # Empty task list state
├── hooks/                         # NEW: Custom hooks
│   └── use-tasks.ts               # Task data fetching and mutations
├── types/                         # NEW: TypeScript types
│   └── task.ts                    # Task interface definitions
├── middleware.ts                  # Existing route protection
└── package.json
```

**Structure Decision**: Extend existing frontend structure with new `/components/tasks/` directory for task-specific components, `/hooks/` for data management, and `/types/` for type definitions. Minimal changes to existing files.

## Implementation Phases

### Phase 1: Type Definitions & API Integration Layer

**Purpose**: Define TypeScript types and create task-specific API hooks

**Steps**:
1. Create `types/task.ts` with Task interface matching backend schema
2. Create `hooks/use-tasks.ts` custom hook for task CRUD operations
3. Implement task list fetching with loading/error states
4. Implement task creation mutation
5. Implement task update mutation
6. Implement task deletion mutation
7. Implement task completion toggle mutation

**Inputs**: Backend API contract from Spec 002, existing API client
**Outputs**: Type-safe task API integration layer

### Phase 2: Core UI Components

**Purpose**: Create reusable UI components for task display

**Steps**:
1. Create `components/ui/card.tsx` - container component for tasks
2. Create `components/ui/modal.tsx` - dialog component for confirmations
3. Create `components/tasks/empty-state.tsx` - display when no tasks exist
4. Create `components/tasks/task-item.tsx` - single task display with actions

**Inputs**: UI design requirements from spec, Tailwind CSS
**Outputs**: Reusable, styled UI components

### Phase 3: Task List View

**Purpose**: Implement main task list display on dashboard

**Steps**:
1. Create `components/tasks/task-list.tsx` - container for task items
2. Implement loading state display
3. Implement error state with retry
4. Implement empty state with call-to-action
5. Update `app/(protected)/dashboard/page.tsx` to include task list

**Inputs**: Task API hooks, UI components
**Outputs**: Functional task list display

### Phase 4: Task Creation

**Purpose**: Implement task creation functionality

**Steps**:
1. Create `components/tasks/task-form.tsx` with title/description fields
2. Implement form validation (title required, length limits)
3. Implement form submission with loading state
4. Implement success feedback (toast or inline)
5. Implement error handling with user message
6. Add "Add Task" button/trigger to dashboard

**Inputs**: Task creation API, form validation rules
**Outputs**: Working task creation with validation

### Phase 5: Task Completion Toggle

**Purpose**: Implement task completion status toggle

**Steps**:
1. Add checkbox/toggle to `task-item.tsx`
2. Implement optimistic UI update (immediate visual change)
3. Call backend toggle endpoint
4. Handle success (confirm state)
5. Handle error (revert state, show message)

**Inputs**: Task toggle API endpoint, current task state
**Outputs**: Instant toggle with backend sync

### Phase 6: Task Editing

**Purpose**: Implement task editing functionality

**Steps**:
1. Add edit button/action to `task-item.tsx`
2. Reuse `task-form.tsx` in edit mode (pre-populated)
3. Implement modal or inline editing UI
4. Implement update submission with validation
5. Handle success (update list)
6. Handle error (show message, preserve form)

**Inputs**: Task update API, existing task data
**Outputs**: Working task editing with validation

### Phase 7: Task Deletion

**Purpose**: Implement task deletion with confirmation

**Steps**:
1. Create `components/tasks/task-delete-dialog.tsx`
2. Add delete button/action to `task-item.tsx`
3. Show confirmation dialog before delete
4. Implement delete API call
5. Handle success (remove from list)
6. Handle error (show message)

**Inputs**: Task delete API, confirmation UX pattern
**Outputs**: Safe task deletion with user confirmation

### Phase 8: Responsive Design & Polish

**Purpose**: Ensure responsive layout and production quality

**Steps**:
1. Test and adjust layout for mobile (320px-480px)
2. Test and adjust layout for tablet (481px-1024px)
3. Test and adjust layout for desktop (1025px+)
4. Add loading spinners and transitions
5. Ensure proper focus management for accessibility
6. Verify error messages are clear and actionable

**Inputs**: All components, responsive design requirements
**Outputs**: Production-ready responsive UI

### Phase 9: Integration Testing

**Purpose**: Verify complete end-to-end functionality

**Steps**:
1. Test signup → signin → view empty dashboard
2. Test create task → appears in list
3. Test toggle completion → persists on refresh
4. Test edit task → changes persist
5. Test delete task → removed from list
6. Test signout → cannot access dashboard
7. Test direct dashboard URL without auth → redirect to signin

**Inputs**: Complete frontend implementation, running backend
**Outputs**: Verified end-to-end task management flow

## API Endpoints (from Spec 002)

The frontend will consume these existing backend endpoints:

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| List Tasks | GET | `/api/v1/users/{user_id}/tasks` | - | `Task[]` |
| Create Task | POST | `/api/v1/users/{user_id}/tasks` | `{title, description?}` | `Task` |
| Get Task | GET | `/api/v1/users/{user_id}/tasks/{task_id}` | - | `Task` |
| Update Task | PUT | `/api/v1/users/{user_id}/tasks/{task_id}` | `{title?, description?}` | `Task` |
| Delete Task | DELETE | `/api/v1/users/{user_id}/tasks/{task_id}` | - | `204` |
| Toggle Complete | PATCH | `/api/v1/users/{user_id}/tasks/{task_id}/complete` | - | `Task` |

All endpoints require `Authorization: Bearer <token>` header (handled by existing API client).

## Data Flow

```
User Action → Component → Custom Hook → API Client → Backend API
                                                         ↓
UI Update  ←  State Update  ←  Response Processing  ←  Response
```

**Optimistic Updates**: For toggle completion, the UI updates immediately before API confirmation. On error, the state is reverted.

**Confirmed Updates**: For create/edit/delete, the UI waits for API confirmation before updating.

## Error Handling Strategy

| Error Type | User Experience |
|------------|-----------------|
| Network Error | "Connection failed. Please check your internet and try again." with retry button |
| 401 Unauthorized | Automatic redirect to signin page |
| 403 Forbidden | "Access denied" message (shouldn't occur with proper user_id) |
| 404 Not Found | "Task not found" - remove from list if already displayed |
| 400 Bad Request | Show validation error message from backend |
| 500 Server Error | "Something went wrong. Please try again later." |

## Component Hierarchy

```
DashboardPage
├── TaskList
│   ├── LoadingState
│   ├── ErrorState (with retry)
│   ├── EmptyState (with create CTA)
│   └── TaskItem[] (mapped from tasks)
│       ├── Checkbox (toggle complete)
│       ├── TaskContent (title, description)
│       ├── EditButton → TaskForm (modal)
│       └── DeleteButton → TaskDeleteDialog (modal)
└── TaskForm (create new - inline or modal)
```

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Session token not available | API calls fail with 401 | Check session before API calls, show login prompt |
| Backend unavailable | No data displayed | Show error state with retry, check backend health |
| Large task list performance | Slow render | Virtualization if needed (out of scope per spec) |
| Form state lost on error | User frustration | Preserve form data on submission errors |
| Race conditions on rapid clicks | Inconsistent state | Disable buttons during pending operations |

## Complexity Tracking

No constitution violations requiring justification. Implementation follows all principles and leverages existing infrastructure from Spec 001 and Spec 002.

## Handoff Points

### From Spec 001 (Auth Layer)

Receiving:
- `lib/api-client.ts` - API client with JWT injection
- `lib/auth-client.ts` - useSession hook for token access
- `app/(protected)/layout.tsx` - Protected route wrapper
- `middleware.ts` - Route protection middleware

### From Spec 002 (Backend API)

Receiving:
- REST endpoints for task CRUD
- Task schema (id, title, description, completed, user_id, timestamps)
- JWT validation and user_id verification

### Deliverables

This spec delivers:
- Complete task management UI
- Integration with all backend endpoints
- Responsive, production-ready design
- End-to-end authenticated task flow

## Next Steps

1. Run `/sp.tasks` to generate task breakdown
2. Execute tasks via `/sp.implement`
3. Verify with quickstart.md testing guide
