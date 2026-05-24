"""
CAEOS Configuration | إعدادات النظام

All settings loaded from environment variables with sensible defaults.
Law 10: Human Approval Overrides → but sensible defaults reduce cognitive load.
"""

import os
from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "CAEOS"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://postgres:postgres@localhost:5432/caeos"
    )

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "caeos-secret-change-me-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://caeos.vercel.app",
    ]

    # LangSmith / LangChain
    LANGSMITH_API_KEY: str = os.getenv("LANGSMITH_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")

    # Constitutional Enforcement
    CONSTITUTION_ENFORCED: bool = True
    REQUIRES_RATIFICATION: bool = True
    AUTO_PILOT_WARNING: bool = True

    # Cognitive Controller
    MAX_DECISIONS_PER_HOUR: int = 5
    SESSION_TIMEOUT_MINUTES: int = 30
    CHECKPOINT_FREQUENCY: int = 5

    # Economic Engine
    TOKEN_BUDGET_AWARENESS: bool = True
    SHOW_COST_PER_PHASE: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
