# Research: Frontend Application & Secure API Integration

**Feature**: 003-frontend-api-integration
**Date**: 2026-02-09
**Purpose**: Resolve technical unknowns and document best practices for frontend task management UI

## Research Summary

This feature extends the existing Next.js frontend (Spec 001) to integrate with the FastAPI backend (Spec 002). Most technical decisions are pre-determined by the existing codebase and constitution.

## Decision 1: State Management Approach

**Question**: How should task state be managed in the frontend?

**Decision**: Custom React hooks with local component state

**Rationale**:
- Task list is user-specific and page-scoped (no cross-page sharing needed)
- Existing `api-client.ts` provides all HTTP functionality needed
- React's built-in useState/useEffect sufficient for this scale
- Avoids adding external state management library (Redux, Zustand, etc.)
- Simpler debugging and testing

**Alternatives Considered**:
- Redux/Zustand: Overkill for single-page task list, adds bundle size
- React Query/SWR: Good option but adds dependency; custom hook achieves same result
- Context API: Unnecessary since tasks are only used in dashboard

## Decision 2: Form Handling Pattern

**Question**: How should task creation/editing forms be handled?

**Decision**: Controlled components with local state and inline validation

**Rationale**:
- Forms are simple (2 fields max: title, description)
- No complex validation rules requiring form library
- Controlled components give predictable behavior
- Error states easily managed with useState

**Alternatives Considered**:
- React Hook Form: Good library but unnecessary for 2-field forms
- Formik: More complex than needed, larger bundle
- Uncontrolled with refs: Less predictable, harder error handling

## Decision 3: UI Component Architecture

**Question**: Should we use a component library or build custom?

**Decision**: Build minimal custom components with Tailwind CSS

**Rationale**:
- Existing components (`button.tsx`, `input.tsx`) establish pattern
- Constitution specifies no design system libraries
- Tailwind CSS already configured and used
- Only 5-6 new components needed (task-item, task-list, task-form, modal, card, empty-state)
- Keeps bundle size minimal

**Alternatives Considered**:
- Radix UI/Headless UI: Good accessibility but adds dependency
- shadcn/ui: Popular but requires setup, may conflict with existing components
- Material UI/Chakra: Too heavy for this project's scope

## Decision 4: Optimistic vs Confirmed Updates

**Question**: When should UI update before/after API confirmation?

**Decision**: Optimistic for toggles, confirmed for mutations

**Rationale**:
- Toggle completion is frequent action; immediate feedback critical for UX
- Create/edit/delete are less frequent; waiting 200ms is acceptable
- Optimistic updates on destructive actions (delete) could cause confusion
- Error recovery simpler when only toggle uses optimistic pattern

**Pattern**:
```
Toggle Complete: UI updates → API call → revert on error
Create Task:     Loading state → API call → UI updates on success
Edit Task:       Loading state → API call → UI updates on success
Delete Task:     Confirm dialog → API call → UI updates on success
```

## Decision 5: Modal vs Inline Editing

**Question**: How should edit/create forms be presented?

**Decision**: Inline form for create, modal for edit

**Rationale**:
- Create form at top of task list provides clear call-to-action
- Edit modal keeps task context visible (which task being edited)
- Delete confirmation naturally fits modal pattern
- Avoids complex inline editing state management
- Better mobile experience (full-screen modal on small screens)

**Alternatives Considered**:
- All inline: Complex state management, poor mobile UX
- All modal: Extra clicks for frequent create action
- Expandable row: Complex animation, not worth effort

## Decision 6: Error Display Pattern

**Question**: How should errors be displayed to users?

**Decision**: Inline error messages near the action that caused them

**Rationale**:
- Toast notifications require additional library or implementation
- Inline errors provide clear context (which action failed)
- Simpler implementation with existing components
- Accessible (error messages near triggering element)

**Pattern**:
- Form errors: Below the form field
- Submission errors: Below the submit button
- List errors: Error card in place of task list
- Network errors: Full-width error banner with retry

## Decision 7: Token Access Pattern

**Question**: How should components access the JWT token for API calls?

**Decision**: Pass token from useSession hook to API functions

**Rationale**:
- Existing pattern in `dashboard/page.tsx` works well
- `useSession()` provides `session.session.token`
- Token passed explicitly to api methods
- Clear data flow, easy to debug

**Code Pattern**:
```typescript
const { data: session } = useSession();
const token = session?.session?.token;

// In useTasks hook
const response = await api.get<Task[]>(`/api/v1/users/${userId}/tasks`, token);
```

## Decision 8: Component File Organization

**Question**: How should new components be organized?

**Decision**: Feature-based organization under `/components/tasks/`

**Rationale**:
- Follows existing pattern (`/components/auth/`, `/components/ui/`)
- Groups related components together
- Easy to find and maintain
- Clear separation between UI primitives and feature components

**Structure**:
```
components/
├── ui/              # Generic, reusable UI components
│   ├── button.tsx   # Existing
│   ├── input.tsx    # Existing
│   ├── card.tsx     # New
│   └── modal.tsx    # New
└── tasks/           # Task-specific components
    ├── task-list.tsx
    ├── task-item.tsx
    ├── task-form.tsx
    ├── task-delete-dialog.tsx
    └── empty-state.tsx
```

## Decision 9: Responsive Breakpoints

**Question**: What breakpoints should be used for responsive design?

**Decision**: Standard Tailwind CSS breakpoints

**Rationale**:
- Tailwind already configured in project
- Standard breakpoints well-tested across devices
- Consistent with any existing responsive code
- No custom configuration needed

**Breakpoints**:
```
sm: 640px   - Large phones
md: 768px   - Tablets
lg: 1024px  - Small laptops
xl: 1280px  - Desktops
2xl: 1536px - Large screens
```

**Mobile-first approach**: Default styles for smallest screens, add complexity at larger breakpoints.

## Decision 10: Loading State Indicators

**Question**: How should loading states be indicated?

**Decision**: Spinner for list loading, button disabled state for actions

**Rationale**:
- Consistent with existing dashboard loading pattern
- Button disabled state prevents double-submission
- Spinner provides clear feedback without complex skeleton UI
- Simple implementation, clear UX

**Pattern**:
- Initial list load: Centered spinner with "Loading tasks..."
- Task operations: Button shows spinner, disabled
- Refresh: Subtle overlay on task list

## Technology Stack Confirmation

All technology choices are pre-determined by constitution and existing codebase:

| Component | Technology | Source |
|-----------|------------|--------|
| Framework | Next.js 16+ App Router | Constitution |
| Language | TypeScript | Existing codebase |
| Styling | Tailwind CSS | Existing codebase |
| Auth | Better Auth | Spec 001 |
| API Client | Custom fetch wrapper | Spec 001 |
| Backend | FastAPI REST API | Spec 002 |

## Clarifications Resolved

No "NEEDS CLARIFICATION" items were identified during planning. The spec and constitution provide sufficient guidance for all implementation decisions.

## Best Practices Applied

1. **Component Composition**: Build small, focused components that compose together
2. **Single Responsibility**: Each component handles one concern
3. **Prop Drilling Avoidance**: Use hooks for data, pass only necessary props
4. **Error Boundaries**: Graceful error handling at component level
5. **Accessibility**: ARIA labels, keyboard navigation, focus management
6. **Performance**: Minimize re-renders, avoid unnecessary state
