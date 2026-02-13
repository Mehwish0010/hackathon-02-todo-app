# Tasks: Advanced Frontend UI/UX Redesign

**Feature Branch**: `004-frontend-ui-redesign`
**Input**: Design documents from `/specs/004-frontend-ui-redesign/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Manual verification only (no automated tests requested)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/` directory (Next.js App Router)
- **Styles**: `frontend/app/globals.css` and `frontend/styles/`
- **Components**: `frontend/components/`
- **Hooks**: `frontend/hooks/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install GSAP, configure design tokens, establish foundational styles

- [x] T001 Install GSAP and @gsap/react packages via npm in frontend/package.json
- [x] T002 [P] Create design tokens CSS file in frontend/styles/design-tokens.css
- [x] T003 [P] Create glassmorphism utility CSS classes in frontend/styles/glassmorphism.css
- [x] T004 Update frontend/tailwind.config.ts with dark theme color extensions
- [x] T005 Update frontend/app/globals.css to import design tokens and apply dark theme base
- [x] T006 Register GSAP plugin in frontend/lib/gsap.ts

**Checkpoint**: GSAP installed, design tokens defined, dark theme base applied

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core animation hooks and base UI components that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create useGSAP animation hook wrapper in frontend/hooks/use-animation.ts
- [x] T008 [P] Create BackgroundOrbs component in frontend/components/ui/background-orbs.tsx
- [x] T009 [P] Redesign Button component with glassmorphism in frontend/components/ui/button.tsx
- [x] T010 [P] Redesign Card component with glassmorphism in frontend/components/ui/card.tsx
- [x] T011 [P] Redesign Input component with focus animations in frontend/components/ui/input.tsx
- [x] T012 Redesign Modal/Dialog component with entrance animations in frontend/components/ui/modal.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Premium Visual First Impression (Priority: P1) 🎯 MVP

**Goal**: Users see a stunning dark-themed interface with glassmorphism on first load

**Independent Test**: Load homepage/signin page and verify glassmorphism cards, blur effects, refined spacing, and dark theme are visible

### Implementation for User Story 1

- [x] T013 [US1] Update root layout.tsx with dark theme body styles in frontend/app/layout.tsx
- [x] T014 [US1] Add BackgroundOrbs to root layout for depth effect in frontend/app/layout.tsx
- [x] T015 [P] [US1] Redesign landing page with premium glassmorphism hero in frontend/app/page.tsx
- [x] T016 [P] [US1] Update typography styles with refined hierarchy in frontend/app/globals.css
- [x] T017 [US1] Verify visual consistency across homepage load

**Checkpoint**: Homepage displays premium dark theme with glassmorphism on first impression

---

## Phase 4: User Story 2 - Animated Task Interactions (Priority: P1)

**Goal**: Smooth GSAP animations for task creation, completion, editing, and deletion

**Independent Test**: Create a task, toggle completion, edit, and delete while observing smooth transitions

### Implementation for User Story 2

- [x] T018 [US2] Redesign task-item.tsx with glassmorphism card style in frontend/components/tasks/task-item.tsx
- [x] T019 [US2] Add GSAP entrance animation for new tasks in frontend/components/tasks/task-item.tsx
- [x] T020 [US2] Add GSAP exit animation for deleted tasks in frontend/components/tasks/task-item.tsx
- [x] T021 [US2] Add completion state animation (strikethrough + opacity) in frontend/components/tasks/task-item.tsx
- [x] T022 [US2] Redesign task-list.tsx with staggered entrance animations in frontend/components/tasks/task-list.tsx
- [x] T023 [P] [US2] Redesign task-form.tsx with animated inputs in frontend/components/tasks/task-form.tsx
- [x] T024 [P] [US2] Redesign task-delete-dialog.tsx with modal animations in frontend/components/tasks/task-delete-dialog.tsx
- [x] T025 [P] [US2] Redesign empty-state.tsx with subtle animation in frontend/components/tasks/empty-state.tsx
- [x] T026 [US2] Verify all task animations complete within 300-500ms

**Checkpoint**: All task lifecycle operations have smooth GSAP animations

---

## Phase 5: User Story 3 - Responsive Glassmorphism Layout (Priority: P1)

**Goal**: Glassmorphism adapts elegantly across mobile, tablet, and desktop

**Independent Test**: Resize browser from 320px to 1440px+ and verify glassmorphism renders correctly

### Implementation for User Story 3

- [x] T027 [US3] Update (protected)/layout.tsx navigation with glassmorphism in frontend/app/(protected)/layout.tsx
- [x] T028 [US3] Add responsive blur intensity adjustments in frontend/styles/glassmorphism.css
- [x] T029 [P] [US3] Redesign dashboard page with responsive glassmorphism in frontend/app/(protected)/dashboard/page.tsx
- [x] T030 [P] [US3] Update (auth)/layout.tsx with centered glassmorphism layout in frontend/app/(auth)/layout.tsx
- [x] T031 [US3] Add max-width constraints and whitespace for desktop in frontend/app/globals.css
- [ ] T032 [US3] Verify responsive layout at 320px, 768px, 1024px, 1440px breakpoints

**Checkpoint**: Glassmorphism effects maintained across all device sizes

---

## Phase 6: User Story 4 - Enhanced Authentication Pages (Priority: P2)

**Goal**: Sign-in and sign-up pages match dashboard visual quality with form animations

**Independent Test**: Navigate to signin/signup, interact with forms, verify glassmorphism styling and animations

### Implementation for User Story 4

- [x] T033 [US4] Redesign signin page with glassmorphism form card in frontend/app/(auth)/signin/page.tsx
- [x] T034 [US4] Redesign signup page with matching glassmorphism in frontend/app/(auth)/signup/page.tsx
- [x] T035 [P] [US4] Update signin-form.tsx with animated inputs and focus states in frontend/components/auth/signin-form.tsx
- [x] T036 [P] [US4] Update signup-form.tsx with animated inputs and focus states in frontend/components/auth/signup-form.tsx
- [x] T037 [P] [US4] Update signout-button.tsx with hover animation in frontend/components/auth/signout-button.tsx
- [x] T038 [US4] Add loading state animations for form submission buttons
- [x] T039 [US4] Add error message entrance animations for validation feedback
- [ ] T040 [US4] Verify auth page visual consistency with dashboard

**Checkpoint**: Auth pages have premium glassmorphism styling matching dashboard

---

## Phase 7: User Story 5 - Micro-interactions and Polish (Priority: P2)

**Goal**: Small interaction details create cohesive, polished experience

**Independent Test**: Hover over all interactive elements and verify appropriate hover states and click feedback

### Implementation for User Story 5

- [x] T041 [US5] Add hover scale/glow effects to all buttons in frontend/components/ui/button.tsx
- [x] T042 [US5] Add hover elevation effect to all cards in frontend/components/ui/card.tsx
- [x] T043 [P] [US5] Add hover highlight to task items in frontend/components/tasks/task-item.tsx
- [x] T044 [P] [US5] Add loading spinner animation component in frontend/components/ui/loading-spinner.tsx
- [x] T045 [US5] Style empty state with refined typography and optional animation in frontend/components/tasks/empty-state.tsx
- [x] T046 [US5] Add navigation sticky behavior with glassmorphism in frontend/app/(protected)/layout.tsx
- [ ] T047 [US5] Verify all hover transitions complete in 200ms or less

**Checkpoint**: All interactive elements have polished micro-interactions

---

## Phase 8: User Story 6 - Dark Theme Consistency (Priority: P3)

**Goal**: Cohesive dark theme with consistent colors and WCAG AA contrast

**Independent Test**: Navigate through all pages and verify consistent dark colors and readable text contrast

### Implementation for User Story 6

- [ ] T048 [US6] Audit all components for consistent dark theme color usage
- [ ] T049 [US6] Verify text contrast ratios meet WCAG AA (4.5:1 normal, 3:1 large) using browser tools
- [ ] T050 [P] [US6] Update accent color consistency across buttons, links, and highlights
- [ ] T051 [P] [US6] Update semantic colors for success (completed tasks) and error states
- [ ] T052 [US6] Fix any visual inconsistencies found during audit
- [ ] T053 [US6] Document final color palette usage in comments

**Checkpoint**: Dark theme is fully consistent across all pages and meets accessibility standards

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, performance verification, and cross-browser testing

- [x] T054 Add graceful fallback for browsers without backdrop-filter support in frontend/styles/glassmorphism.css
- [x] T055 Add prefers-reduced-motion media query support in frontend/hooks/use-animation.ts
- [ ] T056 [P] Verify 60fps animation performance using Chrome DevTools Performance panel
- [ ] T057 [P] Cross-browser test in Chrome (verify glassmorphism + animations)
- [ ] T058 [P] Cross-browser test in Firefox (verify glassmorphism + animations)
- [ ] T059 [P] Cross-browser test in Safari (verify webkit-prefixed backdrop-filter)
- [ ] T060 [P] Cross-browser test in Edge (verify glassmorphism + animations)
- [ ] T061 Responsive test at 320px viewport (mobile)
- [ ] T062 Responsive test at 768px viewport (tablet)
- [ ] T063 Responsive test at 1440px viewport (desktop)
- [ ] T064 Verify Lighthouse performance score remains acceptable (<2s FCP)
- [ ] T065 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundational phase completion
  - US1, US2, US3 are P1 priority (complete first)
  - US4, US5 are P2 priority (complete after P1)
  - US6 is P3 priority (complete last)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Priority | Can Start After | Notes |
|-------|----------|-----------------|-------|
| US1 - Visual First Impression | P1 | Phase 2 | MVP - complete first |
| US2 - Task Animations | P1 | Phase 2 | Depends on redesigned task-item from US1 styling |
| US3 - Responsive Layout | P1 | Phase 2 | Can run parallel with US2 |
| US4 - Auth Pages | P2 | Phase 2 | Uses components from Foundational |
| US5 - Micro-interactions | P2 | Phase 2 | Enhances components from US1-US4 |
| US6 - Dark Theme Consistency | P3 | All P1/P2 stories | Audit requires components to exist |

### Within Each Phase

- Tasks marked [P] can run in parallel within the same phase
- Non-[P] tasks should run sequentially
- Verification tasks (T017, T026, T032, etc.) should run after implementation tasks

### Parallel Opportunities

**Phase 1**: T002, T003 can run in parallel

**Phase 2**: T008, T009, T010, T011 can run in parallel

**Phase 3 (US1)**: T015, T016 can run in parallel

**Phase 4 (US2)**: T023, T024, T025 can run in parallel

**Phase 5 (US3)**: T029, T030 can run in parallel

**Phase 6 (US4)**: T035, T036, T037 can run in parallel

**Phase 7 (US5)**: T043, T044 can run in parallel

**Phase 8 (US6)**: T050, T051 can run in parallel

**Phase 9**: T056, T057, T058, T059, T060 can all run in parallel

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch foundational UI components in parallel:
Task: "Create BackgroundOrbs component in frontend/components/ui/background-orbs.tsx"
Task: "Redesign Button component with glassmorphism in frontend/components/ui/button.tsx"
Task: "Redesign Card component with glassmorphism in frontend/components/ui/card.tsx"
Task: "Redesign Input component with focus animations in frontend/components/ui/input.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T012)
3. Complete Phase 3: User Story 1 (T013-T017)
4. **STOP and VALIDATE**: Verify homepage shows premium dark theme with glassmorphism
5. Demo to stakeholders if ready

### Incremental Delivery (Recommended)

1. **MVP**: Setup → Foundational → US1 (Premium Visual)
2. **+Animations**: Add US2 (Task Animations) → Demo task interactions
3. **+Responsive**: Add US3 (Responsive Layout) → Demo on multiple devices
4. **+Auth**: Add US4 (Auth Pages) → Demo full user flow
5. **+Polish**: Add US5 (Micro-interactions) → Demo attention to detail
6. **+Consistency**: Add US6 (Dark Theme) → Final audit
7. **Ship**: Complete Phase 9 (Polish) → Production ready

### Priority Execution Order

```
Phase 1 → Phase 2 → US1 → US2 → US3 → US4 → US5 → US6 → Phase 9
                    ↑      ↑      ↑
                   P1     P1     P1    (Complete all P1 first)
                                         ↑      ↑
                                        P2     P2    (Then P2)
                                                       ↑
                                                      P3  (Then P3)
```

---

## Task Summary

| Phase | User Story | Task Count | Parallel Tasks |
|-------|------------|------------|----------------|
| 1 | Setup | 6 | 2 |
| 2 | Foundational | 6 | 4 |
| 3 | US1 - Visual Impression | 5 | 2 |
| 4 | US2 - Task Animations | 9 | 3 |
| 5 | US3 - Responsive Layout | 6 | 2 |
| 6 | US4 - Auth Pages | 8 | 3 |
| 7 | US5 - Micro-interactions | 7 | 2 |
| 8 | US6 - Dark Theme | 6 | 2 |
| 9 | Polish | 12 | 5 |
| **Total** | | **65** | **25** |

---

## Notes

- All tasks are frontend-only (no backend changes)
- No automated tests requested - manual verification via quickstart.md
- GSAP animations should target 60fps performance
- Glassmorphism requires backdrop-filter browser support
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
