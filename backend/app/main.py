from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1 import api_router
from app.database import init_db
from app.seed import seed_database
from app.core.logging import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    logger.info("Initializing CampusFlow database tables...")
    init_db()
    logger.info("Seeding initial development database...")
    seed_database()
    logger.info("CampusFlow Backend operational.")
    yield
    logger.info("CampusFlow Backend shutdown complete.")


app = FastAPI(
    title="CampusFlow API",
    description="One campus. Every possibility. High-performance API for university lifecycle management.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

# Aliases for health check
from app.api.v1.health import check_health
app.add_api_route("/health", check_health, methods=["GET"], tags=["Health"])
app.add_api_route("/api/health", check_health, methods=["GET"], tags=["Health"])


@app.get("/")
def root():
    """Root endpoint for platform identification."""
    return {
        "platform": "CampusFlow",
        "tagline": "One campus. Every possibility.",
        "version": "1.0.0",
        "status": "online",
        "documentation": "/docs",
        "api_v1": settings.API_V1_STR,
    }
