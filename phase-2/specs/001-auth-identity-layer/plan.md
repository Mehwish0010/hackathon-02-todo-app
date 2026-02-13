# Implementation Plan: Authentication & User Identity Layer

**Branch**: `001-auth-identity-layer` | **Date**: 2026-02-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-auth-identity-layer/spec.md`

## Summary

Implement a complete, secure authentication flow that establishes trusted user identity across a Next.js 16+ frontend and Python FastAPI backend using Better Auth and JWTs. The system enables user registration, sign-in, and stateless token-based authorization without any backend session storage.

**Primary Requirements**:
- User signup/signin via Better Auth on Next.js frontend
- JWT token issuance upon successful authentication
- Stateless JWT verification on FastAPI backend
- User identity extraction and propagation to API handlers

**Technical Approach**:
- Better Auth handles authentication logic and JWT generation on frontend
- Shared JWT secret via environment variables enables backend verification
- FastAPI dependency injection pattern for authentication middleware
- No database lookups for token validation (stateless)

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5.x on Node.js 20+
- Backend: Python 3.11+

**Primary Dependencies**:
- Frontend: Next.js 16+, Better Auth, better-auth/react
- Backend: FastAPI, python-jose[cryptography], passlib[bcrypt], SQLModel

**Storage**: Neon Serverless PostgreSQL (for user records only; tokens are stateless)

**Testing**:
- Frontend: Jest/Vitest for unit tests
- Backend: pytest with httpx for API tests

**Target Platform**: Web (Linux server deployment, all modern browsers)

**Project Type**: Web application (frontend + backend)

**Performance Goals**:
- Authentication response < 2 seconds
- Token verification < 50ms per request

**Constraints**:
- JWT is sole authorization mechanism (no session storage)
- Shared secret via environment variables only
- No manual coding; all generated via agent prompts

**Scale/Scope**: Multi-user application, ~1000 concurrent users initial target

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Spec-Driven Development | ✅ PASS | Spec exists at `spec.md`, plan being created before tasks |
| II. Security-First Architecture | ✅ PASS | JWT validation on every request, 401 for invalid tokens |
| III. User Data Isolation | ✅ PASS | Token user_id verified against URL user_id, 403 on mismatch |
| IV. Fixed Technology Stack | ✅ PASS | Using Next.js 16+, FastAPI, SQLModel, Neon, Better Auth |
| V. RESTful API Standards | ✅ PASS | Standard HTTP status codes (200, 201, 401, 403) |
| VI. Responsive Frontend Design | ✅ PASS | Auth forms will be responsive, protected routes enforced |

**Gate Result**: PASS - All constitution principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-auth-identity-layer/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - entity definitions
├── quickstart.md        # Phase 1 output - setup guide
├── contracts/           # Phase 1 output - API contracts
│   └── auth-api.yaml    # OpenAPI specification
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── (auth)/
│   │   ├── signin/
│   │   │   └── page.tsx        # Sign in page
│   │   ├── signup/
│   │   │   └── page.tsx        # Sign up page
│   │   └── layout.tsx          # Auth layout (no nav)
│   ├── (protected)/
│   │   └── layout.tsx          # Protected layout (requires auth)
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts    # Better Auth API routes
│   └── layout.tsx              # Root layout
├── lib/
│   ├── auth.ts                 # Better Auth configuration
│   ├── auth-client.ts          # Client-side auth utilities
│   └── api-client.ts           # API client with JWT injection
├── components/
│   ├── auth/
│   │   ├── signin-form.tsx     # Sign in form component
│   │   ├── signup-form.tsx     # Sign up form component
│   │   └── signout-button.tsx  # Sign out button
│   └── ui/                     # Shared UI components
├── middleware.ts               # Next.js middleware for route protection
└── package.json

backend/
├── app/
│   ├── main.py                 # FastAPI application entry
│   ├── core/
│   │   ├── config.py           # Configuration and settings
│   │   ├── security.py         # JWT verification utilities
│   │   └── dependencies.py     # FastAPI dependencies
│   ├── api/
│   │   ├── routes/
│   │   │   └── health.py       # Health check endpoint
│   │   └── deps.py             # Shared API dependencies
│   ├── models/
│   │   └── user.py             # User SQLModel
│   └── schemas/
│       └── auth.py             # Auth request/response schemas
├── tests/
│   ├── conftest.py             # Test fixtures
│   └── test_auth.py            # Authentication tests
└── requirements.txt
```

**Structure Decision**: Web application structure with separate `frontend/` and `backend/` directories. Frontend handles authentication via Better Auth; backend validates JWTs and provides protected API endpoints.

## Implementation Phases

### Phase 1: Environment & Project Setup

**Purpose**: Initialize project structure and configure shared secrets

**Steps**:
1. Create `frontend/` directory with Next.js 16+ App Router project
2. Create `backend/` directory with FastAPI project structure
3. Create `.env.example` files for both projects
4. Define `JWT_SECRET` environment variable (minimum 32 characters)
5. Configure `.gitignore` to exclude `.env` files

**Inputs**: Constitution technology stack requirements
**Outputs**: Empty project skeletons with environment configuration

### Phase 2: Frontend Authentication Setup (Better Auth)

**Purpose**: Initialize Better Auth with credential-based authentication and JWT plugin

**Steps**:
1. Install Better Auth dependencies (`better-auth`, `@better-auth/react`)
2. Create `lib/auth.ts` with Better Auth server configuration
3. Configure credential provider (email/password)
4. Enable JWT plugin to issue signed tokens
5. Create API route handler at `app/api/auth/[...all]/route.ts`
6. Create `lib/auth-client.ts` for client-side auth hooks

**Inputs**: JWT_SECRET from environment, Better Auth documentation
**Outputs**: Working Better Auth setup that can issue JWTs

### Phase 3: Frontend Auth UI Components

**Purpose**: Build signup, signin, and signout UI components

**Steps**:
1. Create `components/auth/signup-form.tsx` with email/password validation
2. Create `components/auth/signin-form.tsx` with error handling
3. Create `components/auth/signout-button.tsx`
4. Create `app/(auth)/signup/page.tsx` signup page
5. Create `app/(auth)/signin/page.tsx` signin page
6. Create `app/(auth)/layout.tsx` for unauthenticated layout

**Inputs**: Better Auth client hooks, form validation requirements
**Outputs**: Functional auth UI with client-side validation

### Phase 4: Frontend Route Protection

**Purpose**: Protect routes and handle unauthenticated access

**Steps**:
1. Create `middleware.ts` for route protection
2. Configure protected route patterns (e.g., `/dashboard/*`, `/tasks/*`)
3. Redirect unauthenticated users to `/signin`
4. Create `app/(protected)/layout.tsx` that requires authentication

**Inputs**: Better Auth session state, protected route list
**Outputs**: Automatic redirect for unauthenticated access

### Phase 5: Frontend API Client

**Purpose**: Create API client that automatically attaches JWT to requests

**Steps**:
1. Create `lib/api-client.ts` with fetch wrapper
2. Implement automatic `Authorization: Bearer <token>` header injection
3. Handle 401 responses with redirect to signin
4. Handle network errors gracefully

**Inputs**: Better Auth token access, backend API URL
**Outputs**: Reusable API client for all protected endpoints

### Phase 6: Backend JWT Verification Layer

**Purpose**: Implement FastAPI middleware/dependency for JWT verification

**Steps**:
1. Install dependencies (`python-jose[cryptography]`, `passlib[bcrypt]`)
2. Create `core/config.py` with JWT_SECRET from environment
3. Create `core/security.py` with JWT decode/verify functions
4. Create `core/dependencies.py` with `get_current_user` dependency
5. Implement token extraction from `Authorization` header
6. Implement signature verification and expiration check
7. Return 401 for missing/invalid/expired tokens

**Inputs**: JWT_SECRET (same as frontend), JWT token format from Better Auth
**Outputs**: Reusable FastAPI dependency for protected routes

### Phase 7: Backend User Identity Extraction

**Purpose**: Extract and provide user context to API handlers

**Steps**:
1. Create `schemas/auth.py` with `TokenPayload` and `CurrentUser` schemas
2. Extract `sub` (user_id) and `email` from verified token payload
3. Create `CurrentUser` object available via dependency injection
4. Create `verify_user_access` dependency for URL user_id matching
5. Return 403 when URL user_id doesn't match token user_id

**Inputs**: Verified JWT token payload
**Outputs**: User context available in all protected route handlers

### Phase 8: Backend Health & Test Endpoints

**Purpose**: Create testable endpoints to verify auth flow

**Steps**:
1. Create `api/routes/health.py` with public health check
2. Create protected test endpoint that returns current user info
3. Verify 401 returned for requests without token
4. Verify 200 returned with user info for valid token

**Inputs**: Auth dependencies from Phase 6-7
**Outputs**: Verifiable auth flow endpoints

### Phase 9: Integration Testing

**Purpose**: Verify end-to-end authentication flow

**Steps**:
1. Test signup creates user and returns JWT
2. Test signin with valid credentials returns JWT
3. Test signin with invalid credentials returns error
4. Test API request with valid token succeeds
5. Test API request without token returns 401
6. Test API request with expired token returns 401
7. Test signout clears token and subsequent requests fail

**Inputs**: All components from Phases 1-8
**Outputs**: Verified end-to-end authentication flow

## Handoff Points

### Handoff to Spec 2 (Backend Task API)

The authentication layer provides:

1. **`get_current_user` dependency** - Inject into any route to require authentication
   ```python
   @router.get("/tasks")
   async def get_tasks(current_user: CurrentUser = Depends(get_current_user)):
       # current_user.id and current_user.email available
   ```

2. **`verify_user_access` dependency** - Verify URL user matches token user
   ```python
   @router.get("/users/{user_id}/tasks")
   async def get_user_tasks(
       user_id: str,
       current_user: CurrentUser = Depends(verify_user_access)
   ):
       # Automatically returns 403 if user_id != current_user.id
   ```

3. **Standard error responses**:
   - 401 Unauthorized: Missing, invalid, or expired token
   - 403 Forbidden: Valid token but unauthorized resource access

4. **Frontend API client**: Automatically attaches JWT to all requests

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| JWT secret mismatch between frontend/backend | Auth completely broken | Single `.env` source, validation on startup |
| Better Auth JWT format incompatible with python-jose | Token verification fails | Research phase validates compatibility |
| Token expiration too short for UX | Frequent re-authentication | 7-day default, clear error messages |
| Environment variable not set in production | Auth fails silently | Startup validation, fail-fast approach |

## Complexity Tracking

No constitution violations requiring justification. Implementation follows all principles.

## Next Steps

1. Run `/sp.tasks` to generate task breakdown
2. Execute tasks via `/sp.implement`
3. Create Spec 2 for Backend Task API after auth layer complete
