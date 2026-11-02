from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class TimetableSlotOut(BaseModel):
    id: int
    day_of_week: str
    start_time: str
    end_time: str
    room: str

    model_config = ConfigDict(from_attributes=True)


class CourseBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    credits: int = 3
    department: str
    semester: int = 1
    faculty_name: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseOut(CourseBase):
    id: int
    timetable_slots: List[TimetableSlotOut] = []

    model_config = ConfigDict(from_attributes=True)


class AttendanceOut(BaseModel):
    id: int
    course_id: int
    course_name: Optional[str] = None
    date: str
    status: str

    model_config = ConfigDict(from_attributes=True)


class AssignmentCreate(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    due_date: datetime
    max_marks: int = 100


class AssignmentOut(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str] = None
    due_date: datetime
    max_marks: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SubmissionCreate(BaseModel):
    submission_text: str


class SubmissionOut(BaseModel):
    id: int
    assignment_id: int
    student_id: int
    submission_text: Optional[str] = None
    submitted_at: datetime
    marks_obtained: Optional[float] = None
    feedback: Optional[str] = None
    status: str

    model_config = ConfigDict(from_attributes=True)
