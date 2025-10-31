"""
Data Model and Relationship Models
etl-pipeline/app/models/data_model.py
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base


class DataModel(Base):
    __tablename__ = "data_models"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    display_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    schema_json = Column(JSON, nullable=False)  # Field definitions, types, constraints
    version = Column(Integer, default=1, nullable=False)
    is_active = Column(Integer, default=1, nullable=False)
    table_name = Column(String(255), nullable=True)  # Actual database table name
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    uploads = relationship("UploadHistory", back_populates="data_model")
    source_relationships = relationship(
        "DataRelationship",
        foreign_keys="DataRelationship.source_model_id",
        back_populates="source_model"
    )
    target_relationships = relationship(
        "DataRelationship",
        foreign_keys="DataRelationship.target_model_id",
        back_populates="target_model"
    )
    
    def __repr__(self):
        return f"<DataModel(id={self.id}, name='{self.name}', version={self.version})>"


class DataRelationship(Base):
    __tablename__ = "data_relationships"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    source_model_id = Column(Integer, ForeignKey("data_models.id", ondelete="CASCADE"), nullable=False)
    target_model_id = Column(Integer, ForeignKey("data_models.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # one_to_one, one_to_many, many_to_many
    config = Column(JSON, nullable=False)  # {"source_field": "id", "target_field": "user_id"}
    is_active = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    source_model = relationship(
        "DataModel",
        foreign_keys=[source_model_id],
        back_populates="source_relationships"
    )
    target_model = relationship(
        "DataModel",
        foreign_keys=[target_model_id],
        back_populates="target_relationships"
    )
    
    def __repr__(self):
        return f"<DataRelationship(id={self.id}, type='{self.type}', source={self.source_model_id}, target={self.target_model_id})>"