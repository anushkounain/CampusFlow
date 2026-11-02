from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class AnnouncementCreate(BaseModel):
    title: str
    content: str
    category: str = "General"


class AnnouncementOut(AnnouncementCreate):
    id: int
    author_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CampusEventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: str
    location: str
    organizer_club: str = "Student Council"
    registration_link: Optional[str] = None


class CampusEventOut(CampusEventCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
