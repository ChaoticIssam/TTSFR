from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.cluster import Cluster
from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class ClusterResponse(BaseModel):
    id: UUID
    code: str
    name: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    color_code: Optional[str] = "#0F4C3A"
    icon: Optional[str] = None
    order_index: int

    class Config:
        from_attributes = True

router = APIRouter()

@router.get("", response_model=List[ClusterResponse])
def get_all_clusters(db: Session = Depends(get_db)):
    """Retrieve all 6 reference clusters."""
    return db.query(Cluster).order_by(Cluster.order_index).all()
