from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CandidateCreate(BaseModel):
    full_name: str
    date_of_birth: str
    years_of_experience: int
    department: str
    email: str
    phone: str

class CandidateOut(CandidateCreate):
    id: int
    current_status: str
    created_at: datetime
    resume_url: str

    class Config:
        orm_mode = True

class StatusUpdate(BaseModel):
    status: str
    feedback: Optional[str] = None

class StatusOut(StatusUpdate):
    id: int
    candidate_id: int
    changed_at: datetime
    changed_by: str

    class Config:
        orm_mode = True