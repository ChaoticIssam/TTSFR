import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.router import api_router

logger = logging.getLogger("uvicorn")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Automatically initialize tables and seed data on startup
    max_retries = 5
    retry_delay = 2
    for attempt in range(1, max_retries + 1):
        try:
            from app.seeds.initial_data import seed_database
            logger.info(f"[STARTUP] Initializing database & seeding reference data (attempt {attempt}/{max_retries})...")
            seed_database()
            logger.info("[STARTUP] Database tables and reference seed data are ready.")
            break
        except Exception as e:
            logger.warning(f"[STARTUP] Database initialization attempt {attempt} failed: {e}")
            if attempt < max_retries:
                time.sleep(retry_delay)
            else:
                logger.error("[STARTUP] Could not complete database seeding on startup. Server will continue running.")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API Full-Stack pour l'Accompagnement Technique et le Diagnostic des Coopératives (UM6P | GTI | Fondation OCP)",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Santé du Système"])
def health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "pilot_ready": True
    }
