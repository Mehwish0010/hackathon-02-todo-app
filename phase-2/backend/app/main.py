from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime

from app.core.config import settings
from app.core.database import create_db_and_tables

# Import models to ensure tables are created (Phase III-A)
from app.models import Task, Conversation, Message  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup: create database tables
    create_db_and_tables()
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title="Todo App API",
    description="Multi-user Task Management API with JWT Authentication",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for database and unexpected errors."""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


@app.get("/health", tags=["Health"])
async def health_check():
    """Public health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
    }


# Import and include routers after app is created to avoid circular imports
from app.api.routes import auth as auth_router
from app.api.routes import tasks as tasks_router
from app.api.routes import chat as chat_router

app.include_router(auth_router.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(tasks_router.router, prefix="/api/v1", tags=["Tasks"])
app.include_router(chat_router.router, prefix="/api", tags=["Chat"])
