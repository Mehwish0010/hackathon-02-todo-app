# Implementation Tasks: AI Chatbot Interface for Todo Management

**Feature Branch**: `006-frontend-chat-ui`
**Created**: 2026-02-12
**Phase**: Phase III-B (Frontend Chat Experience)
**Total Tasks**: 22

## Task Summary

| Phase | Description | Tasks | Parallel |
|-------|-------------|-------|----------|
| 1 | Setup | 2 | No |
| 2 | Foundational | 2 | Yes |
| 3 | US1 - Natural Language Todo Creation | 6 | Partial |
| 4 | US2/US3/US6 - View, Complete, Error Handling | 2 | Yes |
| 5 | US4/US5 - Update, Delete, History | 2 | Yes |
| 6 | Integration | 3 | No |
| 7 | Polish | 5 | Partial |

---

## Phase 1: Setup

**Goal**: Create directory structure and type definitions

- [x] T001 Create chat components directory at frontend/components/chat/
- [x] T002 Create TypeScript type definitions in frontend/types/chat.ts

---

## Phase 2: Foundational

**Goal**: Build the core hook that all components depend on

- [x] T003 [P] Create useChat hook with state management in frontend/hooks/use-chat.ts
- [x] T004 [P] Create chat API functions (sendMessage, loadHistory) in frontend/hooks/use-chat.ts

---

## Phase 3: User Story 1 - Natural Language Todo Creation (P1)

**Story Goal**: As a user, I want to create todos by typing natural language messages in a chat interface

**Independent Test**: Send "Create a task called Buy groceries" and verify AI confirms creation

### Tasks

- [x] T005 [US1] Create TypingIndicator component with pulse animation in frontend/components/chat/typing-indicator.tsx
- [x] T006 [US1] Create ChatMessage component with user/assistant styling in frontend/components/chat/chat-message.tsx
- [x] T007 [US1] Create ChatMessages component with auto-scroll in frontend/components/chat/chat-messages.tsx
- [x] T008 [US1] Create ChatInput component with validation (empty, max 2000 chars) in frontend/components/chat/chat-input.tsx
- [x] T009 [US1] Create ChatContainer component with glassmorphic panel in frontend/components/chat/chat-container.tsx
- [x] T010 [US1] Create ChatButton floating action button in frontend/components/chat/chat-button.tsx

---

## Phase 4: User Stories 2, 3, 6 - View Tasks, Complete Tasks, Error Handling (P2)

**Story Goal**:
- US2: Ask chatbot to show tasks
- US3: Mark tasks complete via conversation
- US6: Clear error feedback

**Independent Test**:
- US2: Ask "What are my tasks?" and verify formatted list
- US3: Say "Mark Buy groceries as done" and verify completion
- US6: Simulate network error and verify friendly message

### Tasks

- [x] T011 [P] [US2] Add empty state messaging to ChatMessages in frontend/components/chat/chat-messages.tsx
- [x] T012 [P] [US6] Add error state UI with retry button to ChatContainer in frontend/components/chat/chat-container.tsx

---

## Phase 5: User Stories 4, 5 - Update, Delete, History Persistence (P3)

**Story Goal**:
- US4: Update/delete tasks via natural language
- US5: Conversation history persists across sessions

**Independent Test**:
- US4: Say "Rename Buy groceries to Buy organic groceries" and verify update
- US5: Send messages, refresh page, verify history visible

### Tasks

- [x] T013 [P] [US5] Implement history loading on ChatWidget mount in frontend/components/chat/chat-widget.tsx
- [x] T014 [P] [US4] Ensure ChatInput handles rapid submissions (debounce) in frontend/components/chat/chat-input.tsx

---

## Phase 6: Integration

**Goal**: Wire up ChatWidget and integrate into protected layout

- [x] T015 Create main ChatWidget component with open/close state in frontend/components/chat/chat-widget.tsx
- [x] T016 Add GSAP open/close animation to ChatWidget in frontend/components/chat/chat-widget.tsx
- [x] T017 Add ChatWidget to protected layout in frontend/app/(protected)/layout.tsx

---

## Phase 7: Polish

**Goal**: Accessibility, responsiveness, and final UX polish

- [x] T018 [P] Add accessibility attributes (aria-label, role) to all chat components
- [x] T019 [P] Add keyboard navigation (Escape to close, Enter to send) to ChatWidget
- [x] T020 [P] Add mobile responsive styles (full-width on small screens) to ChatContainer
- [ ] T021 Verify chat works across all viewport sizes (375px mobile, 1920px desktop)
- [ ] T022 Manual testing against all acceptance scenarios from spec.md

---

## Dependencies

```
T001 → T002 → T003/T004 (parallel) → T005-T010 → T015 → T016 → T017
                                   ↓
                              T011/T012 (parallel, after T007/T009)
                                   ↓
                              T013/T014 (parallel, after T015)
                                   ↓
                              T018-T020 (parallel) → T021 → T022
```

### User Story Completion Order

```
US1 (P1) ─────────────────────────────────────────────────────────────┐
     │                                                                 │
     ├─► US2 (P2) ───► US3 (P2) ───► US6 (P2) ──────────────────────┤
     │                                                                 │
     └─► US4 (P3) ───► US5 (P3) ───────────────────────────────────────┘
                                                                       │
                                                                       ▼
                                                              Integration + Polish
```

---

## Parallel Execution Examples

### Phase 2 (Foundational)
```
T003 [useChat hook state] ─┬─► T005-T010
T004 [API functions]       ─┘
```

### Phase 4 (P2 Stories)
```
T011 [empty state] ─┐
                    ├─► T013-T014
T012 [error state]  ─┘
```

### Phase 7 (Polish)
```
T018 [accessibility] ─┐
T019 [keyboard nav]   ├─► T021 [viewport testing]
T020 [mobile styles]  ─┘
```

---

## Implementation Strategy

### MVP Scope (User Story 1 Only)
- Complete Phases 1-3 + Phase 6
- Delivers: Floating chat button, glassmorphic panel, message send/receive, typing indicator
- Can demo: "Create a task called Buy groceries"

### Incremental Delivery
1. **MVP**: US1 complete → Demo natural language task creation
2. **+P2**: US2/US3/US6 → Demo listing, completing tasks, error handling
3. **+P3**: US4/US5 → Demo full CRUD, history persistence
4. **Polish**: Accessibility, mobile, final QA

---

## File Manifest

| Task | File | Type |
|------|------|------|
| T001 | frontend/components/chat/ | Directory |
| T002 | frontend/types/chat.ts | New |
| T003-T004 | frontend/hooks/use-chat.ts | New |
| T005 | frontend/components/chat/typing-indicator.tsx | New |
| T006 | frontend/components/chat/chat-message.tsx | New |
| T007 | frontend/components/chat/chat-messages.tsx | New |
| T008 | frontend/components/chat/chat-input.tsx | New |
| T009 | frontend/components/chat/chat-container.tsx | New |
| T010 | frontend/components/chat/chat-button.tsx | New |
| T011 | frontend/components/chat/chat-messages.tsx | Modify |
| T012 | frontend/components/chat/chat-container.tsx | Modify |
| T013 | frontend/components/chat/chat-widget.tsx | New |
| T014 | frontend/components/chat/chat-input.tsx | Modify |
| T015-T016 | frontend/components/chat/chat-widget.tsx | Modify |
| T017 | frontend/app/(protected)/layout.tsx | Modify |
| T018-T020 | Multiple chat components | Modify |

---

## Validation Checklist

### Per User Story
- [ ] US1: Can create task via "Create a task called X"
- [ ] US2: Can list tasks via "Show me my tasks"
- [ ] US3: Can complete tasks via "Mark X as done"
- [ ] US4: Can update/delete via "Rename X to Y" / "Delete X"
- [ ] US5: History persists after page refresh
- [ ] US6: Error messages are user-friendly

### Cross-Cutting
- [ ] Chat button visible on all protected pages
- [ ] Glassmorphic styling matches app theme
- [ ] Mobile responsive (375px viewport)
- [ ] Keyboard accessible
- [ ] JWT token included in all requests
- [ ] No business logic in frontend
