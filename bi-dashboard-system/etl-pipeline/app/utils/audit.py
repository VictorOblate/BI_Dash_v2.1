"""
Audit Logging Utilities
etl-pipeline/app/utils/audit.py
"""
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
import json
import logging

from ..models.audit import AuditLog

logger = logging.getLogger(__name__)


def log_audit(
    db: Session,
    user_id: Optional[int],
    action: str,
    resource: str,
    resource_id: Optional[int] = None,
    details: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    status: str = "success"
) -> AuditLog:
    """
    Create an audit log entry
    
    Args:
        db: Database session
        user_id: ID of the user performing the action
        action: Action being performed (login, create, update, delete, etc.)
        resource: Resource being acted upon
        resource_id: ID of the specific resource
        details: Additional details about the action
        ip_address: IP address of the request
        user_agent: User agent string
        status: Status of the action (success, failed)
    
    Returns:
        Created AuditLog object
    """
    try:
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            resource=resource,
            resource_id=resource_id,
            details=json.dumps(details) if details else None,
            ip_address=ip_address,
            user_agent=user_agent,
            status=status
        )
        
        db.add(audit_log)
        db.commit()
        db.refresh(audit_log)
        
        return audit_log
        
    except Exception as e:
        logger.error(f"Error creating audit log: {e}")
        db.rollback()
        raise