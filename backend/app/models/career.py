from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base


class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(150), nullable=False)
    role_title = Column(String(150), nullable=False)
    job_type = Column(String(50), default="Internship", nullable=False)  # Internship, Full-time
    location = Column(String(100), default="Bangalore / Hybrid", nullable=False)
    stipend_or_salary = Column(String(100), default="Competitive", nullable=False)
    deadline = Column(String(50), nullable=True)
    requirements = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_postings.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    applied_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    status = Column(String(50), default="Under Review", nullable=False)  # Under Review, Shortlisted, Interview, Accepted, Rejected
    notes = Column(Text, nullable=True)

    job = relationship("JobPosting", back_populates="applications")
    student = relationship("User", back_populates="job_applications")


class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String(100), nullable=False)
    proficiency = Column(String(50), default="Intermediate", nullable=False)  # Beginner, Intermediate, Advanced, Expert
    years_experience = Column(Integer, default=1, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    student = relationship("User")


class InterviewPrepQuestion(Base):
    __tablename__ = "interview_prep_questions"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(100), default="General Tech", nullable=False, index=True)
    role_category = Column(String(100), default="Software Engineering", nullable=False)  # Software, Data, DevOps, Product
    question_text = Column(Text, nullable=False)
    difficulty = Column(String(30), default="Medium", nullable=False)  # Easy, Medium, Hard
    recommended_approach = Column(Text, nullable=True)
    sample_code_or_answer = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
