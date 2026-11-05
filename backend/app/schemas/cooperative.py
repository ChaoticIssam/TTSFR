from datetime import datetime
from typing import Any, List, Optional
from uuid import UUID
from pydantic import BaseModel, Field

from app.schemas.sector import SectorResponse, SubSectorResponse

class CooperativeBase(BaseModel):
    name: str = Field(..., max_length=255)
    registration_number: Optional[str] = Field(None, max_length=100)
    region: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = None
    member_count: int = Field(default=1, ge=1)
    women_member_count: int = Field(default=0, ge=0)
    sector_id: Optional[UUID] = None
    sub_sector_id: Optional[UUID] = None
    activity_description: Optional[str] = None
    products_list: List[str] = Field(default_factory=list)
    equipment_list: List[str] = Field(default_factory=list)

class CooperativeUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    registration_number: Optional[str] = Field(None, max_length=100)
    region: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = None
    member_count: Optional[int] = Field(None, ge=1)
    women_member_count: Optional[int] = Field(None, ge=0)
    sector_id: Optional[UUID] = None
    sub_sector_id: Optional[UUID] = None
    activity_description: Optional[str] = None
    products_list: Optional[List[str]] = None
    equipment_list: Optional[List[str]] = None

class CooperativeResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    registration_number: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    member_count: int
    women_member_count: int
    sector_id: Optional[UUID] = None
    sub_sector_id: Optional[UUID] = None
    activity_description: Optional[str] = None
    products_list: List[str] = []
    equipment_list: List[str] = []
    created_at: datetime
    updated_at: datetime
    sector: Optional[SectorResponse] = None
    sub_sector: Optional[SubSectorResponse] = None

    class Config:
        from_attributes = True
