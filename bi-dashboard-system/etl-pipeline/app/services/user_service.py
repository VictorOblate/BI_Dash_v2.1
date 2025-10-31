"""
User Service
etl-pipeline/app/services/user_service.py
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional

from ..models.user import User
from ..schemas.user import UserUpdate, UserResponse
from ..utils.audit import log_audit


class UserService:
    """User management service"""
    
    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users"""
        return db.query(User).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User:
        """Get user by ID"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    
    @staticmethod
    def get_pending_users(db: Session) -> List[User]:
        """Get users pending approval"""
        return db.query(User).filter(User.status == "pending").all()
    
    @staticmethod
    def update_user(
        db: Session,
        user_id: int,
        user_update: UserUpdate,
        current_user_id: int
    ) -> User:
        """Update user information"""
        user = UserService.get_user_by_id(db, user_id)
        
        # Update fields
        if user_update.full_name is not None:
            user.full_name = user_update.full_name
        if user_update.status is not None:
            user.status = user_update.status
        if user_update.email is not None:
            # Check if email is already taken
            existing = db.query(User).filter(
                User.email == user_update.email,
                User.id != user_id
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use"
                )
            user.email = user_update.email
        
        db.commit()
        db.refresh(user)
        
        # Log audit
        log_audit(
            db=db,
            user_id=current_user_id,
            action="update",
            resource="user",
            resource_id=user.id,
            details=user_update.dict(exclude_unset=True)
        )
        
        return user
    
    @staticmethod
    def approve_user(db: Session, user_id: int, admin_user_id: int) -> User:
        """Approve pending user"""
        user = UserService.get_user_by_id(db, user_id)
        
        if user.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is not pending approval"
            )
        
        user.status = "active"
        db.commit()
        db.refresh(user)
        
        # Log audit
        log_audit(
            db=db,
            user_id=admin_user_id,
            action="approve",
            resource="user",
            resource_id=user.id,
            details={"approved_user_email": user.email}
        )
        
        return user
    
    @staticmethod
    def delete_user(db: Session, user_id: int, admin_user_id: int) -> None:
        """Delete user"""
        user = UserService.get_user_by_id(db, user_id)
        
        # Log audit before deletion
        log_audit(
            db=db,
            user_id=admin_user_id,
            action="delete",
            resource="user",
            resource_id=user.id,
            details={"deleted_user_email": user.email}
        )
        
        db.delete(user)
        db.commit()