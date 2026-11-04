from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.marketplace import MarketplaceListing, ListingInquiry
from app.schemas.marketplace import (
    MarketplaceListingOut, MarketplaceListingCreate,
    ListingInquiryOut, ListingInquiryCreate
)
from app.services.audit_service import AuditService

router = APIRouter(prefix="/marketplace", tags=["Campus Marketplace"])


@router.get("/", response_model=List[MarketplaceListingOut])
def get_listings(
    category: Optional[str] = None,
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve items listed for sale, trade, or lost & found."""
    query = db.query(MarketplaceListing)
    if category and category != "All":
        query = query.filter(MarketplaceListing.category == category)
    if status_filter:
        query = query.filter(MarketplaceListing.status == status_filter)
    return query.order_by(MarketplaceListing.created_at.desc()).all()


@router.post("/", response_model=MarketplaceListingOut, status_code=status.HTTP_201_CREATED)
def create_listing(
    listing_in: MarketplaceListingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Publish a textbook, bicycle, electronics, or dorm equipment listing."""
    listing = MarketplaceListing(
        title=listing_in.title,
        description=listing_in.description,
        category=listing_in.category,
        price=listing_in.price,
        condition=listing_in.condition,
        seller_id=current_user.id,
        contact_phone_or_email=listing_in.contact_phone_or_email or current_user.email,
        status="available",
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)

    AuditService.log_event(
        db=db,
        action="MARKETPLACE_LISTING_CREATE",
        entity_type="MarketplaceListing",
        entity_id=str(listing.id),
        user_id=current_user.id,
    )
    return listing


@router.patch("/{listing_id}/status", response_model=MarketplaceListingOut)
def update_listing_status(
    listing_id: int,
    new_status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update listing availability status (available, reserved, sold)."""
    listing = db.query(MarketplaceListing).filter(MarketplaceListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.seller_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Only listing owner can change status")

    listing.status = new_status
    db.commit()
    db.refresh(listing)
    return listing


@router.post("/{listing_id}/inquiries", response_model=ListingInquiryOut, status_code=status.HTTP_201_CREATED)
def send_inquiry(
    listing_id: int,
    inquiry_in: ListingInquiryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a buyer inquiry or claim for a lost & found item."""
    listing = db.query(MarketplaceListing).filter(MarketplaceListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    inquiry = ListingInquiry(
        listing_id=listing_id,
        buyer_id=current_user.id,
        message=inquiry_in.message,
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry
