from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=False)
    years_of_experience = Column(Integer, nullable=False)
    department = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    current_status = Column(String, default="Submitted")
    created_at = Column(DateTime, default=datetime.utcnow)
    resume_url = Column(String)

    statuses = relationship("StatusHistory", back_populates="candidate")

class StatusHistory(Base):
    __tablename__ = "status_history"
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    status = Column(String)
    feedback = Column(String)
    changed_at = Column(DateTime, default=datetime.utcnow)
    changed_by = Column(String)
    candidate = relationship("Candidate", back_populates="statuses")