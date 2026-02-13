# Quickstart: Authentication & User Identity Layer

**Feature**: 001-auth-identity-layer
**Date**: 2026-02-06

## Prerequisites

- Node.js 20+ (for frontend)
- Python 3.11+ (for backend)
- Neon PostgreSQL database (or local PostgreSQL)
- Git

## Environment Setup

### 1. Clone and Navigate

```bash
cd phase-2
```

### 2. Create Environment Files

**Frontend** (`frontend/.env`):
```bash
# Database (Neon PostgreSQL for Better Auth)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=your-better-auth-secret-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# JWT (shared with backend)
JWT_SECRET=your-jwt-secret-minimum-32-characters-long

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend** (`backend/.env`):
```bash
# JWT (must match frontend)
JWT_SECRET=your-jwt-secret-minimum-32-characters-long

# CORS
CORS_ORIGINS=http://localhost:3000

# Database (optional - for direct user queries)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

> **IMPORTANT**: Both `JWT_SECRET` values MUST be identical!

### 3. Generate Secrets

```bash
# Generate random secrets (use same value for both)
openssl rand -base64 32
```

## Frontend Setup

### 1. Create Next.js Project

```bash
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir=false
cd frontend
```

### 2. Install Dependencies

```bash
npm install better-auth @better-auth/react
```

### 3. Initialize Better Auth

Create `lib/auth.ts`:
```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    provider: "pg",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: "7d",
  },
});
```

### 4. Create Auth API Route

Create `app/api/auth/[...all]/route.ts`:
```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);
```

### 5. Start Frontend

```bash
npm run dev
# Runs on http://localhost:3000
```

## Backend Setup

### 1. Create Backend Project

```bash
mkdir -p backend/app/core backend/app/api/routes backend/app/schemas
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] sqlmodel
```

Or create `requirements.txt`:
```
fastapi>=0.109.0
uvicorn>=0.27.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
sqlmodel>=0.0.14
python-dotenv>=1.0.0
```

Then: `pip install -r requirements.txt`

### 4. Create Configuration

Create `app/core/config.py`:
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    JWT_SECRET: str
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"

settings = Settings()
```

### 5. Create Security Module

Create `app/core/security.py`:
```python
from jose import jwt, JWTError
from fastapi import HTTPException
from app.core.config import settings

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=["HS256"]
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
```

### 6. Create Dependencies

Create `app/core/dependencies.py`:
```python
from fastapi import Depends, HTTPException, Header
from app.core.security import verify_token
from app.schemas.auth import CurrentUser

async def get_current_user(
    authorization: str = Header(..., description="Bearer token")
) -> CurrentUser:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")

    token = authorization.split(" ")[1]
    payload = verify_token(token)

    return CurrentUser(
        id=payload.get("sub"),
        email=payload.get("email")
    )
```

### 7. Create Schemas

Create `app/schemas/auth.py`:
```python
from pydantic import BaseModel

class CurrentUser(BaseModel):
    id: str
    email: str
```

### 8. Create Main App

Create `app/main.py`:
```python
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.dependencies import get_current_user
from app.schemas.auth import CurrentUser

app = FastAPI(title="Task Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/api/v1/me")
async def get_me(current_user: CurrentUser = Depends(get_current_user)):
    return current_user
```

### 9. Start Backend

```bash
uvicorn app.main:app --reload --port 8000
# Runs on http://localhost:8000
```

## Verification

### 1. Test Health Endpoint (Public)

```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy"}
```

### 2. Test Protected Endpoint (Without Token)

```bash
curl http://localhost:8000/api/v1/me
# Expected: {"detail":"Authorization header required"}
```

### 3. Sign Up via Frontend

1. Navigate to `http://localhost:3000/signup`
2. Enter email and password
3. Note the JWT token returned

### 4. Test Protected Endpoint (With Token)

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8000/api/v1/me
# Expected: {"id":"usr_xxx","email":"user@example.com"}
```

## Common Issues

### JWT Secret Mismatch

**Symptom**: 401 error on all API requests
**Solution**: Ensure `JWT_SECRET` is identical in both `.env` files

### CORS Errors

**Symptom**: "Access-Control-Allow-Origin" errors in browser console
**Solution**: Verify `CORS_ORIGINS` includes frontend URL

### Database Connection

**Symptom**: Better Auth fails to create tables
**Solution**: Verify `DATABASE_URL` is correct and database is accessible

### Token Expiration

**Symptom**: Sudden 401 errors after working fine
**Solution**: Sign in again; JWT expires after 7 days

## Next Steps

After verification:
1. Run `/sp.tasks` to generate implementation tasks
2. Implement signup/signin UI components
3. Create protected route middleware
4. Build API client with automatic token injection
