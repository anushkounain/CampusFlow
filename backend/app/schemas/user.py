from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr
from app.models.user import UserRole


class StudentProfileOut(BaseModel):
    id: int
    roll_number: str
    semester: int
    program: str
    cgpa: float
    attendance_percentage: float
    credits_completed: int
    total_credits: int

    model_config = ConfigDict(from_attributes=True)


class FacultyProfileOut(BaseModel):
    id: int
    employee_id: str
    designation: str
    specialization: Optional[str] = None
    office_room: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: UserRole
    department: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    student_profile: Optional[StudentProfileOut] = None
    faculty_profile: Optional[FacultyProfileOut] = None

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
