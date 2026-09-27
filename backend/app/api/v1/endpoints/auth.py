from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.user import User, Cooperative
from app.schemas.auth import LoginRequest, Token, UserResponse

router = APIRouter()

@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Compte désactivé. Veuillez contacter l'administrateur TTSFR.",
        )

    coop_id = None
    if user.cooperative:
        coop_id = user.cooperative.id

    access_token = create_access_token(subject=str(user.id))
    return Token(
        access_token=access_token,
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        cooperative_id=coop_id,
    )
