from typing import Dict, Any, Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class DiagnosticDraftSave(BaseModel):
    current_step: int
    answers: Dict[str, Any]

class DiagnosticSubmitRequest(BaseModel):
    answers: Dict[str, Any]

class DiagnosticResponse(BaseModel):
    id: UUID
    cooperative_id: UUID
    current_step: int
    status: str
    answers: Dict[str, Any]
    score_operational: float
    score_economic: float
    score_organizational: float
    score_tech_energy: float
    score_global: float
    cluster_id: Optional[UUID] = None
    rule_version: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
