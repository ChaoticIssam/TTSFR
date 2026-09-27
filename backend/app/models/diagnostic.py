import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base

class DiagnosticStatus:
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    VALIDATED = "VALIDATED"
    REOPENED = "REOPENED"

class DiagnosticSubmission(Base):
    __tablename__ = "diagnostic_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    cooperative_id = Column(UUID(as_uuid=True), ForeignKey("cooperatives.id", ondelete="CASCADE"), nullable=False)
    
    current_step = Column(Integer, default=1)  # 1 to 5
    status = Column(String(50), default=DiagnosticStatus.DRAFT, nullable=False)
    
    # JSONB storage for answers by step:
    # {"step_1": {"sector_id": "...", "sub_sector_id": "..."}, "step_2": {...}, ...}
    answers = Column(JSONB, default=dict)

    # 4 Evaluated Performance & Maturity Dimensions (0.0 to 100.0)
    score_operational = Column(Float, default=0.0)
    score_economic = Column(Float, default=0.0)
    score_organizational = Column(Float, default=0.0)
    score_tech_energy = Column(Float, default=0.0)
    score_global = Column(Float, default=0.0)

    # Assigned Cluster
    cluster_id = Column(UUID(as_uuid=True), ForeignKey("clusters.id"), nullable=True)
    
    # Audit & Compliance
    rule_version = Column(String(50), default="v1.0")
    internal_notes = Column(Text, nullable=True)
    validated_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    validated_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    cooperative = relationship("Cooperative", back_populates="diagnostics")
    cluster = relationship("Cluster", back_populates="diagnostics")
    action_plan = relationship("ActionPlan", back_populates="diagnostic", uselist=False, cascade="all, delete-orphan")
