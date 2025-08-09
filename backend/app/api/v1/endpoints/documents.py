"""
Document management API endpoints
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
import structlog

from app.core.database import get_db
from app.models.schemas import DocumentResponse, DocumentUploadResponse
from app.services.document_service import DocumentService
from app.services.ingestion_service import IngestionService
from app.core.exceptions import ValidationError, FileProcessingError
from app.core.config import settings

logger = structlog.get_logger()
router = APIRouter()

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db),
    document_service: DocumentService = Depends(),
    ingestion_service: IngestionService = Depends()
):
    """
    Upload and process a document for RAG ingestion
    
    This endpoint:
    1. Validates file type and size
    2. Saves file to storage
    3. Queues document for processing (chunking, embedding, indexing)
    4. Returns upload status
    """
    try:
        logger.info("Document upload started", filename=file.filename)
        
        # Validate file
        if not file.filename:
            raise ValidationError("Filename is required", "filename")
        
        if file.content_type not in settings.ALLOWED_FILE_TYPES:
            raise ValidationError(
                f"File type {file.content_type} not allowed", 
                "content_type"
            )
        
        # Check file size
        contents = await file.read()
        if len(contents) > settings.MAX_FILE_SIZE:
            raise ValidationError("File too large", "file_size")
        
        # Reset file pointer
        await file.seek(0)
        
        # Save document metadata
        document = await document_service.create_document(
            filename=file.filename,
            content_type=file.content_type,
            size=len(contents)
        )
        
        # Queue for processing
        background_tasks.add_task(
            ingestion_service.process_document,
            document.id,
            file
        )
        
        logger.info("Document uploaded successfully", document_id=document.id)
        
        return DocumentUploadResponse(
            id=document.id,
            filename=file.filename,
            status="uploaded",
            message="Document uploaded and queued for processing"
        )
        
    except ValidationError:
        raise
    except Exception as e:
        logger.error("Document upload failed", error=str(e), filename=file.filename)
        raise HTTPException(status_code=500, detail="Upload failed")

@router.get("", response_model=List[DocumentResponse])
async def get_documents(
    limit: int = 50,
    offset: int = 0,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    document_service: DocumentService = Depends()
):
    """Get list of uploaded documents"""
    try:
        documents = await document_service.get_documents(
            limit=limit,
            offset=offset,
            status=status
        )
        return documents
    except Exception as e:
        logger.error("Failed to get documents", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve documents")

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    db: Session = Depends(get_db),
    document_service: DocumentService = Depends()
):
    """Get document details"""
    try:
        document = await document_service.get_document(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        return document
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get document", error=str(e), document_id=document_id)
        raise HTTPException(status_code=500, detail="Failed to retrieve document")

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    document_service: DocumentService = Depends()
):
    """Delete document and remove from vector index"""
    try:
        # Queue for deletion (removes from vector DB too)
        background_tasks.add_task(
            document_service.delete_document,
            document_id
        )
        
        logger.info("Document deletion queued", document_id=document_id)
        return {"message": "Document deletion queued"}
        
    except Exception as e:
        logger.error("Failed to delete document", error=str(e), document_id=document_id)
        raise HTTPException(status_code=500, detail="Failed to delete document")

@router.post("/{document_id}/reprocess")
async def reprocess_document(
    document_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    document_service: DocumentService = Depends(),
    ingestion_service: IngestionService = Depends()
):
    """Reprocess a document (re-chunk and re-embed)"""
    try:
        document = await document_service.get_document(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Queue for reprocessing
        background_tasks.add_task(
            ingestion_service.reprocess_document,
            document_id
        )
        
        logger.info("Document reprocessing queued", document_id=document_id)
        return {"message": "Document reprocessing queued"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to reprocess document", error=str(e), document_id=document_id)
        raise HTTPException(status_code=500, detail="Failed to reprocess document")
