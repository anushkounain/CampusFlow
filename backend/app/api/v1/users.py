from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user, require_roles
from app.models.user import User, UserRole
from app.models.academic import Course, Assignment
from app.models.career import JobPosting
from app.schemas.user import UserOut

router = APIRouter(prefix="/users", tags=["Users & Management"])


@router.get("/", response_model=List[UserOut])
def list_users(
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.FACULTY)),
    db: Session = Depends(get_db),
):
    """List registered users (Admin and Faculty only)."""
    return db.query(User).all()


@router.get("/dashboard-stats")
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve system overview metrics tailored for administrative and executive roles."""
    total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()
    total_faculty = db.query(User).filter(User.role == UserRole.FACULTY).count()
    total_courses = db.query(Course).count()
    total_assignments = db.query(Assignment).count()
    active_jobs = db.query(JobPosting).filter(JobPosting.is_active == True).count()

    return {
        "total_students": total_students,
        "total_faculty": total_faculty,
        "total_courses": total_courses,
        "total_assignments": total_assignments,
        "active_jobs": active_jobs,
        "current_user_role": current_user.role.value,
        "current_user_name": current_user.full_name,
    }
