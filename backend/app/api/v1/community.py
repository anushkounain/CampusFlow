from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user, require_roles
from app.models.user import User, UserRole
from app.models.community import Announcement, CampusEvent
from app.schemas.community import AnnouncementOut, AnnouncementCreate, CampusEventOut, CampusEventCreate

router = APIRouter(prefix="/community", tags=["Campus Community"])


@router.get("/announcements", response_model=List[AnnouncementOut])
def get_announcements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve university-wide official announcements."""
    return db.query(Announcement).order_by(Announcement.created_at.desc()).all()


@router.post("/announcements", response_model=AnnouncementOut, status_code=status.HTTP_201_CREATED)
def create_announcement(
    ann_in: AnnouncementCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.FACULTY, UserRole.PLACEMENT_COORDINATOR)),
    db: Session = Depends(get_db),
):
    """Post an announcement across the campus."""
    ann = Announcement(**ann_in.model_dump(), author_id=current_user.id)
    db.add(ann)
    db.commit()
    db.refresh(ann)
    return ann


@router.get("/events", response_model=List[CampusEventOut])
def get_campus_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve upcoming campus cultural, tech and sporting events."""
    return db.query(CampusEvent).order_by(CampusEvent.event_date.asc()).all()


@router.post("/events", response_model=CampusEventOut, status_code=status.HTTP_201_CREATED)
def create_campus_event(
    event_in: CampusEventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a campus event."""
    event = CampusEvent(**event_in.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event
