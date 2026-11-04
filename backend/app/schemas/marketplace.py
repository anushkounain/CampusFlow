from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class ListingInquiryCreate(BaseModel):
    message: str


class ListingInquiryOut(BaseModel):
    id: int
    listing_id: int
    buyer_id: int
    message: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MarketplaceListingCreate(BaseModel):
    title: str
    description: str
    category: str = "Textbook"
    price: str = "Free"
    condition: str = "Good"
    contact_phone_or_email: Optional[str] = None


class MarketplaceListingOut(MarketplaceListingCreate):
    id: int
    seller_id: int
    status: str
    created_at: datetime
    inquiries: List[ListingInquiryOut] = []

    model_config = ConfigDict(from_attributes=True)
