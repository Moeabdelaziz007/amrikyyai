"""
API v1 Router - Main API routes
"""

from fastapi import APIRouter
from app.api.v1.endpoints import chat, documents, health

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
