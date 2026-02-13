from sqlmodel import Session, SQLModel, create_engine
from app.core.config import settings


# Connection pool settings for Neon serverless PostgreSQL
# - pool_pre_ping: Check connection health before using
# - pool_recycle: Recycle connections after 300 seconds to avoid SSL timeouts
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=300,
)


def get_db():
    """
    FastAPI dependency that provides a database session.

    Yields:
        Session: SQLModel database session
    """
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    """Create all database tables defined by SQLModel models."""
    SQLModel.metadata.create_all(engine)
