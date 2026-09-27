import uuid
from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base

class ClusterCode:
    ARTISANAL_TRADITIONNEL = "ARTISANAL_TRADITIONNEL"
    TRANSFORMATION_LEGERE = "TRANSFORMATION_LEGERE"
    PRODUCTION_MECANISEE = "PRODUCTION_MECANISEE"
    INDUSTRIEL_EXTRACTIF = "INDUSTRIEL_EXTRACTIF"
    SERVICES_ORGANISES = "SERVICES_ORGANISES"
    SERVICES_COGNITIFS = "SERVICES_COGNITIFS"

class ModuleCategory:
    MATURITE = "MATURITE"
    TECHNOLOGIQUE = "TECHNOLOGIQUE"
    SECTORIEL = "SECTORIEL"
    TRANSVERSAL = "TRANSVERSAL"

class Cluster(Base):
    __tablename__ = "clusters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    color_code = Column(String(50), default="#0F4C3A")
    icon = Column(String(100), nullable=True)
    order_index = Column(Integer, default=0)

    modules = relationship("Module", back_populates="cluster")
    diagnostics = relationship("DiagnosticSubmission", back_populates="cluster")

class Module(Base):
    __tablename__ = "modules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    cluster_id = Column(UUID(as_uuid=True), ForeignKey("clusters.id"), nullable=True)
    category = Column(String(50), default=ModuleCategory.TRANSVERSAL, nullable=False)
    title = Column(String(255), nullable=False)
    domain = Column(String(100), nullable=True)  # ex: "Mise à niveau technique", "Certification"
    objective = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    resource_type = Column(String(50), default="DOCUMENT")  # DOCUMENT, VIDEO, GUIDE, TEMPLATE
    resource_url = Column(String(500), nullable=True)
    order_index = Column(Integer, default=0)

    cluster = relationship("Cluster", back_populates="modules")
