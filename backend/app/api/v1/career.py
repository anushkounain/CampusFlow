from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user, require_roles
from app.models.user import User, UserRole
from app.models.career import JobPosting, JobApplication
from app.schemas.career import JobPostingOut, JobPostingCreate, JobApplicationOut, JobApplicationCreate

router = APIRouter(prefix="/career", tags=["Career & Placement"])


@router.get("/jobs", response_model=List[JobPostingOut])
def get_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all active placement opportunities and internships."""
    return db.query(JobPosting).filter(JobPosting.is_active == True).order_by(JobPosting.created_at.desc()).all()


@router.post("/jobs", response_model=JobPostingOut, status_code=status.HTTP_201_CREATED)
def create_job(
    job_in: JobPostingCreate,
    current_user: User = Depends(require_roles(UserRole.PLACEMENT_COORDINATOR, UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    """Post an internship or job opening (Placement Coordinator & Admin only)."""
    job = JobPosting(**job_in.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.post("/jobs/{job_id}/apply", response_model=JobApplicationOut)
def apply_for_job(
    job_id: int,
    app_in: JobApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Apply for a job or internship."""
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job opening not found")

    existing = db.query(JobApplication).filter(
        JobApplication.job_id == job_id,
        JobApplication.student_id == current_user.id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this opening")

    app_record = JobApplication(
        job_id=job_id,
        student_id=current_user.id,
        status="Under Review",
        notes=app_in.notes or "Candidate submitted verified profile",
    )
    db.add(app_record)
    db.commit()
    db.refresh(app_record)
    return app_record


@router.get("/my-applications", response_model=List[JobApplicationOut])
def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List jobs applied to by the current student."""
    return db.query(JobApplication).filter(JobApplication.student_id == current_user.id).all()
