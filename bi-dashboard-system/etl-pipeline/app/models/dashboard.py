"""
Dashboard Models
etl-pipeline/app/models/dashboard.py
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base


class Dashboard(Base):
    __tablename__ = "dashboards"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    layout = Column(JSON, nullable=True)  # Store layout configuration
    is_active = Column(Integer, default=1, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    creator = relationship("User", back_populates="created_dashboards")
    tabs = relationship("DashboardTab", back_populates="dashboard", cascade="all, delete-orphan", order_by="DashboardTab.order")
    permissions = relationship("DashboardPermission", back_populates="dashboard", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Dashboard(id={self.id}, name='{self.name}')>"


class DashboardTab(Base):
    __tablename__ = "dashboard_tabs"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    dashboard_id = Column(Integer, ForeignKey("dashboards.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    order = Column(Integer, default=0, nullable=False)
    config = Column(JSON, nullable=True)  # Tab-specific configuration
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    dashboard = relationship("Dashboard", back_populates="tabs")
    visualizations = relationship("Visualization", back_populates="tab", cascade="all, delete-orphan", order_by="Visualization.order")
    
    def __repr__(self):
        return f"<DashboardTab(id={self.id}, name='{self.name}', dashboard_id={self.dashboard_id})>"


class Visualization(Base):
    __tablename__ = "visualizations"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tab_id = Column(Integer, ForeignKey("dashboard_tabs.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(100), nullable=False)  # bar, line, pie, scatter, table, etc.
    title = Column(String(255), nullable=True)
    config = Column(JSON, nullable=False)  # Plotly configuration
    query = Column(Text, nullable=True)  # SQL query or data source configuration
    order = Column(Integer, default=0, nullable=False)
    refresh_rate = Column(Integer, default=0, nullable=True)  # Refresh interval in seconds (0 = no auto-refresh)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    tab = relationship("DashboardTab", back_populates="visualizations")
    
    def __repr__(self):
        return f"<Visualization(id={self.id}, type='{self.type}', tab_id={self.tab_id})>"


class DashboardPermission(Base):
    __tablename__ = "dashboard_permissions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    dashboard_id = Column(Integer, ForeignKey("dashboards.id", ondelete="CASCADE"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    permissions_json = Column(JSON, nullable=False)  # {"view": true, "edit": false, "export": true}
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    dashboard = relationship("Dashboard", back_populates="permissions")
    role = relationship("Role", back_populates="dashboard_permissions")
    
    def __repr__(self):
        return f"<DashboardPermission(dashboard_id={self.dashboard_id}, role_id={self.role_id})>"