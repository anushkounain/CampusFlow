from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.discussion import DiscussionThread, DiscussionComment, StudyGroup, StudyGroupMember
from app.schemas.discussion import (
    DiscussionThreadOut, DiscussionThreadCreate,
    DiscussionCommentOut, DiscussionCommentCreate,
    StudyGroupOut, StudyGroupCreate
)
from app.services.audit_service import AuditService

router = APIRouter(prefix="/discussions", tags=["Discussions & Study Groups"])


@router.get("/", response_model=List[DiscussionThreadOut])
def get_threads(
    course_id: Optional[int] = None,
    tag: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List campus academic discussions and student queries."""
    query = db.query(DiscussionThread)
    if course_id:
        query = query.filter(DiscussionThread.course_id == course_id)
    if tag:
        query = query.filter(DiscussionThread.tags.contains(tag))
    return query.order_by(DiscussionThread.created_at.desc()).all()


@router.post("/", response_model=DiscussionThreadOut, status_code=status.HTTP_201_CREATED)
def create_thread(
    thread_in: DiscussionThreadCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Post an academic inquiry or project discussion thread."""
    thread = DiscussionThread(
        author_id=current_user.id,
        course_id=thread_in.course_id,
        title=thread_in.title,
        content=thread_in.content,
        tags=thread_in.tags or "General",
    )
    db.add(thread)
    db.commit()
    db.refresh(thread)

    AuditService.log_event(
        db=db,
        action="THREAD_CREATE",
        entity_type="DiscussionThread",
        entity_id=str(thread.id),
        user_id=current_user.id,
    )
    return thread


@router.get("/{thread_id}", response_model=DiscussionThreadOut)
def get_thread_by_id(
    thread_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve full discussion thread including all community comments and responses."""
    thread = db.query(DiscussionThread).filter(DiscussionThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Discussion thread not found")
    thread.views += 1
    db.commit()
    db.refresh(thread)
    return thread


@router.post("/{thread_id}/comments", response_model=DiscussionCommentOut, status_code=status.HTTP_201_CREATED)
def add_comment(
    thread_id: int,
    comment_in: DiscussionCommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Post an answer or commentary on a discussion thread."""
    thread = db.query(DiscussionThread).filter(DiscussionThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Discussion thread not found")

    comment = DiscussionComment(
        thread_id=thread_id,
        author_id=current_user.id,
        content=comment_in.content,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@router.post("/{thread_id}/upvote")
def upvote_thread(
    thread_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upvote an insightful academic discussion."""
    thread = db.query(DiscussionThread).filter(DiscussionThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Discussion thread not found")
    thread.upvotes += 1
    db.commit()
    return {"upvotes": thread.upvotes}


@router.get("/study-groups/all", response_model=List[StudyGroupOut])
def list_study_groups(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List active student study circles and preparation groups."""
    return db.query(StudyGroup).all()


@router.post("/study-groups/create", response_model=StudyGroupOut, status_code=status.HTTP_201_CREATED)
def create_study_group(
    group_in: StudyGroupCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new peer study group for collaborative learning."""
    group = StudyGroup(
        name=group_in.name,
        course_id=group_in.course_id,
        description=group_in.description,
        meeting_schedule=group_in.meeting_schedule,
        meeting_link=group_in.meeting_link,
        max_members=group_in.max_members,
        created_by_id=current_user.id,
    )
    db.add(group)
    db.flush()

    member = StudyGroupMember(group_id=group.id, user_id=current_user.id)
    db.add(member)
    db.commit()
    db.refresh(group)
    return group
