from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base


class MarketplaceListing(Base):
    __tablename__ = "marketplace_listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), default="Textbook", nullable=False, index=True)  # Textbook, Electronics, Bicycle, Dorm, Lost & Found
    price = Column(String(50), default="Free", nullable=False)
    condition = Column(String(50), default="Good", nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(30), default="available", nullable=False, index=True)  # available, reserved, sold
    contact_phone_or_email = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    seller = relationship("User")
    inquiries = relationship("ListingInquiry", back_populates="listing", cascade="all, delete-orphan")


class ListingInquiry(Base):
    __tablename__ = "listing_inquiries"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("marketplace_listings.id", ondelete="CASCADE"), nullable=False, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    listing = relationship("MarketplaceListing", back_populates="inquiries")
    buyer = relationship("User")
