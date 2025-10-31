"""
Upload History Model
etl-pipeline/app/models/upload.py
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, BigInteger
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base


class UploadHistory(Base):
    __tablename__ = "upload_history"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    model_id = Column(Integer, ForeignKey("data_models.id"), nullable=True)
    file_name = Column(String(500), nullable=False)
    file_path = Column(String(1000), nullable=True)
    file_size = Column(BigInteger, nullable=True)
    status = Column(String(50), nullable=False)  # pending, processing, completed, failed, reverted
    records_count = Column(Integer, default=0, nullable=True)
    records_success = Column(Integer, default=0, nullable=True)
    records_failed = Column(Integer, default=0, nullable=True)
    error_log = Column(Text, nullable=True)
    metadata_json = Column("metadata", Text, nullable=True)  # JSON string with additional info
    transaction_id = Column(String(100), nullable=True, index=True)  # For rollback capability
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="uploads")
    data_model = relationship("DataModel", back_populates="uploads")
    
    def __repr__(self):
        return f"<UploadHistory(id={self.id}, file_name='{self.file_name}', status='{self.status}')>"