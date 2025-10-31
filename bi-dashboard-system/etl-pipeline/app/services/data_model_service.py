"""
Data Model Service
etl-pipeline/app/services/data_model_service.py
"""
from sqlalchemy import text, MetaData, Table, Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Dict, Any
import json

from ..models.data_model import DataModel, DataRelationship
from ..schemas.data_model import DataModelCreate, DataModelUpdate, DataRelationshipCreate
from ..utils.audit import log_audit
from ..database import engine


class DataModelService:
    """Service for managing data models and dynamic tables"""
    
    @staticmethod
    def create_data_model(
        db: Session,
        model_data: DataModelCreate,
        user_id: int
    ) -> DataModel:
        """Create a new data model and corresponding database table"""
        
        # Check if model name already exists
        existing = db.query(DataModel).filter(DataModel.name == model_data.name).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Data model with this name already exists"
            )
        
        # Generate table name
        table_name = f"dm_{model_data.name.lower().replace(' ', '_')}"
        
        # Create data model record
        data_model = DataModel(
            name=model_data.name,
            display_name=model_data.display_name,
            description=model_data.description,
            schema_json=[field.dict() for field in model_data.schema_json],
            table_name=table_name,
            created_by=user_id,
            version=1
        )
        
        db.add(data_model)
        db.commit()
        db.refresh(data_model)
        
        # Create physical database table
        try:
            DataModelService._create_physical_table(table_name, model_data.schema_json)
        except Exception as e:
            db.delete(data_model)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create database table: {str(e)}"
            )
        
        # Log audit
        log_audit(
            db=db,
            user_id=user_id,
            action="create",
            resource="data_model",
            resource_id=data_model.id,
            details={"name": data_model.name}
        )
        
        return data_model
    
    @staticmethod
    def _create_physical_table(table_name: str, schema: List[Dict[str, Any]]) -> None:
        """Create physical database table based on schema"""
        
        # Map field types to SQLAlchemy types
        type_mapping = {
            'string': String(255),
            'text': Text,
            'number': Float,
            'integer': Integer,
            'date': DateTime,
            'datetime': DateTime,
            'boolean': Boolean
        }
        
        # Build columns
        columns = [Column('id', Integer, primary_key=True, autoincrement=True)]
        
        for field in schema:
            field_type = field.get('type', 'string')
            sql_type = type_mapping.get(field_type, String(255))
            
            nullable = not field.get('required', False)
            unique = field.get('unique', False)
            
            columns.append(
                Column(field['name'], sql_type, nullable=nullable, unique=unique)
            )
        
        # Add metadata columns
        columns.extend([
            Column('created_at', DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP')),
            Column('updated_at', DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        ])
        
        # Create table
        metadata = MetaData()
        table = Table(table_name, metadata, *columns)
        metadata.create_all(engine)
    
    @staticmethod
    def get_all_data_models(db: Session, include_inactive: bool = False) -> List[DataModel]:
        """Get all data models"""
        query = db.query(DataModel)
        if not include_inactive:
            query = query.filter(DataModel.is_active == 1)
        return query.all()
    
    @staticmethod
    def get_data_model_by_id(db: Session, model_id: int) -> DataModel:
        """Get data model by ID"""
        model = db.query(DataModel).filter(DataModel.id == model_id).first()
        if not model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data model not found"
            )
        return model
    
    @staticmethod
    def update_data_model(
        db: Session,
        model_id: int,
        model_update: DataModelUpdate,
        user_id: int
    ) -> DataModel:
        """Update data model"""
        model = DataModelService.get_data_model_by_id(db, model_id)
        
        # Update fields
        if model_update.display_name is not None:
            model.display_name = model_update.display_name
        if model_update.description is not None:
            model.description = model_update.description
        if model_update.is_active is not None:
            model.is_active = 1 if model_update.is_active else 0
        
        # Schema updates require versioning
        if model_update.schema_json is not None:
            model.schema_json = [field.dict() for field in model_update.schema_json]
            model.version += 1
        
        db.commit()
        db.refresh(model)
        
        # Log audit
        log_audit(
            db=db,
            user_id=user_id,
            action="update",
            resource="data_model",
            resource_id=model.id,
            details=model_update.dict(exclude_unset=True)
        )
        
        return model
    
    @staticmethod
    def delete_data_model(db: Session, model_id: int, user_id: int) -> None:
        """Delete data model (soft delete by default)"""
        model = DataModelService.get_data_model_by_id(db, model_id)
        
        # Soft delete - just mark as inactive
        model.is_active = 0
        db.commit()
        
        # Log audit
        log_audit(
            db=db,
            user_id=user_id,
            action="delete",
            resource="data_model",
            resource_id=model.id,
            details={"name": model.name}
        )
    
    @staticmethod
    def create_relationship(
        db: Session,
        relationship_data: DataRelationshipCreate,
        user_id: int
    ) -> DataRelationship:
        """Create relationship between data models"""
        
        # Verify both models exist
        source_model = DataModelService.get_data_model_by_id(db, relationship_data.source_model_id)
        target_model = DataModelService.get_data_model_by_id(db, relationship_data.target_model_id)
        
        # Create relationship
        relationship = DataRelationship(
            name=relationship_data.name,
            source_model_id=relationship_data.source_model_id,
            target_model_id=relationship_data.target_model_id,
            type=relationship_data.type,
            config=relationship_data.config
        )
        
        db.add(relationship)
        db.commit()
        db.refresh(relationship)
        
        # Log audit
        log_audit(
            db=db,
            user_id=user_id,
            action="create",
            resource="data_relationship",
            resource_id=relationship.id,
            details={
                "name": relationship.name,
                "source": source_model.name,
                "target": target_model.name
            }
        )
        
        return relationship
    
    @staticmethod
    def get_model_data(
        db: Session,
        model_id: int,
        limit: int = 100,
        offset: int = 0
    ) -> Dict[str, Any]:
        """Get data from a data model table"""
        model = DataModelService.get_data_model_by_id(db, model_id)
        
        if not model.table_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Data model has no associated table"
            )
        
        # Query the dynamic table
        query = text(f"SELECT * FROM {model.table_name} LIMIT :limit OFFSET :offset")
        result = db.execute(query, {"limit": limit, "offset": offset})
        
        # Get column names
        columns = result.keys()
        
        # Fetch rows
        rows = [dict(zip(columns, row)) for row in result.fetchall()]
        
        # Get total count
        count_query = text(f"SELECT COUNT(*) as total FROM {model.table_name}")
        total = db.execute(count_query).scalar()
        
        return {
            "data": rows,
            "total": total,
            "limit": limit,
            "offset": offset
        }