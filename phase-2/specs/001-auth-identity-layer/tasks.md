# Tasks: Authentication & User Identity Layer

**Input**: Design documents from `/specs/001-auth-identity-layer/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/app/`, `frontend/app/`
- Paths based on plan.md structure

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize project structure, dependencies, and environment configuration

- [x] T001 Create `frontend/` directory and initialize Next.js 16+ project with App Router and TypeScript
- [x] T002 Create `backend/` directory with FastAPI project structure: `app/`, `app/core/`, `app/api/`, `app/api/routes/`, `app/models/`, `app/schemas/`
- [x] T003 [P] Create `frontend/.env.example` with DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, JWT_SECRET, NEXT_PUBLIC_API_URL
- [x] T004 [P] Create `backend/.env.example` with JWT_SECRET, CORS_ORIGINS, DATABASE_URL
- [x] T005 [P] Create root `.gitignore` excluding `.env`, `node_modules/`, `__pycache__/`, `.venv/`, `.next/`
- [x] T006 Create `backend/requirements.txt` with fastapi, uvicorn, python-jose[cryptography], passlib[bcrypt], sqlmodel, python-dotenv, httpx

**Checkpoint**: Project skeletons ready with environment templates ✅

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Install Better Auth dependencies in frontend: `npm install better-auth @better-auth/react`
- [x] T008 Create `frontend/lib/auth.ts` with Better Auth server configuration (database, emailAndPassword, jwt plugin)
- [x] T009 Create `frontend/app/api/auth/[...all]/route.ts` with Better Auth handler export
- [x] T010 Create `frontend/lib/auth-client.ts` with createAuthClient and useSession hook export
- [x] T011 [P] Create `backend/app/core/config.py` with Settings class loading JWT_SECRET and CORS_ORIGINS from environment
- [x] T012 [P] Create `backend/app/core/security.py` with verify_token function using python-jose HS256 decoding
- [x] T013 Create `backend/app/schemas/auth.py` with TokenPayload and CurrentUser Pydantic models
- [x] T014 Create `backend/app/core/dependencies.py` with get_current_user FastAPI dependency extracting Bearer token
- [x] T015 Create `backend/app/main.py` with FastAPI app, CORS middleware, and health endpoint

**Checkpoint**: Foundation ready - Better Auth configured, JWT verification implemented ✅

---

## Phase 3: User Story 1 - User Registration (Priority: P1)

**Goal**: Allow new users to create accounts with email and password

**Independent Test**: Complete signup form, verify user created and JWT token issued

### Implementation for User Story 1

- [x] T016 [P] [US1] Create `frontend/components/auth/signup-form.tsx` with email/password fields, min 8 char validation, error display
- [x] T017 [P] [US1] Create `frontend/components/ui/input.tsx` reusable input component with error state
- [x] T018 [P] [US1] Create `frontend/components/ui/button.tsx` reusable button component with loading state
- [x] T019 [US1] Create `frontend/app/(auth)/layout.tsx` with centered layout for auth pages (no navigation)
- [x] T020 [US1] Create `frontend/app/(auth)/signup/page.tsx` importing SignupForm, linking to signin page
- [x] T021 [US1] Implement signup form submission using Better Auth signUp.email method in signup-form.tsx
- [x] T022 [US1] Add client-side validation: email format regex, password length >= 8 characters
- [x] T023 [US1] Handle signup errors: display "Email already in use" for 409, validation errors for 400

**Checkpoint**: User Story 1 complete - Users can register new accounts ✅

---

## Phase 4: User Story 2 - User Sign In (Priority: P1)

**Goal**: Allow registered users to sign in and receive JWT token

**Independent Test**: Sign in with valid credentials, verify JWT token returned

### Implementation for User Story 2

- [x] T024 [P] [US2] Create `frontend/components/auth/signin-form.tsx` with email/password fields, error display
- [x] T025 [US2] Create `frontend/app/(auth)/signin/page.tsx` importing SigninForm, linking to signup page
- [x] T026 [US2] Implement signin form submission using Better Auth signIn.email method
- [x] T027 [US2] Handle signin errors: display generic "Invalid credentials" message (prevent user enumeration)
- [x] T028 [US2] Add redirect to dashboard/home after successful signin using Next.js router

**Checkpoint**: User Story 2 complete - Users can sign in and receive tokens ✅

---

## Phase 5: User Story 3 - Authenticated API Access (Priority: P1)

**Goal**: Backend verifies JWT on every protected request, rejects invalid tokens with 401

**Independent Test**: API request with valid token succeeds, without token returns 401

### Implementation for User Story 3

- [x] T029 [P] [US3] Create `frontend/lib/api-client.ts` with fetch wrapper that auto-attaches Authorization header
- [x] T030 [US3] Implement getToken function in api-client.ts to retrieve JWT from Better Auth session
- [x] T031 [US3] Implement 401 response handler in api-client.ts that redirects to signin page
- [x] T032 [US3] Create `backend/app/api/routes/auth.py` with GET /api/v1/me endpoint using get_current_user dependency
- [x] T033 [US3] Register auth router in backend/app/main.py under /api/v1 prefix
- [x] T034 [US3] Update get_current_user to return 401 with "Authorization header required" when header missing
- [x] T035 [US3] Update verify_token to return 401 with "Invalid or expired token" for JWTError exceptions

**Checkpoint**: User Story 3 complete - Backend validates all tokens, 401 for invalid ✅

---

## Phase 6: User Story 4 - User Identity Extraction (Priority: P2)

**Goal**: Extract user ID and email from JWT, make available to API handlers, verify URL user_id matches

**Independent Test**: Authenticated request returns correct user_id, mismatched URL returns 403

### Implementation for User Story 4

- [x] T036 [P] [US4] Update CurrentUser schema in backend/app/schemas/auth.py to include id and email fields
- [x] T037 [US4] Update get_current_user in backend/app/core/dependencies.py to extract sub and email from token payload
- [x] T038 [US4] Create verify_user_access dependency in backend/app/core/dependencies.py comparing URL user_id to token user_id
- [x] T039 [US4] Add GET /api/v1/users/{user_id}/verify endpoint in backend/app/api/routes/auth.py using verify_user_access
- [x] T040 [US4] Return 403 "Access denied" when URL user_id does not match token user_id

**Checkpoint**: User Story 4 complete - User identity available, ownership verified ✅

---

## Phase 7: User Story 5 - User Sign Out (Priority: P3)

**Goal**: Allow users to sign out, clearing token from frontend

**Independent Test**: Click signout, subsequent API requests fail with 401

### Implementation for User Story 5

- [x] T041 [P] [US5] Create `frontend/components/auth/signout-button.tsx` with onClick calling Better Auth signOut
- [x] T042 [US5] Implement signout handler that clears session and redirects to signin page
- [x] T043 [US5] Create `frontend/middleware.ts` for route protection checking session state
- [x] T044 [US5] Configure middleware matcher for protected routes: /dashboard/*, /tasks/*
- [x] T045 [US5] Create `frontend/app/(protected)/layout.tsx` that requires authentication, shows signout button

**Checkpoint**: User Story 5 complete - Users can explicitly sign out ✅

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Integration verification, error handling, and final touches

- [x] T046 [P] Add loading states to signup-form.tsx and signin-form.tsx during submission
- [x] T047 [P] Add network error handling in api-client.ts with user-friendly error messages
- [x] T048 [P] Create `frontend/app/page.tsx` home page with links to signin/signup for unauthenticated users
- [x] T049 [P] Add email normalization (lowercase) in signup-form.tsx before submission
- [x] T050 Verify end-to-end flow: signup → signin → API call → signout → API call fails
- [x] T051 Update `frontend/app/layout.tsx` with proper metadata and global styles
- [x] T052 Create `frontend/app/(protected)/dashboard/page.tsx` placeholder showing current user info

**Checkpoint**: All polish tasks complete ✅

---

## Implementation Complete

All 52 tasks have been completed successfully.

### Summary

| Phase | Status | Tasks |
|-------|--------|-------|
| Phase 1: Setup | ✅ Complete | 6/6 |
| Phase 2: Foundational | ✅ Complete | 9/9 |
| Phase 3: US1 Registration | ✅ Complete | 8/8 |
| Phase 4: US2 Sign In | ✅ Complete | 5/5 |
| Phase 5: US3 API Access | ✅ Complete | 7/7 |
| Phase 6: US4 Identity | ✅ Complete | 5/5 |
| Phase 7: US5 Sign Out | ✅ Complete | 5/5 |
| Phase 8: Polish | ✅ Complete | 7/7 |
| **Total** | ✅ **52/52** | 100% |

### Files Created

**Frontend (16 files)**:
- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/next.config.js`
- `frontend/tailwind.config.js`
- `frontend/postcss.config.js`
- `frontend/.env.example`
- `frontend/lib/auth.ts`
- `frontend/lib/auth-client.ts`
- `frontend/lib/api-client.ts`
- `frontend/app/api/auth/[...all]/route.ts`
- `frontend/app/layout.tsx`
- `frontend/app/globals.css`
- `frontend/app/page.tsx`
- `frontend/app/(auth)/layout.tsx`
- `frontend/app/(auth)/signup/page.tsx`
- `frontend/app/(auth)/signin/page.tsx`
- `frontend/app/(protected)/layout.tsx`
- `frontend/app/(protected)/dashboard/page.tsx`
- `frontend/components/ui/input.tsx`
- `frontend/components/ui/button.tsx`
- `frontend/components/auth/signup-form.tsx`
- `frontend/components/auth/signin-form.tsx`
- `frontend/components/auth/signout-button.tsx`
- `frontend/middleware.ts`

**Backend (10 files)**:
- `backend/requirements.txt`
- `backend/.env.example`
- `backend/app/__init__.py`
- `backend/app/main.py`
- `backend/app/core/__init__.py`
- `backend/app/core/config.py`
- `backend/app/core/security.py`
- `backend/app/core/dependencies.py`
- `backend/app/api/__init__.py`
- `backend/app/api/routes/__init__.py`
- `backend/app/api/routes/auth.py`
- `backend/app/schemas/__init__.py`
- `backend/app/schemas/auth.py`

### Handoff Ready

The authentication layer is complete and ready for Spec 2 (Backend Task API) integration.
