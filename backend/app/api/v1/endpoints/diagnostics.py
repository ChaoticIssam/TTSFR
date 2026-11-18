from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified

from app.core.database import get_db
from app.core.security import (
    get_current_active_user,
    get_current_cooperative_user,
    require_roles,
    verify_cooperative_access,
)
from app.models import DiagnosticSubmission, DiagnosticStatus, Cooperative, Cluster, User, UserRole, Sector, SubSector
from app.schemas.diagnostic import (
    DiagnosticDraftSave,
    DiagnosticSubmitRequest,
    AccompagnementUpdateRequest,
    DiagnosticResponse,
)
from app.services.scoring_engine import ScoringEngine

router = APIRouter()


def _sync_cooperative_sector_from_answers(db: Session, cooperative_id: UUID, answers: dict) -> None:
    if not answers:
        return
    coop = db.query(Cooperative).filter(Cooperative.id == cooperative_id).first()
    if not coop:
        return
    sector_code = answers.get("sector_code")
    sub_sector_code = answers.get("sub_sector_code")
    if sector_code:
        sec = db.query(Sector).filter(Sector.code == str(sector_code)).first()
        if sec:
            coop.sector_id = sec.id
    if sub_sector_code:
        sub = db.query(SubSector).filter(SubSector.code == str(sub_sector_code)).first()
        if sub:
            coop.sub_sector_id = sub.id
            if not coop.sector_id:
                coop.sector_id = sub.sector_id

@router.get("", response_model=List[DiagnosticResponse])
@router.get("/", response_model=List[DiagnosticResponse], include_in_schema=False)
def list_all_diagnostics(
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.EXPERT)),
    db: Session = Depends(get_db)
):
    """
    Administrative list of all diagnostic submissions. Accessible only by TTSFR staff.
    """
    return db.query(DiagnosticSubmission).order_by(DiagnosticSubmission.created_at.desc()).all()

@router.post("/draft/{cooperative_id}", response_model=DiagnosticResponse)
def save_diagnostic_draft(
    cooperative_id: UUID,
    payload: DiagnosticDraftSave,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Auto-save diagnostic progress.
    Guarded by strict tenant isolation (Cooperative A cannot write to Cooperative B).
    Never overwrites or shadows an already SUBMITTED diagnostic status.
    """
    verify_cooperative_access(cooperative_id, current_user)

    submitted_diag = (
        db.query(DiagnosticSubmission)
        .filter(
            DiagnosticSubmission.cooperative_id == cooperative_id,
            DiagnosticSubmission.status == DiagnosticStatus.SUBMITTED,
        )
        .order_by(DiagnosticSubmission.created_at.desc())
        .first()
    )

    if submitted_diag:
        # Remove any stray DRAFT rows that would shadow the submitted diagnostic
        db.query(DiagnosticSubmission).filter(
            DiagnosticSubmission.cooperative_id == cooperative_id,
            DiagnosticSubmission.status == DiagnosticStatus.DRAFT,
        ).delete(synchronize_session=False)
        db.commit()
        db.refresh(submitted_diag)
        return submitted_diag

    diag = (
        db.query(DiagnosticSubmission)
        .filter(
            DiagnosticSubmission.cooperative_id == cooperative_id,
            DiagnosticSubmission.status == DiagnosticStatus.DRAFT,
        )
        .order_by(DiagnosticSubmission.created_at.desc())
        .first()
    )

    if not diag:
        diag = DiagnosticSubmission(
            cooperative_id=cooperative_id,
            current_step=payload.current_step,
            answers=payload.answers,
            status=DiagnosticStatus.DRAFT,
        )
        db.add(diag)
    else:
        diag.current_step = payload.current_step
        updated_answers = dict(diag.answers or {})
        updated_answers.update(payload.answers)
        diag.answers = updated_answers
        flag_modified(diag, "answers")

    db.commit()
    db.refresh(diag)
    return diag

@router.post("/submit/{cooperative_id}", response_model=DiagnosticResponse)
def submit_diagnostic(
    cooperative_id: UUID,
    payload: DiagnosticSubmitRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Submits the 5-step diagnostic, calculates scores and assigns cluster.
    Guarded by strict tenant isolation.
    """
    verify_cooperative_access(cooperative_id, current_user)

    try:
        evaluation = ScoringEngine.evaluate_diagnostic(payload.answers)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        )

    cluster = db.query(Cluster).filter(Cluster.code == evaluation["cluster_code"]).first()
    cluster_id = cluster.id if cluster else None

    rows = (
        db.query(DiagnosticSubmission)
        .filter(DiagnosticSubmission.cooperative_id == cooperative_id)
        .order_by(DiagnosticSubmission.created_at.asc())
        .all()
    )
    diag = next((r for r in rows if r.status == DiagnosticStatus.SUBMITTED), rows[0] if rows else None)
    for r in rows:
        if r is not diag:
            db.delete(r)

    if not diag:
        diag = DiagnosticSubmission(cooperative_id=cooperative_id)
        db.add(diag)

    existing_answers = dict(diag.answers or {})
    diag.status = DiagnosticStatus.SUBMITTED
    diag.current_step = 5
    enriched_answers = {
        k: v for k, v in (payload.answers or {}).items()
        if k not in ("cluster_compatibilities", "cluster_code")
    }
    if "checklist_entries" in existing_answers and "checklist_entries" not in enriched_answers:
        enriched_answers["checklist_entries"] = existing_answers["checklist_entries"]
    if "impact_entries" in existing_answers and "impact_entries" not in enriched_answers:
        enriched_answers["impact_entries"] = existing_answers["impact_entries"]

    enriched_answers["cluster_compatibilities"] = {
        (k.value if hasattr(k, "value") else str(k)): v
        for k, v in evaluation["cluster_compatibilities"].items()
    }
    enriched_answers["cluster_code"] = (
        evaluation["cluster_code"].value
        if hasattr(evaluation["cluster_code"], "value")
        else str(evaluation["cluster_code"])
    )
    diag.answers = enriched_answers
    flag_modified(diag, "answers")
    diag.score_operational = evaluation["score_operational"]
    diag.score_economic = evaluation["score_economic"]
    diag.score_organizational = evaluation["score_organizational"]
    diag.score_tech_energy = evaluation["score_tech_energy"]
    diag.score_global = evaluation["score_global"]
    diag.cluster_id = cluster_id
    diag.rule_version = evaluation["rule_version"]

    _sync_cooperative_sector_from_answers(db, cooperative_id, enriched_answers)

    db.commit()
    db.refresh(diag)
    return diag

@router.get("/cooperative/{cooperative_id}", response_model=DiagnosticResponse)
def get_latest_diagnostic(
    cooperative_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves latest diagnostic for a cooperative, prioritizing SUBMITTED diagnostics
    and cleaning up any accidental leftover DRAFT rows that would shadow it.
    Guarded by strict tenant isolation.
    """
    verify_cooperative_access(cooperative_id, current_user)

    submitted_diag = (
        db.query(DiagnosticSubmission)
        .filter(
            DiagnosticSubmission.cooperative_id == cooperative_id,
            DiagnosticSubmission.status == DiagnosticStatus.SUBMITTED,
        )
        .order_by(DiagnosticSubmission.created_at.desc())
        .first()
    )
    if submitted_diag:
        leftover_drafts = (
            db.query(DiagnosticSubmission)
            .filter(
                DiagnosticSubmission.cooperative_id == cooperative_id,
                DiagnosticSubmission.status == DiagnosticStatus.DRAFT,
            )
            .all()
        )
        if leftover_drafts:
            for d in leftover_drafts:
                db.delete(d)
            db.commit()
            db.refresh(submitted_diag)
        return submitted_diag

    diag = (
        db.query(DiagnosticSubmission)
        .filter(DiagnosticSubmission.cooperative_id == cooperative_id)
        .order_by(DiagnosticSubmission.created_at.desc())
        .first()
    )
    if not diag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucun diagnostic trouvé pour cette coopérative",
        )
    return diag

# Self-service convenience endpoints for the authenticated cooperative
@router.post("/my-draft", response_model=DiagnosticResponse)
def save_my_draft(
    payload: DiagnosticDraftSave,
    current_user: User = Depends(get_current_cooperative_user),
    db: Session = Depends(get_db)
):
    return save_diagnostic_draft(
        cooperative_id=current_user.cooperative.id,
        payload=payload,
        current_user=current_user,
        db=db
    )

@router.post("/my-submit", response_model=DiagnosticResponse)
def submit_my_diagnostic(
    payload: DiagnosticSubmitRequest,
    current_user: User = Depends(get_current_cooperative_user),
    db: Session = Depends(get_db)
):
    return submit_diagnostic(
        cooperative_id=current_user.cooperative.id,
        payload=payload,
        current_user=current_user,
        db=db
    )

@router.get("/my-latest", response_model=DiagnosticResponse)
def get_my_latest_diagnostic(
    current_user: User = Depends(get_current_cooperative_user),
    db: Session = Depends(get_db)
):
    return get_latest_diagnostic(
        cooperative_id=current_user.cooperative.id,
        current_user=current_user,
        db=db
    )

@router.post("/my-accompagnement", response_model=DiagnosticResponse)
def save_my_accompagnement(
    payload: AccompagnementUpdateRequest,
    current_user: User = Depends(get_current_cooperative_user),
    db: Session = Depends(get_db)
):
    """
    Persists the cooperative's personalized accompaniment checklist entries (L001..L099)
    and impact tracker values (KPI, KVI, KWI) inside the latest diagnostic record.
    """
    diag = (
        db.query(DiagnosticSubmission)
        .filter(DiagnosticSubmission.cooperative_id == current_user.cooperative.id)
        .order_by(DiagnosticSubmission.created_at.desc())
        .first()
    )
    if not diag:
        diag = DiagnosticSubmission(
            cooperative_id=current_user.cooperative.id,
            status=DiagnosticStatus.DRAFT,
            current_step=1,
            answers={},
        )
        db.add(diag)

    updated_answers = dict(diag.answers or {})
    if payload.checklist_entries is not None:
        updated_answers["checklist_entries"] = payload.checklist_entries
    if payload.impact_entries is not None:
        updated_answers["impact_entries"] = payload.impact_entries

    diag.answers = updated_answers
    flag_modified(diag, "answers")
    db.commit()
    db.refresh(diag)
    return diag
