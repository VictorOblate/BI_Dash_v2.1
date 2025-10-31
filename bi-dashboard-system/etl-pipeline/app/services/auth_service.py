"""
Authentication Service
etl-pipeline/app/services/auth_service.py
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from typing import Optional

from ..models.user import User
from ..schemas.user import UserCreate, UserLogin, TokenResponse
from ..utils.security import hash_password, verify_password, create_access_token
from ..utils.audit import log_audit


class AuthService:
    """Authentication service for user management"""
    
    @staticmethod
    def register_user(db: Session, user_data: UserCreate) -> User:
        """Register a new user"""
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = hash_password(user_data.password)
        new_user = User(
            email=user_data.email,
            password_hash=hashed_password,
            full_name=user_data.full_name,
            status="pending"  # Requires admin approval
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Log audit
        log_audit(
            db=db,
            user_id=None,
            action="register",
            resource="user",
            resource_id=new_user.id,
            details={"email": new_user.email}
        )
        
        return new_user
    
    @staticmethod
    def login(db: Session, credentials: UserLogin, ip_address: str = None) -> TokenResponse:
        """Authenticate user and return token"""
        # Find user
        user = db.query(User).filter(User.email == credentials.email).first()
        
        if not user or not verify_password(credentials.password, user.password_hash):
            log_audit(
                db=db,
                user_id=user.id if user else None,
                action="login",
                resource="user",
                details={"email": credentials.email},
                ip_address=ip_address,
                status="failed"
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Check if user is active
        if user.status != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account is {user.status}. Please contact administrator."
            )
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        
        # Create access token
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        
        # Log successful login
        log_audit(
            db=db,
            user_id=user.id,
            action="login",
            resource="user",
            details={"email": user.email},
            ip_address=ip_address,
            status="success"
        )
        
        from ..schemas.user import UserResponse
        return TokenResponse(
            access_token=access_token,
            user=UserResponse.model_validate(user)
        )
    
    @staticmethod
    def get_current_user(db: Session, token: str) -> User:
        """Get current user from token"""
        from ..utils.security import decode_token
        
        payload = decode_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if user.status != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is not active"
            )
        
        return user