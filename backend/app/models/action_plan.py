import uuid
from datetime import datetime, timezone, date
from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base

class ActionStatus:
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"

class ActionPlan(Base):
    __tablename__ = "action_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    diagnostic_id = Column(UUID(as_uuid=True), ForeignKey("diagnostic_submissions.id", ondelete="CASCADE"), unique=True, nullable=False)
    cooperative_id = Column(UUID(as_uuid=True), ForeignKey("cooperatives.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), default="Plan d'action personnalisé TTSFR")
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    diagnostic = relationship("DiagnosticSubmission", back_populates="action_plan")
    items = relationship("ActionItem", back_populates="action_plan", cascade="all, delete-orphan", order_by="ActionItem.order_index")

class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    action_plan_id = Column(UUID(as_uuid=True), ForeignKey("action_plans.id", ondelete="CASCADE"), nullable=False)
    
    domain = Column(String(100), nullable=True)  # ex: "Mise à niveau technique"
    objective = Column(Text, nullable=False)
    action = Column(Text, nullable=False)
    assignee = Column(String(255), nullable=True)
    deadline = Column(Date, nullable=True)
    status = Column(String(50), default=ActionStatus.TODO, nullable=False)
    
    proof_file_url = Column(String(500), nullable=True)
    comment = Column(Text, nullable=True)
    expert_observation = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    action_plan = relationship("ActionPlan", back_populates="items")
