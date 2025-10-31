"""
Dashboard Schemas
etl-pipeline/app/schemas/dashboard.py
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class VisualizationCreate(BaseModel):
    type: str = Field(..., max_length=100)
    title: Optional[str] = Field(None, max_length=255)
    config: Dict[str, Any]
    query: Optional[str] = None
    order: int = 0
    refresh_rate: int = 0


class VisualizationResponse(VisualizationCreate):
    id: int
    tab_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DashboardTabCreate(BaseModel):
    name: str = Field(..., max_length=255)
    order: int = 0
    config: Optional[Dict[str, Any]] = None


class DashboardTabResponse(DashboardTabCreate):
    id: int
    dashboard_id: int
    visualizations: List[VisualizationResponse] = []
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DashboardCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    layout: Optional[Dict[str, Any]] = None


class DashboardUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    layout: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class DashboardResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    layout: Optional[Dict[str, Any]]
    is_active: bool
    created_by: int
    tabs: List[DashboardTabResponse] = []
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True