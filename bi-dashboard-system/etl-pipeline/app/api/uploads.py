"""
Upload API Routes
etl-pipeline/app/api/uploads.py
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional, Dict

from ..database import get_db
from ..schemas.upload import UploadResponse, UploadPreview
from ..services.upload_service import UploadService
from ..utils.file_handler import save_upload_file, read_file_preview
from .dependencies import get_current_active_user

router = APIRouter()


@router.post("/preview", response_model=UploadPreview)
async def preview_file(
    file: UploadFile = File(...),
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Preview uploaded file before processing
    """
    # Save file temporarily
    file_path = save_upload_file(file)
    
    # Get preview
    preview_data = read_file_preview(file_path, rows=10)
    
    if not preview_data.get('success'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=preview_data.get('error', 'Failed to preview file')
        )
    
    return UploadPreview(**preview_data)


@router.post("/", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    model_id: int = Form(...),
    column_mapping: Optional[str] = Form(None),  # JSON string
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Upload and process file
    """
    import json
    
    mapping = None
    if column_mapping:
        try:
            mapping = json.loads(column_mapping)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid column mapping JSON"
            )
    
    upload = UploadService.upload_file(
        db=db,
        file=file,
        model_id=model_id,
        user_id=current_user.id,
        column_mapping=mapping
    )
    
    return upload


@router.get("/", response_model=List[UploadResponse])
def get_upload_history(
    model_id: Optional[int] = None,
    limit: int = 100,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get upload history
    """
    uploads = UploadService.get_upload_history(
        db=db,
        user_id=current_user.id,
        model_id=model_id,
        limit=limit
    )
    return uploads


@router.post("/{upload_id}/rollback", response_model=UploadResponse)
def rollback_upload(
    upload_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Rollback an upload
    """
    upload = UploadService.rollback_upload(db, upload_id, current_user.id)
    return upload


@router.get("/{upload_id}", response_model=UploadResponse)
def get_upload(
    upload_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get upload by ID
    """
    from ..models.upload import UploadHistory
    
    upload = db.query(UploadHistory).filter(UploadHistory.id == upload_id).first()
    if not upload:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Upload not found"
        )
    
    return upload