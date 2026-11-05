from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: UUID
    email: str
    full_name: str
    role: str
    cooperative_id: Optional[UUID] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    cooperative_name: str = Field(..., min_length=2, max_length=255)
    region: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

class CooperativeSummary(BaseModel):
    id: UUID
    name: str
    region: Optional[str] = None
    city: Optional[str] = None
    member_count: int = 1
    women_member_count: int = 0
    sector_id: Optional[UUID] = None
    sub_sector_id: Optional[UUID] = None

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str
    phone: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

class UserMeResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str
    phone: Optional[str] = None
    is_active: bool
    cooperative: Optional[CooperativeSummary] = None

    class Config:
        from_attributes = True
