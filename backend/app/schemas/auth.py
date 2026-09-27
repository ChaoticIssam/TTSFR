from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr

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

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str
    phone: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True
