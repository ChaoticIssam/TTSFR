from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_active_user,
)
from app.models import User, Cooperative, UserRole
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    Token,
    UserMeResponse,
    PasswordChangeRequest,
)

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
            detail="Compte desactive. Veuillez contacter l'administrateur TTSFR.",
        )

    coop_id = user.cooperative.id if user.cooperative else None

    access_token = create_access_token(subject=str(user.id))
    return Token(
        access_token=access_token,
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        cooperative_id=coop_id,
    )

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_cooperative(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Registers a new cooperative and its administrator account, returning an access token.
    """
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un compte avec cette adresse e-mail existe deja.",
        )

    new_user = User(
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name,
        phone=payload.phone,
        role=UserRole.COOPERATIVE,
        is_active=True,
    )
    db.add(new_user)
    db.flush()

    new_coop = Cooperative(
        user_id=new_user.id,
        name=payload.cooperative_name,
        region=payload.region,
        city=payload.city,
        member_count=1,
        women_member_count=0,
    )
    db.add(new_coop)
    db.commit()
    db.refresh(new_user)
    db.refresh(new_coop)

    access_token = create_access_token(subject=str(new_user.id))
    return Token(
        access_token=access_token,
        user_id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        role=new_user.role,
        cooperative_id=new_coop.id,
    )

@router.get("/me", response_model=UserMeResponse)
def get_authenticated_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    """
    Returns the profile and cooperative details of the currently authenticated user.
    """
    return current_user

@router.post("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    payload: PasswordChangeRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Securely updates the password of the currently authenticated user.
    """
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le mot de passe actuel est incorrect.",
        )

    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le nouveau mot de passe doit comporter au moins 8 caracteres.",
        )

    current_user.hashed_password = get_password_hash(payload.new_password)
    db.commit()

    return {"message": "Mot de passe modifie avec succes."}
