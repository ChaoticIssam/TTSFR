from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.sector import Sector
from app.schemas.sector import SectorResponse

router = APIRouter()

@router.get("", response_model=List[SectorResponse])
def get_sectors(db: Session = Depends(get_db)):
    """Retrieve all ODCO sectors and their respective sub-sectors."""
    return db.query(Sector).order_by(Sector.order_index).all()
