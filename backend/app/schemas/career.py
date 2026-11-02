from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class JobPostingCreate(BaseModel):
    company_name: str
    role_title: str
    job_type: str = "Internship"
    location: str = "Bangalore / Hybrid"
    stipend_or_salary: str = "Competitive"
    deadline: Optional[str] = None
    requirements: Optional[str] = None


class JobPostingOut(JobPostingCreate):
    id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class JobApplicationCreate(BaseModel):
    notes: Optional[str] = None


class JobApplicationOut(BaseModel):
    id: int
    job_id: int
    student_id: int
    applied_at: datetime
    status: str
    notes: Optional[str] = None
    job: Optional[JobPostingOut] = None

    model_config = ConfigDict(from_attributes=True)
