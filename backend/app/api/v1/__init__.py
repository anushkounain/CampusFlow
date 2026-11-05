from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.academics import router as academics_router
from app.api.v1.career import router as career_router
from app.api.v1.community import router as community_router
from app.api.v1.ai import router as ai_router
from app.api.v1.documents import router as documents_router
from app.api.v1.discussions import router as discussions_router
from app.api.v1.marketplace import router as marketplace_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.audit import router as audit_router
from app.api.v1.intelligence import router as intelligence_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(academics_router)
api_router.include_router(career_router)
api_router.include_router(community_router)
api_router.include_router(ai_router)
api_router.include_router(documents_router)
api_router.include_router(discussions_router)
api_router.include_router(marketplace_router)
api_router.include_router(analytics_router)
api_router.include_router(audit_router)
api_router.include_router(intelligence_router)
