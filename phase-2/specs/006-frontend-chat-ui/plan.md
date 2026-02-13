# Implementation Plan: AI Chatbot Interface for Todo Management

**Feature Branch**: `006-frontend-chat-ui`
**Created**: 2026-02-12
**Phase**: Phase III-B (Frontend Chat Experience)
**Spec**: [spec.md](./spec.md)

## Constitution Check

### Applicable Principles

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | PASS | Spec complete, plan documented |
| II. Security-First Architecture | PASS | JWT auth via Better Auth, all API calls authenticated |
| III. User Data Isolation | PASS | Chat filtered by user_id on backend |
| IV. Fixed Technology Stack | PASS | Next.js 16+, Better Auth, existing UI components |
| VI. Responsive Frontend Design | PASS | Mobile-responsive chat widget |
| VII. Agentic Architecture | N/A | Frontend only - backend handles AI agent |
| IX. Stateless Chat Architecture | PASS | No business logic in frontend, all via API |

### Gate Violations

None identified. Implementation may proceed.

---

## Technical Context

### Existing Infrastructure

| Component | Location | Status |
|-----------|----------|--------|
| Backend Chat API | backend/app/api/routes/chat.py | Complete (Phase III-A) |
| API Client | frontend/lib/api-client.ts | Complete |
| Auth Client | frontend/lib/auth-client.ts | Complete |
| GSAP Setup | frontend/lib/gsap.ts | Complete |
| UI Components | frontend/components/ui/ | Complete (Card, Button, Input) |
| Design Tokens | tailwind.config.ts | Complete (glassmorphism) |

### New Components Required

| Component | Purpose |
|-----------|---------|
| ChatWidget | Main container + open/close logic |
| ChatButton | Floating action button trigger |
| ChatContainer | Glassmorphic chat panel |
| ChatMessages | Message list with auto-scroll |
| ChatMessage | Individual message bubble |
| ChatInput | Text input with submit |
| TypingIndicator | AI processing indicator |
| useChat hook | State management + API integration |
| chat.ts types | TypeScript type definitions |

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    Protected Layout                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Dashboard Page                        │  │
│  │                     (Task List UI)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     ChatWidget                            │  │
│  │   ┌─────────────────┐    ┌─────────────────────────────┐ │  │
│  │   │  ChatButton     │    │  ChatContainer              │ │  │
│  │   │  (when closed)  │    │  (when open)                │ │  │
│  │   │  ┌───────────┐  │    │  ┌───────────────────────┐  │ │  │
│  │   │  │   FAB     │  │    │  │  ChatMessages         │  │ │  │
│  │   │  └───────────┘  │    │  │  ├─ ChatMessage       │  │ │  │
│  │   └─────────────────┘    │  │  ├─ ChatMessage       │  │ │  │
│  │                          │  │  └─ TypingIndicator   │  │ │  │
│  │                          │  ├───────────────────────┤  │ │  │
│  │                          │  │  ChatInput            │  │ │  │
│  │                          │  └───────────────────────┘  │ │  │
│  │                          └─────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Foundation (Types + Hook)

**Goal**: Establish TypeScript types and core state management

**Deliverables**:
1. `frontend/types/chat.ts` - Type definitions
2. `frontend/hooks/use-chat.ts` - Custom hook for chat state and API

**Dependencies**: None (uses existing api-client.ts)

---

### Phase 2: UI Components

**Goal**: Build all chat UI components with glassmorphism styling

**Deliverables**:
1. `frontend/components/chat/typing-indicator.tsx`
2. `frontend/components/chat/chat-message.tsx`
3. `frontend/components/chat/chat-messages.tsx`
4. `frontend/components/chat/chat-input.tsx`
5. `frontend/components/chat/chat-container.tsx`
6. `frontend/components/chat/chat-button.tsx`
7. `frontend/components/chat/chat-widget.tsx`

**Dependencies**: Phase 1 (types, hook)

---

### Phase 3: GSAP Animations

**Goal**: Add smooth open/close and message animations

**Deliverables**:
1. Open/close animation for ChatContainer
2. Staggered fade-in for messages
3. Typing indicator pulse animation

**Dependencies**: Phase 2 (components)

---

### Phase 4: Integration

**Goal**: Integrate chat widget into protected layout

**Deliverables**:
1. Update `frontend/app/(protected)/layout.tsx`
2. Verify JWT token flow
3. Test conversation persistence

**Dependencies**: Phase 3 (animations)

---

### Phase 5: Polish & Testing

**Goal**: Error handling, edge cases, responsive testing

**Deliverables**:
1. Error state UI
2. Empty state handling
3. Mobile responsiveness verification
4. Accessibility audit
5. Manual testing against acceptance criteria

**Dependencies**: Phase 4 (integration)

---

## Component Specifications

### ChatWidget

```typescript
// Position: Fixed bottom-right
// State: isOpen (boolean)
// Behavior: Toggle between ChatButton and ChatContainer
// Animation: GSAP scale + fade
```

### ChatButton

```typescript
// Appearance: Floating action button (FAB)
// Style: Glassmorphic, 56x56px, rounded-full
// Icon: Chat bubble SVG
// Animation: Subtle hover scale
// A11y: aria-label="Open chat"
```

### ChatContainer

```typescript
// Dimensions: 384px wide, 500px tall (desktop)
// Mobile: Full width - 32px margin, max 600px tall
// Position: Fixed, 24px from bottom-right
// Style: Glassmorphic card with shadow-glass-lg
// Sections: Header, Messages, Input
```

### ChatMessages

```typescript
// Behavior: Scrollable container
// Auto-scroll: Scroll to bottom on new messages
// Empty state: "Start a conversation..."
// Loading: Show history loading skeleton
```

### ChatMessage

```typescript
// User messages: Align right, accent background
// Assistant messages: Align left, glass background
// Content: Markdown support optional (plain text MVP)
// Timestamp: Relative time (optional enhancement)
```

### ChatInput

```typescript
// Type: Textarea (single line, expands)
// Max length: 2000 characters
// Submit: Button + Enter key
// Disabled: While loading
// Validation: Prevent empty submission
```

### TypingIndicator

```typescript
// Appearance: Three dots with pulse animation
// Display: When isLoading = true
// Position: Below last message
```

---

## API Integration

### Send Message Flow

```
1. User types message in ChatInput
2. User clicks Send or presses Enter
3. Validate: non-empty, <= 2000 chars
4. Add optimistic message (status: "sending")
5. Call POST /api/chat with JWT
6. On success:
   - Update message status to "sent"
   - Add assistant response to messages
7. On error:
   - Update message status to "error"
   - Show error message in UI
```

### Load History Flow

```
1. ChatWidget opens (isOpen = true)
2. Call GET /api/chat/history with JWT
3. On success:
   - Transform API messages to ChatMessage[]
   - Set messages state
4. On error:
   - Show "Failed to load history" message
   - Allow retry
```

---

## Styling Tokens

| Element | Classes |
|---------|---------|
| Container | bg-bg-glass backdrop-blur-glass border-border-glass rounded-glass shadow-glass-lg |
| User Message | bg-accent-primary/20 text-text-primary |
| Assistant Message | bg-bg-glass-hover text-text-primary |
| Input | bg-bg-elevated border-border-glass rounded-glass |
| Button (FAB) | bg-accent-primary hover:bg-accent-hover shadow-lg |

---

## Error Handling

| Error | User-Facing Message | Action |
|-------|---------------------|--------|
| Network failure | "Unable to connect. Check your internet connection." | Show retry button |
| 401 Unauthorized | Redirect to /signin | Automatic redirect |
| 500 Server error | "Something went wrong. Please try again." | Show retry button |
| Message too long | "Message is too long (max 2000 characters)" | Prevent submission |

---

## Accessibility Requirements

- [ ] Chat button has `aria-label="Open chat assistant"`
- [ ] Chat container has `role="dialog"` and `aria-modal="true"`
- [ ] Messages have `role="log"` for screen readers
- [ ] Focus trapped in chat when open
- [ ] Escape key closes chat
- [ ] Input has `aria-label="Type your message"`
- [ ] Send button has `aria-label="Send message"`
- [ ] Loading state announced to screen readers

---

## Mobile Responsiveness

| Breakpoint | Behavior |
|------------|----------|
| < 640px (sm) | Chat container: full width - 16px margin each side, max height 70vh |
| >= 640px | Chat container: 384px width, 500px height |
| Chat button | Same size on all breakpoints (56x56px) |

---

## File Manifest

| File | Type | Purpose |
|------|------|---------|
| frontend/types/chat.ts | New | TypeScript types |
| frontend/hooks/use-chat.ts | New | State management hook |
| frontend/components/chat/typing-indicator.tsx | New | Loading indicator |
| frontend/components/chat/chat-message.tsx | New | Message bubble |
| frontend/components/chat/chat-messages.tsx | New | Message list |
| frontend/components/chat/chat-input.tsx | New | Input field |
| frontend/components/chat/chat-container.tsx | New | Chat panel |
| frontend/components/chat/chat-button.tsx | New | FAB button |
| frontend/components/chat/chat-widget.tsx | New | Main widget |
| frontend/app/(protected)/layout.tsx | Modify | Add ChatWidget |

---

## Success Validation

| Criterion | Validation Method |
|-----------|-------------------|
| SC-001: Create task in <10s | Manual test with stopwatch |
| SC-002: List tasks in <3s | Manual test with stopwatch |
| SC-003: 95% success rate | Demo walkthrough without errors |
| SC-004: Desktop + mobile render | Browser dev tools responsive mode |
| SC-005: History loads in <2s | Manual test with stopwatch |
| SC-006: All 5 actions work | Test create, list, complete, update, delete via chat |
| SC-007: AI response in <5s | Manual test with stopwatch |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Backend slow response | Medium | Medium | Show typing indicator, don't timeout too quickly |
| GSAP animation jank | Low | Low | Use requestAnimationFrame, test on lower-end devices |
| Mobile keyboard overlap | Medium | Medium | Adjust container position on mobile when keyboard opens |
| JWT token expiry mid-chat | Low | Medium | Handle 401, redirect to login gracefully |

---

## Next Steps

After plan approval, run `/sp.tasks` to generate implementation tasks.
