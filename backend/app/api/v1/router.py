from fastapi import APIRouter
from app.api.v1.endpoints import auth, sectors, diagnostics, clusters

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentification"])
api_router.include_router(sectors.router, prefix="/sectors", tags=["Secteurs ODCO"])
api_router.include_router(diagnostics.router, prefix="/diagnostics", tags=["Diagnostic & Scoring"])
api_router.include_router(clusters.router, prefix="/clusters", tags=["Clusters TTSFR"])
