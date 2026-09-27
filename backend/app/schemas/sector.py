from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel

class SubSectorResponse(BaseModel):
    id: UUID
    code: str
    name: str
    description: Optional[str] = None
    order_index: int

    class Config:
        from_attributes = True

class SectorResponse(BaseModel):
    id: UUID
    code: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    order_index: int
    sub_sectors: List[SubSectorResponse] = []

    class Config:
        from_attributes = True
