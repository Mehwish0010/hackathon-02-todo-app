from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # JWT Configuration
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"

    # CORS Configuration
    CORS_ORIGINS: str = '["http://localhost:3000"]'

    # Database (optional)
    DATABASE_URL: str = ""

    # OpenAI Configuration (Phase III-A)
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS as JSON list."""
        try:
            return json.loads(self.CORS_ORIGINS)
        except json.JSONDecodeError:
            return [self.CORS_ORIGINS]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
