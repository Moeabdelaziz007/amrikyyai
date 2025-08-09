"""
Health check and system status endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import structlog

from app.core.database import get_db, check_db_connection, check_redis_connection
from app.core.config import settings

logger = structlog.get_logger()
router = APIRouter()

@router.get("/")
async def health_check():
    """Basic health check"""
    return {
        "status": "healthy",
        "service": "amrikyy-ai-api",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }

@router.get("/detailed")
async def detailed_health_check(db: Session = Depends(get_db)):
    """Detailed health check including dependencies"""
    
    # Check database
    db_healthy = await check_db_connection()
    
    # Check Redis
    redis_healthy = await check_redis_connection()
    
    # Overall status
    overall_status = "healthy" if db_healthy and redis_healthy else "unhealthy"
    
    return {
        "status": overall_status,
        "service": "amrikyy-ai-api",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "dependencies": {
            "database": "healthy" if db_healthy else "unhealthy",
            "redis": "healthy" if redis_healthy else "unhealthy"
        },
        "config": {
            "vector_db_type": settings.VECTOR_DB_TYPE,
            "openai_model": settings.OPENAI_MODEL,
            "retrieval_top_k": settings.RETRIEVAL_TOP_K
        }
    }
