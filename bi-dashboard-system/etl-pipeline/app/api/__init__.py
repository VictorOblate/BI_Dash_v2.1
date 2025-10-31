"""
API Routes Package
etl-pipeline/app/api/__init__.py
"""
from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router
from .data_models import router as data_models_router
from .uploads import router as uploads_router

api_router = APIRouter()

# Include all routers
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(data_models_router, prefix="/data-models", tags=["Data Models"])
api_router.include_router(uploads_router, prefix="/uploads", tags=["Uploads"])

__all__ = ["api_router"]