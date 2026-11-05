from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.security import (
    get_current_active_user,
    get_current_cooperative_user,
    require_roles,
    verify_cooperative_access,
)
from app.models import User, Cooperative, UserRole, Sector, SubSector
from app.schemas.cooperative import CooperativeResponse, CooperativeUpdate

router = APIRouter()

@router.get("/me", response_model=CooperativeResponse)
def get_my_cooperative_profile(
    current_user: User = Depends(get_current_cooperative_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves the complete profile of the currently authenticated cooperative.
    """
    coop = (
        db.query(Cooperative)
        .options(
            joinedload(Cooperative.sector),
            joinedload(Cooperative.sub_sector)
        )
        .filter(Cooperative.id == current_user.cooperative.id)
        .first()
    )
    if not coop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil de coopérative introuvable."
        )
    return coop

@router.put("/me", response_model=CooperativeResponse)
def update_my_cooperative_profile(
    payload: CooperativeUpdate,
    current_user: User = Depends(get_current_cooperative_user),
    db: Session = Depends(get_db)
):
    """
    Updates the profile information for the authenticated cooperative.
    """
    coop = (
        db.query(Cooperative)
        .filter(Cooperative.id == current_user.cooperative.id)
        .first()
    )
    if not coop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil de coopérative introuvable."
        )

    # Validate sector if provided
    if payload.sector_id is not None:
        sector_exists = db.query(Sector).filter(Sector.id == payload.sector_id).first()
        if not sector_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Secteur ODCO spécifié invalide."
            )
        coop.sector_id = payload.sector_id

    # Validate sub-sector if provided
    if payload.sub_sector_id is not None:
        sub_sector_exists = db.query(SubSector).filter(SubSector.id == payload.sub_sector_id).first()
        if not sub_sector_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sous-secteur ODCO spécifié invalide."
            )
        coop.sub_sector_id = payload.sub_sector_id

    # Update provided scalar & JSONB attributes
    update_data = payload.model_dump(exclude_unset=True, exclude={"sector_id", "sub_sector_id"})
    for field, value in update_data.items():
        setattr(coop, field, value)

    db.commit()
    db.refresh(coop)

    # Re-query with relationships loaded
    return (
        db.query(Cooperative)
        .options(
            joinedload(Cooperative.sector),
            joinedload(Cooperative.sub_sector)
        )
        .filter(Cooperative.id == coop.id)
        .first()
    )

@router.get("/", response_model=List[CooperativeResponse])
def list_cooperatives(
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.EXPERT)),
    db: Session = Depends(get_db)
):
    """
    Administrative list of all pilot cooperatives. Accessible only by TTSFR staff.
    """
    return (
        db.query(Cooperative)
        .options(
            joinedload(Cooperative.sector),
            joinedload(Cooperative.sub_sector)
        )
        .order_by(Cooperative.name.asc())
        .all()
    )

@router.get("/{cooperative_id}", response_model=CooperativeResponse)
def get_cooperative_by_id(
    cooperative_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves cooperative profile with strict multi-tenant access check.
    """
    verify_cooperative_access(cooperative_id, current_user)

    coop = (
        db.query(Cooperative)
        .options(
            joinedload(Cooperative.sector),
            joinedload(Cooperative.sub_sector)
        )
        .filter(Cooperative.id == cooperative_id)
        .first()
    )
    if not coop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coopérative introuvable."
        )
    return coop
