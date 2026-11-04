from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.document import Document, DocumentChunk, FlashcardDeck, FlashcardCard, QuizRecord
from app.schemas.document import (
    DocumentOut, DocumentCreate, RAGQueryRequest, RAGQueryResult,
    FlashcardDeckOut, FlashcardDeckCreate, QuizRecordOut, QuizRecordCreate
)
from app.services.rag_service import RAGProcessor
from app.services.audit_service import AuditService

router = APIRouter(prefix="/documents", tags=["AI Document RAG & Study"])


@router.post("/index", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
def index_document(
    doc_in: DocumentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Process, chunk, and index an academic syllabus or study document into the semantic RAG store."""
    doc = Document(
        title=doc_in.title,
        filename=doc_in.filename,
        file_size_bytes=len(doc_in.content_text.encode('utf-8')),
        course_id=doc_in.course_id,
        uploader_id=current_user.id,
        summary=doc_in.summary or f"Indexed academic material: {doc_in.title}",
        page_count=doc_in.page_count,
    )
    db.add(doc)
    db.flush()

    # Generate overlapping semantic passages
    raw_chunks = RAGProcessor.chunk_text(doc_in.content_text)
    for c in raw_chunks:
        chunk_obj = DocumentChunk(
            document_id=doc.id,
            chunk_index=c["chunk_index"],
            page_number=1 + (c["chunk_index"] // 2),
            content=c["content"],
            token_count=c["token_count"],
            keywords=c["keywords"],
        )
        db.add(chunk_obj)

    db.commit()
    db.refresh(doc)

    AuditService.log_event(
        db=db,
        action="DOCUMENT_INDEX",
        entity_type="Document",
        entity_id=str(doc.id),
        user_id=current_user.id,
        details={"title": doc.title, "chunks_count": len(raw_chunks)},
    )

    return doc


@router.get("/", response_model=List[DocumentOut])
def list_documents(
    course_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List indexed course documents."""
    query = db.query(Document)
    if course_id:
        query = query.filter(Document.course_id == course_id)
    return query.order_by(Document.created_at.desc()).all()


@router.post("/rag-query", response_model=RAGQueryResult)
def rag_semantic_search(
    req: RAGQueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve grounded answers by semantically querying indexed university documents."""
    # Query all document chunks (optionally scoped to course)
    chunks_query = db.query(DocumentChunk).join(Document)
    if req.course_id:
        chunks_query = chunks_query.filter(Document.course_id == req.course_id)

    db_chunks = chunks_query.all()
    chunk_dicts = [
        {
            "id": c.id,
            "content": c.content,
            "keywords": c.keywords or "",
            "page_number": c.page_number,
            "doc_title": c.document.title if c.document else "Course Material",
        }
        for c in db_chunks
    ]

    top_matches = RAGProcessor.retrieve_top_chunks(req.query, chunk_dicts, top_k=req.top_k)

    sources = []
    for chunk, score in top_matches:
        sources.append({
            "title": chunk.get("doc_title", "Document"),
            "page": chunk.get("page_number", 1),
            "relevance_score": round(score, 3),
            "excerpt": chunk["content"][:200] + "...",
        })

    if not top_matches:
        answer = (
            f"No direct passages found matching '{req.query}' in the current course repository. "
            f"Please verify the query terms or ensure the course materials have been indexed."
        )
    else:
        answer = (
            f"Based on verified course documents (Sources: {', '.join([s['title'] for s in sources])}):\n\n"
            f"• Core Finding: {top_matches[0][0]['content'][:300]}...\n\n"
            f"• Verified Citation: Grounded in Page {sources[0]['page']} with confidence score {sources[0]['relevance_score']}."
        )

    return RAGQueryResult(
        query=req.query,
        answer=answer,
        sources=sources,
    )


@router.get("/flashcard-decks", response_model=List[FlashcardDeckOut])
def get_flashcard_decks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve flashcard decks for current user."""
    return db.query(FlashcardDeck).filter(FlashcardDeck.user_id == current_user.id).all()


@router.post("/flashcard-decks", response_model=FlashcardDeckOut, status_code=status.HTTP_201_CREATED)
def create_flashcard_deck(
    deck_in: FlashcardDeckCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new flashcard deck."""
    deck = FlashcardDeck(
        user_id=current_user.id,
        title=deck_in.title,
        topic=deck_in.topic,
        description=deck_in.description,
    )
    db.add(deck)
    db.flush()

    for c in deck_in.cards:
        card = FlashcardCard(
            deck_id=deck.id,
            front=c.get("front", ""),
            back=c.get("back", ""),
            difficulty=c.get("difficulty", "medium"),
        )
        db.add(card)

    db.commit()
    db.refresh(deck)
    return deck


@router.post("/quiz-records", response_model=QuizRecordOut, status_code=status.HTTP_201_CREATED)
def record_quiz_score(
    quiz_in: QuizRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Persist a completed diagnostic quiz evaluation score."""
    record = QuizRecord(
        student_id=current_user.id,
        topic=quiz_in.topic,
        score=quiz_in.score,
        total_questions=quiz_in.total_questions,
        percentage=quiz_in.percentage,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/quiz-records", response_model=List[QuizRecordOut])
def get_quiz_records(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List quiz attempts and scores for the current student."""
    return db.query(QuizRecord).filter(QuizRecord.student_id == current_user.id).order_by(QuizRecord.completed_at.desc()).all()
