"""
Configuration module for the NASA Space Biology Backend API.
"""

import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from root .env file
root_env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
ai_env_path = os.path.join(os.path.dirname(__file__), "..", "ai", ".env")

# Try root .env first, then fallback to ai/.env
if os.path.exists(root_env_path):
    load_dotenv(root_env_path)
elif os.path.exists(ai_env_path):
    load_dotenv(ai_env_path)

class Settings:
    """Application settings."""
    
    # API Configuration
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    PROJECT_NAME: str = "NASA Space Biology AI API"
    VERSION: str = "1.0.0"
    
    # OpenAI Configuration (loaded from ai/.env)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    OPENAI_MAX_TOKENS: int = int(os.getenv("OPENAI_MAX_TOKENS", "4000"))
    OPENAI_TEMPERATURE: float = float(os.getenv("OPENAI_TEMPERATURE", "0.1"))
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",  # React dev server
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]
    
    # Data Configuration (loaded from centralized .env)
    DATA_DIR: str = os.getenv("DATA_DIR", "../ai/data")
    OUTPUT_DIR: str = os.getenv("OUTPUT_DIR", "../ai/output")
    CACHE_DIR: str = os.getenv("CACHE_DIR", "../ai/cache")
    
    # Processing Configuration (loaded from ai/.env)
    MAX_CONCURRENT_REQUESTS: int = int(os.getenv("MAX_CONCURRENT_REQUESTS", "5"))
    REQUEST_DELAY: float = float(os.getenv("REQUEST_DELAY", "1.0"))
    BATCH_SIZE: int = int(os.getenv("BATCH_SIZE", "10"))
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    def __init__(self):
        # Add any CORS origins from environment
        cors_origins = os.getenv("CORS_ORIGINS")
        if cors_origins:
            self.BACKEND_CORS_ORIGINS.extend(cors_origins.split(","))

# Global settings instance
settings = Settings()

# Validate required settings
def validate_settings() -> bool:
    """Validate that all required settings are present."""
    if not settings.OPENAI_API_KEY:
        print("ERROR: OPENAI_API_KEY environment variable is required")
        return False
    
    return True
