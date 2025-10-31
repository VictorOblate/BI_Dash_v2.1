"""
Data Model Schemas
etl-pipeline/app/schemas/data_model.py
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class FieldDefinition(BaseModel):
    name: str
    type: str  # string, number, date, boolean, text
    display_name: Optional[str] = None
    required: bool = False
    unique: bool = False
    default: Optional[Any] = None
    constraints: Optional[Dict[str, Any]] = None  # min, max, pattern, etc.


class DataModelBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    display_name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class DataModelCreate(DataModelBase):
    schema_json: List[FieldDefinition]


class DataModelUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    schema_json: Optional[List[FieldDefinition]] = None
    is_active: Optional[bool] = None


class DataModelResponse(DataModelBase):
    id: int
    schema_json: List[Dict[str, Any]]
    version: int
    is_active: bool
    table_name: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DataRelationshipCreate(BaseModel):
    name: str
    source_model_id: int
    target_model_id: int
    type: str = Field(..., pattern="^(one_to_one|one_to_many|many_to_many)$")
    config: Dict[str, Any]  # source_field, target_field


class DataRelationshipResponse(BaseModel):
    id: int
    name: str
    source_model_id: int
    target_model_id: int
    type: str
    config: Dict[str, Any]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True