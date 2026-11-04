from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class DocumentChunkOut(BaseModel):
    id: int
    chunk_index: int
    page_number: int
    content: str
    token_count: int
    keywords: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class DocumentCreate(BaseModel):
    title: str
    filename: str
    course_id: Optional[int] = None
    summary: Optional[str] = None
    page_count: int = 1
    content_text: str  # Raw extracted text to chunk and index


class DocumentOut(BaseModel):
    id: int
    title: str
    filename: str
    file_size_bytes: int
    mime_type: str
    course_id: Optional[int] = None
    summary: Optional[str] = None
    page_count: int
    created_at: datetime
    chunks: List[DocumentChunkOut] = []

    model_config = ConfigDict(from_attributes=True)


class RAGQueryRequest(BaseModel):
    query: str
    course_id: Optional[int] = None
    top_k: int = 3


class RAGQueryResult(BaseModel):
    query: str
    answer: str
    sources: List[dict]


class FlashcardCardOut(BaseModel):
    id: int
    front: str
    back: str
    difficulty: str
    reviews_count: int

    model_config = ConfigDict(from_attributes=True)


class FlashcardDeckCreate(BaseModel):
    title: str
    topic: str
    description: Optional[str] = None
    cards: List[dict] = []  # [{"front": "...", "back": "...", "difficulty": "medium"}]


class FlashcardDeckOut(BaseModel):
    id: int
    title: str
    topic: str
    description: Optional[str] = None
    created_at: datetime
    cards: List[FlashcardCardOut] = []

    model_config = ConfigDict(from_attributes=True)


class QuizRecordCreate(BaseModel):
    topic: str
    score: float
    total_questions: int
    percentage: float


class QuizRecordOut(QuizRecordCreate):
    id: int
    completed_at: datetime

    model_config = ConfigDict(from_attributes=True)
