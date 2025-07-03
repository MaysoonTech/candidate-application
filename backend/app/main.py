from fastapi import FastAPI, Depends, File, UploadFile, HTTPException, Header, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
from app import crud, models, schemas
from app.database import SessionLocal, engine
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],                    # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],                   # Allow all headers including "X-ADMIN"
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/v1/candidates/", response_model=schemas.CandidateOut)
async def register_candidate(
    full_name: str = Form(...),
    date_of_birth: str = Form(...),
    years_of_experience: int = Form(...),
    department: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_location = f"{UPLOAD_DIR}/{full_name}-{resume.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(resume.file.read())
    
    return crud.create_candidate(db, {
        "full_name": full_name,
        "date_of_birth": date_of_birth,
        "years_of_experience": years_of_experience,
        "department": department,
        "email": email,
        "phone": phone,
        "current_status": "Submitted",
        "resume_url": f"{file_location}"
    })

@app.get("/api/v1/candidates/{candidate_id}/status", response_model=List[schemas.StatusOut])
async def get_status(candidate_id: int, db: Session = Depends(get_db)):
    return crud.get_statuses(db, candidate_id)

@app.get("/api/v1/admin/candidates/")
async def list_candidates(skip: int = 0, limit: int = 10, department: str = None, x_admin: str = Header(None), db: Session = Depends(get_db)):
    if not x_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return crud.list_candidates(db, skip, limit, department)

@app.post("/api/v1/admin/candidates/{candidate_id}/status", response_model=schemas.StatusOut)
async def update_status(candidate_id: int, status_update: schemas.StatusUpdate, x_admin: str = Header(None), db: Session = Depends(get_db)):
    if not x_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return crud.update_status(db, candidate_id, status_update.status, status_update.feedback or "", "admin_1")

@app.get("/api/v1/admin/candidates/{candidate_id}/resume")
async def download_resume(candidate_id: int, x_admin: str = Header(None), db: Session = Depends(get_db)):
    if not x_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    candidate = crud.get_candidate(db, candidate_id)
    return FileResponse(f"{candidate.resume_url}")