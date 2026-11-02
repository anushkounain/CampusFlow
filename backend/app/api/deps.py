from typing import List
from fastapi import Depends, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import decode_access_token
from app.core.exceptions import CredentialsException, PermissionDeniedException
from app.models.user import User, UserRole

security_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Validate Bearer token and retrieve the authenticated user."""
    if not credentials:
        raise CredentialsException("Authorization token is missing")

    token = credentials.credentials
    payload = decode_access_token(token)
    if payload is None:
        raise CredentialsException("Invalid or expired authentication token")

    user_id = payload.get("sub")
    if user_id is None:
        raise CredentialsException("Token payload missing user identifier")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise CredentialsException("User associated with token no longer exists")

    if not user.is_active:
        raise CredentialsException("User account is inactive")

    return user


def require_roles(*allowed_roles: UserRole):
    """Dependency that enforces user role authorization."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise PermissionDeniedException(
                f"Action requires one of the following roles: {[r.value for r in allowed_roles]}"
            )
        return current_user

    return role_checker
