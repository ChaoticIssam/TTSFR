import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Callable, List, Optional, Union
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.core.database import get_db
from app.models import User, Cooperative, UserRole

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    auto_error=True
)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Session expirée ou identifiants invalides",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        user_id = UUID(user_id_str)
    except (JWTError, ValueError):
        raise credentials_exception

    user = (
        db.query(User)
        .options(joinedload(User.cooperative))
        .filter(User.id == user_id)
        .first()
    )
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Compte inactif. Veuillez contacter l'administrateur TTSFR."
        )
    return current_user

def get_current_cooperative_user(
    current_user: User = Depends(get_current_active_user)
) -> User:
    if current_user.role != UserRole.COOPERATIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cet espace est exclusivement réservé aux coopératives."
        )
    if not current_user.cooperative:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucun profil de coopérative n'est associé à ce compte."
        )
    return current_user

def require_roles(*allowed_roles: str) -> Callable[[User], User]:
    def role_checker(current_user: User = Depends(get_current_active_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Action non autorisée pour le rôle : {current_user.role}"
            )
        return current_user
    return role_checker

def verify_cooperative_access(cooperative_id: UUID, current_user: User) -> None:
    """
    Enforces strict tenant isolation:
    - Admin, Coordinator, Expert have cross-tenant access.
    - Cooperative users can ONLY access their own cooperative data.
    """
    privileged_roles = {UserRole.ADMIN, UserRole.COORDINATOR, UserRole.EXPERT}
    if current_user.role in privileged_roles:
        return

    if current_user.role == UserRole.COOPERATIVE:
        if not current_user.cooperative or current_user.cooperative.id != cooperative_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Accès interdit : isolation des données entre coopératives."
            )
        return

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Privilèges insuffisants pour accéder à ces données."
    )
