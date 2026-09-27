import uuid
from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base

class Sector(Base):
    __tablename__ = "sectors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)
    order_index = Column(Integer, default=0)

    sub_sectors = relationship("SubSector", back_populates="sector", cascade="all, delete-orphan", order_by="SubSector.order_index")

class SubSector(Base):
    __tablename__ = "sub_sectors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    sector_id = Column(UUID(as_uuid=True), ForeignKey("sectors.id", ondelete="CASCADE"), nullable=False)
    code = Column(String(50), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)

    sector = relationship("Sector", back_populates="sub_sectors")
