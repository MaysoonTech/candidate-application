from sqlalchemy.orm import Session
from app.models import Candidate, StatusHistory
from app.schemas import CandidateCreate, StatusUpdate

def create_candidate(db: Session, candidate_data: dict):
    print("=================== create_candidate ====================")
    db_candidate = Candidate(**candidate_data)
    print(db_candidate)
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)

    db_status = StatusHistory(
        candidate_id=db_candidate.id,
        status="Submitted",
        feedback=None,
        changed_by="system"
    )
    db.add(db_status)
    db.commit()
    return db_candidate

def get_candidate(db: Session, candidate_id: int):
    return db.query(Candidate).filter(Candidate.id == candidate_id).first()

def get_statuses(db: Session, candidate_id: int):
    return db.query(StatusHistory).filter(StatusHistory.candidate_id == candidate_id).all()

def list_candidates(db: Session, skip: int, limit: int, department: str):
    query = db.query(Candidate)
    if department:
        query = query.filter(Candidate.department == department)
    return query.offset(skip).limit(limit).all()

def update_status(db: Session, candidate_id: int, status: str, feedback: str, changed_by: str):
    db_status = StatusHistory(
        candidate_id=candidate_id,
        status=status,
        feedback=feedback,
        changed_by=changed_by
    )
    db.add(db_status)
    db.commit()
    db.refresh(db_status)

    candidate = get_candidate(db, candidate_id)
    candidate.current_status = status
    db.commit()
    return db_status