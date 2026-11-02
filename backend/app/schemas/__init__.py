from app.schemas.auth import LoginRequest, RegisterRequest, Token, TokenPayload
from app.schemas.user import UserOut, UserUpdate, StudentProfileOut, FacultyProfileOut
from app.schemas.academic import (
    CourseOut, CourseCreate, AttendanceOut, TimetableSlotOut,
    AssignmentOut, AssignmentCreate, SubmissionOut, SubmissionCreate
)
from app.schemas.career import JobPostingOut, JobPostingCreate, JobApplicationOut, JobApplicationCreate
from app.schemas.community import AnnouncementOut, AnnouncementCreate, CampusEventOut, CampusEventCreate

__all__ = [
    "LoginRequest",
    "RegisterRequest",
    "Token",
    "TokenPayload",
    "UserOut",
    "UserUpdate",
    "StudentProfileOut",
    "FacultyProfileOut",
    "CourseOut",
    "CourseCreate",
    "AttendanceOut",
    "TimetableSlotOut",
    "AssignmentOut",
    "AssignmentCreate",
    "SubmissionOut",
    "SubmissionCreate",
    "JobPostingOut",
    "JobPostingCreate",
    "JobApplicationOut",
    "JobApplicationCreate",
    "AnnouncementOut",
    "AnnouncementCreate",
    "CampusEventOut",
    "CampusEventCreate",
]
