"""
Application Configuration
etl-pipeline/app/config.py
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # Application
    APP_NAME: str = "BI ETL Pipeline"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    SECRET_KEY: str = "change-this-secret-key"
    
    # Database
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/bi_dashboard"
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = "password"
    DB_NAME: str = "bi_dashboard"
    
    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    # Store raw value as string so pydantic doesn't attempt to parse non-JSON
    # env values like "http://a,http://b". Use the `cors_origins` property to
    # access the parsed list.
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    @property
    def cors_origins(self) -> List[str]:
        """Return CORS origins as a list.

        Supports either a JSON list in the environment (e.g. '["https://a","https://b"]')
        or a comma-separated string (e.g. 'https://a,https://b').
        """
        raw = os.getenv("CORS_ORIGINS", self.CORS_ORIGINS)
        if not raw:
            return []

        # Try JSON first
        try:
            import json

            parsed = json.loads(raw)
            if isinstance(parsed, (list, tuple)):
                return [str(x).strip() for x in parsed if str(x).strip()]
        except Exception:
            pass

        # Fallback to comma-separated parsing
        return [x.strip() for x in raw.split(",") if x.strip()]
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 52428800  # 50MB
    # Keep as comma-separated string in env; use `allowed_extensions` to get list
    ALLOWED_EXTENSIONS: str = "xlsx,xls,csv"
    
    @property
    def allowed_extensions(self) -> List[str]:
        raw = os.getenv("ALLOWED_EXTENSIONS", self.ALLOWED_EXTENSIONS)
        return [x.strip().lower() for x in raw.split(",") if x.strip()]
    UPLOAD_DIR: str = "./uploads"
    
    # JWT
    JWT_SECRET_KEY: str = "change-this-jwt-secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Initialize settings
settings = Settings()

# Create upload directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)