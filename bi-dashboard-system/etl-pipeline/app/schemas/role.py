"""
Role and Permission Schemas
etl-pipeline/app/schemas/role.py
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PermissionBase(BaseModel):
    resource: str = Field(..., max_length=100)
    action: str = Field(..., max_length=50)
    description: Optional[str] = None


class PermissionCreate(PermissionBase):
    pass


class PermissionResponse(PermissionBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class RoleBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None


class RoleCreate(RoleBase):
    permission_ids: Optional[List[int]] = []


class RoleUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    permission_ids: Optional[List[int]] = None


class RoleResponse(RoleBase):
    id: int
    is_system_role: bool
    created_at: datetime
    updated_at: datetime
    permissions: List[PermissionResponse] = []
    
    class Config:
        from_attributes = True