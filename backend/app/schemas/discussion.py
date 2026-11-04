from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class DiscussionCommentCreate(BaseModel):
    content: str


class DiscussionCommentOut(BaseModel):
    id: int
    thread_id: int
    author_id: int
    content: str
    is_solution: bool
    upvotes: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DiscussionThreadCreate(BaseModel):
    title: str
    content: str
    course_id: Optional[int] = None
    tags: Optional[str] = "General"


class DiscussionThreadOut(BaseModel):
    id: int
    course_id: Optional[int] = None
    author_id: int
    title: str
    content: str
    tags: str
    upvotes: int
    views: int
    is_resolved: bool
    created_at: datetime
    comments: List[DiscussionCommentOut] = []

    model_config = ConfigDict(from_attributes=True)


class StudyGroupCreate(BaseModel):
    name: str
    course_id: Optional[int] = None
    description: Optional[str] = None
    meeting_schedule: Optional[str] = "Wednesdays 5:00 PM"
    meeting_link: Optional[str] = None
    max_members: int = 8


class StudyGroupOut(BaseModel):
    id: int
    name: str
    course_id: Optional[int] = None
    description: Optional[str] = None
    meeting_schedule: str
    meeting_link: Optional[str] = None
    max_members: int
    created_by_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
