"""
Upload Schemas
etl-pipeline/app/schemas/upload.py
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UploadCreate(BaseModel):
    model_id: int
    file_name: str


class UploadResponse(BaseModel):
    id: int
    user_id: int
    model_id: Optional[int]
    file_name: str
    file_size: Optional[int]
    status: str
    records_count: Optional[int]
    records_success: Optional[int]
    records_failed: Optional[int]
    error_log: Optional[str]
    transaction_id: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class UploadPreview(BaseModel):
    columns: list
    sample_data: list
    row_count: int
    detected_types: dict