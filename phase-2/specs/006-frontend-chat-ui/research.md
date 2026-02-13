# Research: AI Chatbot Interface for Todo Management

**Feature Branch**: `006-frontend-chat-ui`
**Created**: 2026-02-12
**Phase**: Phase III-B

## Research Questions

### 1. OpenAI ChatKit Integration with Next.js App Router

**Decision**: Use @assistant-ui/react library instead of "OpenAI ChatKit"

**Rationale**:
- "OpenAI ChatKit" is not an official OpenAI product - it refers to the @assistant-ui/react library commonly used with OpenAI assistants
- @assistant-ui/react provides pre-built chat UI components optimized for AI assistants
- Fully compatible with Next.js 16+ App Router and React Server Components
- Provides built-in typing indicators, message streaming, and error handling

**Alternatives Considered**:
- Build custom chat UI from scratch - rejected (more development time, reinventing wheel)
- Use Vercel AI SDK UI components - viable but less feature-rich
- Use shadcn/ui chat components - requires more manual integration

**Implementation Note**: Based on constitution tech stack constraint, we should verify @assistant-ui/react compatibility. If issues arise, fall back to custom components using existing Card/Button UI primitives.

---

### 2. Chat UI Positioning Strategy

**Decision**: Floating chat widget in bottom-right corner

**Rationale**:
- Non-intrusive to main task list interface
- Consistent with common chat patterns (Intercom, Drift, etc.)
- Can be expanded/collapsed without page navigation
- Works well on both desktop and mobile
- User input specified "embedded or floating" - floating is better for hackathon demo

**Alternatives Considered**:
- Embedded chat panel (side-by-side with tasks) - rejected (requires layout restructuring)
- Full-page chat view - rejected (loses task context)
- Bottom drawer - rejected (less intuitive on desktop)

---

### 3. Glassmorphism Styling for Chat Container

**Decision**: Extend existing glassmorphism design system

**Rationale**:
- Project already has established glass design tokens in Tailwind config
- Card component (card.tsx) provides glass styling patterns
- Consistent visual language with existing UI
- Existing CSS classes: bg-bg-glass, backdrop-blur-glass, border-border-glass, shadow-glass

**Implementation Approach**:
- Use existing Card component as base for chat container
- Apply same rounded-glass, shadow-glass-lg classes
- Maintain border-glass styling for input field
- Use existing text-primary/text-secondary for message styling

---

### 4. GSAP Animation Patterns for Chat Open/Close

**Decision**: Use existing GSAP setup with slide-up + scale animation

**Rationale**:
- GSAP already configured in frontend/lib/gsap.ts
- Animation presets exist: fadeIn, scaleIn, slideInRight
- useGSAP hook available for React integration
- ANIMATION_DURATION constants ensure consistency

**Animation Specification**:
- Open: scale from 0.95, y from 20, opacity from 0, duration 0.3s
- Close: reverse animation
- Messages: staggered fade-in with 0.05s delay
- Use prefersReducedMotion hook for accessibility

---

### 5. Backend API Contract

**Decision**: Use existing Phase III-A endpoints

**Rationale**:
- POST /api/chat endpoint already implemented and tested
- GET /api/chat/history endpoint available
- Schemas defined: ChatRequest, ChatResponse, MessageItem, ConversationHistory
- JWT authentication via Authorization: Bearer header

**API Contract Summary**:

```
POST /api/chat
Request: { message: string (1-2000 chars) }
Response: { message: string, conversation_id: string }
Headers: Authorization: Bearer <jwt>

GET /api/chat/history?limit=50
Response: { conversation_id: string, messages: MessageItem[] }
Headers: Authorization: Bearer <jwt>
```

---

### 6. State Management Approach

**Decision**: React useState + useEffect (no external state library)

**Rationale**:
- Chat state is localized to chat component
- Existing dashboard uses same pattern successfully
- No need for global state management (Redux, Zustand)
- Constitution mandates no business logic in frontend - state is just UI state

**State Structure**:
```typescript
interface ChatState {
  messages: ChatMessage[];
  inputValue: string;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}
```

---

### 7. Message Input Handling

**Decision**: Text input with Enter key submission + button

**Rationale**:
- Matches spec requirement FR-009
- Standard chat UX pattern
- Shift+Enter for newlines (optional enhancement)
- Input validation: prevent empty, max 2000 chars

**Accessibility Considerations**:
- Input has proper label/aria attributes
- Submit button has aria-label
- Keyboard navigation support
- Focus management on open/close

---

## Dependencies Verified

| Dependency | Status | Notes |
|------------|--------|-------|
| Phase III-A Backend | Complete | POST /api/chat, GET /api/chat/history tested |
| Better Auth | Complete | JWT token available via getToken() |
| Glassmorphism UI | Complete | Design tokens and Card component ready |
| GSAP | Complete | Configured with React integration |
| api-client.ts | Complete | Supports authenticated requests |

## Technology Decisions Summary

| Aspect | Decision |
|--------|----------|
| Chat Library | Custom components using existing UI primitives |
| Positioning | Floating widget (bottom-right) |
| Styling | Extend existing glassmorphism system |
| Animation | GSAP with existing presets |
| State | React useState/useEffect |
| API | Use Phase III-A endpoints |
