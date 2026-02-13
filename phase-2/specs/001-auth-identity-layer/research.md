# Research: Authentication & User Identity Layer

**Feature**: 001-auth-identity-layer
**Date**: 2026-02-06
**Status**: Complete

## Research Questions

### RQ-1: Better Auth JWT Configuration

**Question**: How does Better Auth issue JWT tokens that can be verified by a Python backend?

**Decision**: Use Better Auth's built-in JWT plugin with HS256 algorithm and shared secret

**Rationale**:
- Better Auth supports JWT plugin that issues tokens on authentication
- HS256 (HMAC-SHA256) uses symmetric key, allowing same secret on both ends
- Token payload includes `sub` (subject/user ID), `email`, `iat`, and `exp` claims
- python-jose library can verify HS256 tokens with the same secret

**Alternatives Considered**:
| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| RS256 (asymmetric) | More secure key distribution | Requires public/private key pair management | Adds complexity; shared secret sufficient for single backend |
| Session cookies only | Simpler for same-origin | Cannot work with separate backend domain | Backend is separate service |
| Custom JWT implementation | Full control | Reinventing the wheel | Better Auth already provides this |

**Configuration**:
```typescript
// Better Auth JWT plugin config
jwt: {
  secret: process.env.JWT_SECRET,
  expiresIn: "7d",  // 7 days
}
```

---

### RQ-2: JWT Token Storage on Frontend

**Question**: Where should the JWT token be stored on the frontend?

**Decision**: Use Better Auth's built-in session management (httpOnly cookies for session, token available via API)

**Rationale**:
- Better Auth manages session state automatically
- Token accessible via `auth.getSession()` for API calls
- Avoids localStorage/sessionStorage XSS vulnerabilities
- httpOnly cookies protect session from JavaScript access

**Alternatives Considered**:
| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| localStorage | Persistent across tabs | XSS vulnerable | Security risk |
| sessionStorage | Tab-isolated | Lost on tab close | Poor UX |
| Memory only | Most secure | Lost on refresh | Terrible UX |
| httpOnly cookie | Secure, automatic | Requires same-origin or CORS config | Better Auth handles this |

---

### RQ-3: FastAPI JWT Verification Pattern

**Question**: What's the best pattern for JWT verification in FastAPI?

**Decision**: Use FastAPI dependency injection with a `get_current_user` dependency

**Rationale**:
- Dependency injection is FastAPI's recommended pattern
- Reusable across all protected routes
- Clear separation of concerns
- Automatic OpenAPI documentation generation

**Implementation Pattern**:
```python
from fastapi import Depends, HTTPException, Header
from jose import jwt, JWTError

async def get_current_user(authorization: str = Header(...)) -> CurrentUser:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return CurrentUser(id=payload["sub"], email=payload["email"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
```

**Alternatives Considered**:
| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Middleware | Runs on all routes | Can't easily exclude public routes | Less flexible |
| Decorator | Explicit per-route | Non-standard FastAPI pattern | Dependencies are idiomatic |
| Background task | Async verification | Complicates request flow | Overkill for simple verification |

---

### RQ-4: Better Auth + FastAPI Token Format Compatibility

**Question**: Is Better Auth's JWT format compatible with python-jose?

**Decision**: Yes, fully compatible when using HS256 algorithm

**Rationale**:
- Better Auth JWT plugin produces standard RFC 7519 compliant tokens
- Token structure: `header.payload.signature` (base64url encoded)
- Standard claims: `sub`, `iat`, `exp`, `email`
- python-jose fully supports HS256 verification

**Token Payload Structure** (from Better Auth):
```json
{
  "sub": "user_abc123",
  "email": "user@example.com",
  "iat": 1707264000,
  "exp": 1707868800
}
```

**Verification Code**:
```python
from jose import jwt
payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
# payload["sub"] = user ID
# payload["email"] = user email
```

---

### RQ-5: Environment Variable Strategy

**Question**: How to securely share JWT secret between frontend and backend?

**Decision**: Use environment variables with `.env` files (excluded from git)

**Rationale**:
- Industry standard for secrets management
- Works with Docker, Vercel, Railway, etc.
- `.env.example` documents required variables
- Fail-fast validation on application startup

**Environment Variables**:
```bash
# .env (both frontend and backend)
JWT_SECRET=your-secure-random-secret-minimum-32-characters

# Frontend additional
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend additional
DATABASE_URL=postgresql://user:pass@host/db
CORS_ORIGINS=http://localhost:3000
```

**Security Rules**:
1. Never commit `.env` files
2. Use different secrets per environment (dev/staging/prod)
3. Minimum 32 characters for JWT secret
4. Rotate secrets periodically

---

### RQ-6: Error Response Standardization

**Question**: What error response format should be used for auth failures?

**Decision**: Use consistent JSON error format with appropriate HTTP status codes

**Rationale**:
- Predictable error handling on frontend
- Standard HTTP semantics
- No information leakage (same error for wrong email vs wrong password)

**Error Response Format**:
```json
{
  "detail": "Invalid credentials"
}
```

**Status Code Mapping**:
| Scenario | Status | Detail Message |
|----------|--------|----------------|
| No Authorization header | 401 | "Authorization header required" |
| Invalid token format | 401 | "Invalid token format" |
| Token signature invalid | 401 | "Invalid or expired token" |
| Token expired | 401 | "Invalid or expired token" |
| Valid token, wrong user | 403 | "Access denied" |
| Wrong email or password | 401 | "Invalid credentials" |

---

### RQ-7: Next.js Middleware for Route Protection

**Question**: How to protect routes in Next.js App Router?

**Decision**: Use Next.js middleware with Better Auth session check

**Rationale**:
- Middleware runs before page render
- Can redirect unauthenticated users server-side
- No flash of protected content
- Works with App Router

**Protected Routes Pattern**:
```typescript
// middleware.ts
export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*']
}

export default async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
  return NextResponse.next()
}
```

---

## Summary of Decisions

| Area | Decision | Key Technology |
|------|----------|----------------|
| JWT Algorithm | HS256 (symmetric) | Better Auth JWT plugin |
| Token Storage | Better Auth session management | httpOnly cookies |
| Backend Auth | Dependency injection | FastAPI + python-jose |
| Secret Sharing | Environment variables | .env files |
| Error Format | JSON with standard HTTP codes | 401/403 responses |
| Route Protection | Next.js middleware | Better Auth session check |

## Dependencies Confirmed

### Frontend
- `better-auth`: ^1.0.0
- `@better-auth/react`: ^1.0.0

### Backend
- `python-jose[cryptography]`: ^3.3.0
- `passlib[bcrypt]`: ^1.7.4
- `fastapi`: ^0.109.0
- `sqlmodel`: ^0.0.14

## Next Steps

1. Proceed to data-model.md for entity definitions
2. Create API contracts in contracts/
3. Generate tasks.md for implementation
