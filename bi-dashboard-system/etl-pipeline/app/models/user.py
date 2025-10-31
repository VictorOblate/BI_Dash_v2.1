"""
User Model
etl-pipeline/app/models/user.py
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    status = Column(String(50), default="pending", nullable=False)  # pending, active, inactive, suspended
    email_verified = Column(Boolean, default=False)
    verification_token = Column(String(255), nullable=True)
    reset_token = Column(String(255), nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    roles = relationship("UserRole", back_populates="user", cascade="all, delete-orphan")
    organizational_units = relationship("UserOrganizationalUnit", back_populates="user", cascade="all, delete-orphan")
    uploads = relationship("UploadHistory", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")
    created_dashboards = relationship("Dashboard", back_populates="creator")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', status='{self.status}')>"