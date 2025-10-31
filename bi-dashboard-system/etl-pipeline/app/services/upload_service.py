"""
Upload Service
etl-pipeline/app/services/upload_service.py
"""
from sqlalchemy import text, insert
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from typing import Dict, Any, List
import pandas as pd
from datetime import datetime
import uuid

from ..models.upload import UploadHistory
from ..models.data_model import DataModel
from ..utils.file_handler import validate_file, save_upload_file, read_file_preview, process_upload
from ..utils.audit import log_audit
from ..database import engine


class UploadService:
    """Service for managing file uploads and data ingestion"""
    
    @staticmethod
    def preview_upload(
        file_path: str,
        rows: int = 10
    ) -> Dict[str, Any]:
        """Preview uploaded file before import"""
        return read_file_preview(file_path, rows)
    
    @staticmethod
    def upload_file(
        db: Session,
        file: UploadFile,
        model_id: int,
        user_id: int,
        column_mapping: Dict[str, str] = None
    ) -> UploadHistory:
        """Upload and process file"""
        
        # Validate file
        is_valid, error_msg = validate_file(file.filename, file.size)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )
        
        # Get data model
        data_model = db.query(DataModel).filter(DataModel.id == model_id).first()
        if not data_model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data model not found"
            )
        
        # Save file
        file_path = save_upload_file(file)
        
        # Create upload history record
        transaction_id = str(uuid.uuid4())
        upload_record = UploadHistory(
            user_id=user_id,
            model_id=model_id,
            file_name=file.filename,
            file_path=file_path,
            file_size=file.size,
            status="processing",
            transaction_id=transaction_id
        )
        
        db.add(upload_record)
        db.commit()
        db.refresh(upload_record)
        
        try:
            # Process file
            df, validation_results = process_upload(
                file_path,
                data_model.schema_json,
                column_mapping
            )
            
            # Insert data into table
            if len(df) > 0:
                UploadService._insert_data(
                    db,
                    data_model.table_name,
                    df,
                    transaction_id
                )
            
            # Update upload record
            upload_record.status = "completed"
            upload_record.records_count = validation_results['total_rows']
            upload_record.records_success = validation_results['valid_rows']
            upload_record.records_failed = validation_results['invalid_rows']
            upload_record.completed_at = datetime.utcnow()
            
            if validation_results['errors']:
                upload_record.error_log = str(validation_results['errors'])
            
            db.commit()
            db.refresh(upload_record)
            
            # Log audit
            log_audit(
                db=db,
                user_id=user_id,
                action="upload",
                resource="data",
                resource_id=upload_record.id,
                details={
                    "file_name": file.filename,
                    "model_name": data_model.name,
                    "records": validation_results['total_rows']
                }
            )
            
        except Exception as e:
            # Update status to failed
            upload_record.status = "failed"
            upload_record.error_log = str(e)
            upload_record.completed_at = datetime.utcnow()
            db.commit()
            
            # Log audit
            log_audit(
                db=db,
                user_id=user_id,
                action="upload",
                resource="data",
                resource_id=upload_record.id,
                details={
                    "file_name": file.filename,
                    "error": str(e)
                },
                status="failed"
            )
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Upload failed: {str(e)}"
            )
        
        return upload_record
    
    @staticmethod
    def _insert_data(
        db: Session,
        table_name: str,
        df: pd.DataFrame,
        transaction_id: str
    ) -> None:
        """Insert DataFrame data into table"""
        
        # Add transaction_id column for rollback capability
        df['transaction_id'] = transaction_id
        
        # Convert DataFrame to list of dicts
        records = df.to_dict(orient='records')
        
        # Insert in batches
        batch_size = 1000
        for i in range(0, len(records), batch_size):
            batch = records[i:i + batch_size]
            
            # Build insert query
            columns = list(batch[0].keys())
            placeholders = ', '.join([f':{col}' for col in columns])
            query = text(
                f"INSERT INTO {table_name} ({', '.join(columns)}) "
                f"VALUES ({placeholders})"
            )
            
            # Execute batch insert
            db.execute(query, batch)
        
        db.commit()
    
    @staticmethod
    def get_upload_history(
        db: Session,
        user_id: int = None,
        model_id: int = None,
        limit: int = 100
    ) -> List[UploadHistory]:
        """Get upload history"""
        query = db.query(UploadHistory)
        
        if user_id:
            query = query.filter(UploadHistory.user_id == user_id)
        if model_id:
            query = query.filter(UploadHistory.model_id == model_id)
        
        return query.order_by(UploadHistory.created_at.desc()).limit(limit).all()
    
    @staticmethod
    def rollback_upload(
        db: Session,
        upload_id: int,
        user_id: int
    ) -> UploadHistory:
        """Rollback an upload by deleting its data"""
        
        upload = db.query(UploadHistory).filter(UploadHistory.id == upload_id).first()
        if not upload:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Upload not found"
            )
        
        if upload.status != "completed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only rollback completed uploads"
            )
        
        # Get data model
        data_model = db.query(DataModel).filter(DataModel.id == upload.model_id).first()
        if not data_model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Associated data model not found"
            )
        
        try:
            # Delete data with matching transaction_id
            delete_query = text(
                f"DELETE FROM {data_model.table_name} "
                f"WHERE transaction_id = :transaction_id"
            )
            result = db.execute(delete_query, {"transaction_id": upload.transaction_id})
            deleted_count = result.rowcount
            
            # Update upload status
            upload.status = "reverted"
            db.commit()
            db.refresh(upload)
            
            # Log audit
            log_audit(
                db=db,
                user_id=user_id,
                action="rollback",
                resource="upload",
                resource_id=upload.id,
                details={
                    "file_name": upload.file_name,
                    "records_deleted": deleted_count
                }
            )
            
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Rollback failed: {str(e)}"
            )
        
        return upload