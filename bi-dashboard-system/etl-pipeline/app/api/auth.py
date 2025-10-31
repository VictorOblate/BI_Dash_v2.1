"""
Authentication API Routes
etl-pipeline/app/api/auth.py
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse
from ..services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user
    Status will be 'pending' until approved by admin
    """
    user = AuthService.register_user(db, user_data)
    return user


@router.post("/login", response_model=TokenResponse)
def login(
    credentials: UserLogin,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return access token
    """
    ip_address = request.client.host if request.client else None
    return AuthService.login(db, credentials, ip_address)


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user = Depends(get_current_user)
):
    """
    Get current user information
    """
    return current_user


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Refresh access token
    """
    from ..utils.security import create_access_token
    
    access_token = create_access_token(
        data={"sub": str(current_user.id), "email": current_user.email}
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(current_user)
    )


# Import dependency
from .dependencies import get_current_user