"""
Organizational Structure Models
etl-pipeline/app/models/organization.py
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base


class OrganizationalUnit(Base):
    __tablename__ = "organizational_units"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # company, division, department, team
    parent_id = Column(Integer, ForeignKey("organizational_units.id"), nullable=True)
    path = Column(String(1000), nullable=True)  # Materialized path for hierarchy
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    parent = relationship("OrganizationalUnit", remote_side=[id], backref="children")
    users = relationship("UserOrganizationalUnit", back_populates="organizational_unit", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<OrganizationalUnit(id={self.id}, name='{self.name}', type='{self.type}')>"


class UserOrganizationalUnit(Base):
    __tablename__ = "user_organizational_units"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    org_unit_id = Column(Integer, ForeignKey("organizational_units.id", ondelete="CASCADE"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="organizational_units")
    organizational_unit = relationship("OrganizationalUnit", back_populates="users")
    
    def __repr__(self):
        return f"<UserOrganizationalUnit(user_id={self.user_id}, org_unit_id={self.org_unit_id})>"