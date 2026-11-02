from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user, require_roles
from app.models.user import User, UserRole
from app.models.academic import Course, Enrollment, TimetableSlot, Attendance, Assignment, Submission
from app.schemas.academic import (
    CourseOut, CourseCreate, AttendanceOut, TimetableSlotOut,
    AssignmentOut, AssignmentCreate, SubmissionOut, SubmissionCreate
)

router = APIRouter(prefix="/academics", tags=["Academics"])


@router.get("/courses", response_model=List[CourseOut])
def get_courses(
    department: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all available academic courses."""
    query = db.query(Course)
    if department:
        query = query.filter(Course.department == department)
    return query.all()


@router.post("/courses", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(
    course_in: CourseCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.FACULTY)),
    db: Session = Depends(get_db),
):
    """Create a new academic course (Admin & Faculty only)."""
    existing = db.query(Course).filter(Course.code == course_in.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Course code already registered")

    course = Course(**course_in.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.get("/timetable", response_model=List[TimetableSlotOut])
def get_timetable(
    day: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve weekly class schedule timetable."""
    query = db.query(TimetableSlot)
    if day:
        query = query.filter(TimetableSlot.day_of_week == day)
    return query.order_by(TimetableSlot.start_time).all()


@router.get("/attendance", response_model=List[AttendanceOut])
def get_student_attendance(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve attendance records for current student."""
    records = db.query(Attendance).filter(Attendance.student_id == current_user.id).all()
    # Populate course_name for clarity
    results = []
    for r in records:
        out = AttendanceOut(
            id=r.id,
            course_id=r.course_id,
            course_name=r.course.name if r.course else "Course",
            date=r.date,
            status=r.status,
        )
        results.append(out)
    return results


@router.get("/assignments", response_model=List[AssignmentOut])
def get_assignments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve pending and active assignments."""
    return db.query(Assignment).order_by(Assignment.due_date.asc()).all()


@router.post("/assignments", response_model=AssignmentOut, status_code=status.HTTP_201_CREATED)
def create_assignment(
    assignment_in: AssignmentCreate,
    current_user: User = Depends(require_roles(UserRole.FACULTY, UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    """Create a new course assignment (Faculty & Admin only)."""
    assignment = Assignment(**assignment_in.model_dump())
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.post("/assignments/{assignment_id}/submit", response_model=SubmissionOut)
def submit_assignment(
    assignment_id: int,
    submission_in: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a solution to an assignment."""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    submission = Submission(
        assignment_id=assignment_id,
        student_id=current_user.id,
        submission_text=submission_in.submission_text,
        submitted_at=datetime.now(timezone.utc),
        status="submitted",
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.get("/summary")
def get_academic_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Aggregated academic metrics for student dashboard."""
    total_courses = db.query(Course).count()
    total_assignments = db.query(Assignment).count()
    student_profile = current_user.student_profile

    return {
        "cgpa": student_profile.cgpa if student_profile else 8.75,
        "attendance_rate": student_profile.attendance_percentage if student_profile else 92.5,
        "credits_completed": student_profile.credits_completed if student_profile else 74,
        "total_credits": student_profile.total_credits if student_profile else 160,
        "enrolled_courses_count": total_courses,
        "pending_assignments_count": total_assignments,
    }
