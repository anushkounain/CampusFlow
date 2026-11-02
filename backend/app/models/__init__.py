from app.models.user import User, UserRole, StudentProfile, FacultyProfile
from app.models.academic import Course, Enrollment, TimetableSlot, Attendance, Assignment, Submission
from app.models.career import JobPosting, JobApplication
from app.models.community import Announcement, CampusEvent

__all__ = [
    "User",
    "UserRole",
    "StudentProfile",
    "FacultyProfile",
    "Course",
    "Enrollment",
    "TimetableSlot",
    "Attendance",
    "Assignment",
    "Submission",
    "JobPosting",
    "JobApplication",
    "Announcement",
    "CampusEvent",
]
