from app.models.user import User, UserRole, StudentProfile, FacultyProfile
from app.models.academic import Course, Enrollment, TimetableSlot, Attendance, Assignment, Submission, GradeRecord
from app.models.career import JobPosting, JobApplication, StudentSkill, InterviewPrepQuestion
from app.models.community import Announcement, CampusEvent
from app.models.document import Document, DocumentChunk, FlashcardDeck, FlashcardCard, QuizRecord
from app.models.discussion import DiscussionThread, DiscussionComment, StudyGroup, StudyGroupMember
from app.models.marketplace import MarketplaceListing, ListingInquiry
from app.models.audit import AuditLog

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
    "GradeRecord",
    "JobPosting",
    "JobApplication",
    "StudentSkill",
    "InterviewPrepQuestion",
    "Announcement",
    "CampusEvent",
    "Document",
    "DocumentChunk",
    "FlashcardDeck",
    "FlashcardCard",
    "QuizRecord",
    "DiscussionThread",
    "DiscussionComment",
    "StudyGroup",
    "StudyGroupMember",
    "MarketplaceListing",
    "ListingInquiry",
    "AuditLog",
]
