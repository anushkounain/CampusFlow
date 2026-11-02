from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.core.exceptions import CredentialsException, UserAlreadyExistsException
from app.models.user import User, UserRole, StudentProfile, FacultyProfile
from app.schemas.auth import LoginRequest, RegisterRequest, Token
from app.schemas.user import UserOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new student, faculty, placement coordinator, or admin."""
    existing_user = db.query(User).filter(User.email == req.email.lower()).first()
    if existing_user:
        raise UserAlreadyExistsException()

    user = User(
        email=req.email.lower(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        role=req.role,
        department=req.department or "Computer Science & Engineering",
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    db.flush()

    # Create associated profile
    if req.role == UserRole.STUDENT:
        roll = req.roll_number_or_empid or f"CS{2024000 + user.id}"
        profile = StudentProfile(
            user_id=user.id,
            roll_number=roll,
            semester=4,
            program="B.Tech Computer Science & Engineering",
            cgpa=8.75,
            attendance_percentage=92.5,
            credits_completed=74,
            total_credits=160,
        )
        db.add(profile)
    elif req.role in [UserRole.FACULTY, UserRole.PLACEMENT_COORDINATOR]:
        empid = req.roll_number_or_empid or f"EMP{1000 + user.id}"
        profile = FacultyProfile(
            user_id=user.id,
            employee_id=empid,
            designation="Associate Professor" if req.role == UserRole.FACULTY else "Placement Coordinator",
            specialization="Distributed Systems & AI",
            office_room="Room 304, Academic Block A",
        )
        db.add(profile)

    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id, role=user.role.value)
    user_data = UserOut.model_validate(user).model_dump()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_data,
    }


@router.post("/login", response_model=Token)
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate with email and password, returning JWT access token."""
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise CredentialsException("Invalid email or password")

    if not user.is_active:
        raise CredentialsException("Account is currently disabled")

    token = create_access_token(subject=user.id, role=user.role.value)
    user_data = UserOut.model_validate(user).model_dump()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_data,
    }


@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Retrieve profile and identity of currently authenticated user."""
    return current_user
