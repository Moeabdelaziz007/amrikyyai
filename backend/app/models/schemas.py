"""
Pydantic schemas for API request/response models
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, validator
from datetime import datetime
from enum import Enum

# Enums
class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class DocumentStatus(str, Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

# Request Models
class QueryOptions(BaseModel):
    temperature: Optional[float] = 0.1
    max_tokens: Optional[int] = 4000
    sources: Optional[bool] = True
    model: Optional[str] = "gpt-4"
    top_k: Optional[int] = 5

class QueryRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    options: Optional[QueryOptions] = QueryOptions()
    
    @validator('message')
    def validate_message(cls, v):
        if not v.strip():
            raise ValueError('Message cannot be empty')
        if len(v) > 10000:
            raise ValueError('Message too long (max 10000 characters)')
        return v.strip()

class ConversationCreate(BaseModel):
    title: Optional[str] = "محادثة جديدة"

# Response Models
class SourceMetadata(BaseModel):
    doc_id: Optional[str] = None
    chunk_id: Optional[str] = None
    page_number: Optional[int] = None
    section: Optional[str] = None

class Source(BaseModel):
    id: str
    title: str
    snippet: str
    url: Optional[str] = None
    timestamp: Optional[datetime] = None
    confidence: Optional[float] = None
    metadata: Optional[SourceMetadata] = None

class MessageResponse(BaseModel):
    id: str
    role: MessageRole
    content: str
    timestamp: datetime
    sources: Optional[List[Source]] = None
    tokens_used: Optional[int] = None
    processing_time: Optional[float] = None

class QueryResponse(BaseModel):
    id: str
    content: str
    sources: Optional[List[Source]] = None
    conversation_id: str
    timestamp: datetime
    model_used: Optional[str] = None
    tokens_used: Optional[int] = None
    processing_time: Optional[float] = None

class ConversationResponse(BaseModel):
    id: str
    title: str
    message_count: int
    last_message_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    messages: Optional[List[MessageResponse]] = None

class DocumentUploadResponse(BaseModel):
    id: str
    filename: str
    status: DocumentStatus
    message: str

class DocumentResponse(BaseModel):
    id: str
    filename: str
    original_filename: str
    content_type: str
    size: int
    status: DocumentStatus
    processing_error: Optional[str] = None
    title: Optional[str] = None
    author: Optional[str] = None
    language: str = "ar"
    chunks_count: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    processed_at: Optional[datetime] = None

class DocumentChunkResponse(BaseModel):
    id: str
    document_id: str
    content: str
    chunk_index: int
    section_title: Optional[str] = None
    page_number: Optional[int] = None
    created_at: datetime

# Analytics Models
class QueryAnalytics(BaseModel):
    query_count: int
    avg_response_time: float
    avg_tokens_used: float
    top_queries: List[Dict[str, Any]]
    source_usage: Dict[str, int]

class SystemHealth(BaseModel):
    status: str
    service: str
    version: str
    environment: str
    dependencies: Dict[str, str]
    config: Dict[str, Any]

# Error Models
class ErrorResponse(BaseModel):
    detail: str
    error_code: str
    timestamp: datetime = datetime.utcnow()

# Streaming Models (for future WebSocket support)
class StreamingChunk(BaseModel):
    type: str  # "text", "source", "done", "error"
    content: Optional[str] = None
    sources: Optional[List[Source]] = None
    error: Optional[str] = None

# Configuration Models
class RAGConfig(BaseModel):
    chunk_size: int = 1000
    chunk_overlap: int = 200
    retrieval_top_k: int = 10
    rerank_top_k: int = 5
    min_confidence: float = 0.3
    temperature: float = 0.1
    max_tokens: int = 4000
