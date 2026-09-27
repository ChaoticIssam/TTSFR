from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.diagnostic import DiagnosticSubmission, DiagnosticStatus
from app.models.cooperative import Cooperative
from app.models.cluster import Cluster
from app.schemas.diagnostic import DiagnosticDraftSave, DiagnosticSubmitRequest, DiagnosticResponse
from app.services.scoring_engine import ScoringEngine

router = APIRouter()

@router.post("/draft/{cooperative_id}", response_model=DiagnosticResponse)
def save_diagnostic_draft(
    cooperative_id: UUID,
    payload: DiagnosticDraftSave,
    db: Session = Depends(get_db)
):
    """Auto-save diagnostic progress to prevent data loss on mobile."""
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
        # Merge answers
        updated_answers = dict(diag.answers or {})
        updated_answers.update(payload.answers)
        diag.answers = updated_answers

    db.commit()
    db.refresh(diag)
    return diag

@router.post("/submit/{cooperative_id}", response_model=DiagnosticResponse)
def submit_diagnostic(
    cooperative_id: UUID,
    payload: DiagnosticSubmitRequest,
    db: Session = Depends(get_db)
):
    """
    Submits the 5-step diagnostic, runs the scoring engine, and assigns a cluster.
    """
    evaluation = ScoringEngine.evaluate_diagnostic(payload.answers)

    # Find the assigned cluster by code
    cluster = db.query(Cluster).filter(Cluster.code == evaluation["cluster_code"]).first()
    cluster_id = cluster.id if cluster else None

    # Retrieve or create submission
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
        diag = DiagnosticSubmission(cooperative_id=cooperative_id)
        db.add(diag)

    diag.status = DiagnosticStatus.SUBMITTED
    diag.current_step = 5
    diag.answers = payload.answers
    diag.score_operational = evaluation["score_operational"]
    diag.score_economic = evaluation["score_economic"]
    diag.score_organizational = evaluation["score_organizational"]
    diag.score_tech_energy = evaluation["score_tech_energy"]
    diag.score_global = evaluation["score_global"]
    diag.cluster_id = cluster_id
    diag.rule_version = evaluation["rule_version"]

    db.commit()
    db.refresh(diag)
    return diag

@router.get("/cooperative/{cooperative_id}", response_model=DiagnosticResponse)
def get_latest_diagnostic(cooperative_id: UUID, db: Session = Depends(get_db)):
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
