"""
Data Models API Routes
etl-pipeline/app/api/data_models.py
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from ..database import get_db
from ..schemas.data_model import (
    DataModelCreate,
    DataModelUpdate,
    DataModelResponse,
    DataRelationshipCreate,
    DataRelationshipResponse
)
from ..services.data_model_service import DataModelService
from .dependencies import get_current_active_user, require_admin

router = APIRouter()


@router.post("/", response_model=DataModelResponse, status_code=status.HTTP_201_CREATED)
def create_data_model(
    model_data: DataModelCreate,
    current_user = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Create a new data model (Admin only)
    """
    return DataModelService.create_data_model(db, model_data, current_user.id)


@router.get("/", response_model=List[DataModelResponse])
def get_all_data_models(
    include_inactive: bool = False,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all data models
    """
    return DataModelService.get_all_data_models(db, include_inactive)


@router.get("/{model_id}", response_model=DataModelResponse)
def get_data_model(
    model_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get data model by ID
    """
    return DataModelService.get_data_model_by_id(db, model_id)


@router.put("/{model_id}", response_model=DataModelResponse)
def update_data_model(
    model_id: int,
    model_update: DataModelUpdate,
    current_user = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Update data model (Admin only)
    """
    return DataModelService.update_data_model(db, model_id, model_update, current_user.id)


@router.delete("/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_data_model(
    model_id: int,
    current_user = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Delete data model (Admin only)
    """
    DataModelService.delete_data_model(db, model_id, current_user.id)
    return None


@router.get("/{model_id}/data", response_model=Dict[str, Any])
def get_model_data(
    model_id: int,
    limit: int = 100,
    offset: int = 0,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get data from data model table
    """
    return DataModelService.get_model_data(db, model_id, limit, offset)


@router.post("/relationships", response_model=DataRelationshipResponse, status_code=status.HTTP_201_CREATED)
def create_relationship(
    relationship_data: DataRelationshipCreate,
    current_user = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Create relationship between data models (Admin only)
    """
    return DataModelService.create_relationship(db, relationship_data, current_user.id)