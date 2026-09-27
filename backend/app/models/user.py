import uuid
from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base

class UserRole:
    ADMIN = "ADMIN"
    COORDINATOR = "COORDINATOR"
    EXPERT = "EXPERT"
    COOPERATIVE = "COOPERATIVE"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), default=UserRole.COOPERATIVE, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    cooperative = relationship("Cooperative", back_populates="user", uselist=False)

class Cooperative(Base):
    __tablename__ = "cooperatives"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    registration_number = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    member_count = Column(Integer, default=1)
    women_member_count = Column(Integer, default=0)
    
    # ODCO classification
    sector_id = Column(UUID(as_uuid=True), ForeignKey("sectors.id"), nullable=True)
    sub_sector_id = Column(UUID(as_uuid=True), ForeignKey("sub_sectors.id"), nullable=True)
    
    activity_description = Column(Text, nullable=True)
    products_list = Column(JSONB, default=list)
    equipment_list = Column(JSONB, default=list)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="cooperative")
    sector = relationship("Sector")
    sub_sector = relationship("SubSector")
    diagnostics = relationship("DiagnosticSubmission", back_populates="cooperative", cascade="all, delete-orphan")
