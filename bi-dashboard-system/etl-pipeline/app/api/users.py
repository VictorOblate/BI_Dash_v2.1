"""
User Management API Routes
etl-pipeline/app/api/users.py
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas.user import UserResponse, UserUpdate
from ..services.user_service import UserService
from .dependencies import get_current_active_user, require_admin

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Get all users (Admin only)
    """
    users = UserService.get_all_users(db, skip, limit)
    return users


@router.get("/pending", response_model=List[UserResponse])
def get_pending_users(
    current_user = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Get users pending approval (Admin only)
    """
    users = UserService.get_pending_users(db)
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user by ID
    """
    user = UserService.get_user_by_id(db, user_id)
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Update user (Admin only)
    """
    user = UserService.update_user(db, user_id, user_update, current_user.id)
    return user


@router.post("/{user_id}/approve", response_model=UserResponse)
def approve_user(
    user_id: int,
    current_user = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Approve pending user (Admin only)
    """
    user = UserService.approve_user(db, user_id, current_user.id)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    current_user = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Delete user (Admin only)
    """
    UserService.delete_user(db, user_id, current_user.id)
    return None