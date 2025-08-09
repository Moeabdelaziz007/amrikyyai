"""
SQLAlchemy database models
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.core.database import Base

class Document(Base):
    """Document model for storing uploaded files metadata"""
    __tablename__ = "documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    content_type = Column(String(100), nullable=False)
    size = Column(Integer, nullable=False)
    file_path = Column(String(500), nullable=False)
    
    # Processing status
    status = Column(String(50), default="uploaded")  # uploaded, processing, completed, failed
    processing_error = Column(Text, nullable=True)
    
    # Metadata
    title = Column(String(500), nullable=True)
    author = Column(String(255), nullable=True)
    language = Column(String(10), default="ar")
    content_hash = Column(String(64), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    
    # Relationships
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    """Document chunks for RAG retrieval"""
    __tablename__ = "document_chunks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False)
    
    # Chunk content and metadata
    content = Column(Text, nullable=False)
    chunk_index = Column(Integer, nullable=False)  # Position in document
    start_offset = Column(Integer, nullable=True)  # Character offset in original doc
    end_offset = Column(Integer, nullable=True)
    
    # Vector embedding (stored separately in vector DB, but we keep the ID)
    embedding_id = Column(String(100), nullable=True)  # ID in vector database
    
    # Chunk metadata
    section_title = Column(String(500), nullable=True)
    page_number = Column(Integer, nullable=True)
    content_hash = Column(String(64), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    document = relationship("Document", back_populates="chunks")

class Conversation(Base):
    """Conversation model for chat history"""
    __tablename__ = "conversations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(500), default="محادثة جديدة")
    
    # User info (for multi-user support)
    user_id = Column(String(100), nullable=True)  # For future auth integration
    
    # Conversation metadata
    message_count = Column(Integer, default=0)
    last_message_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    """Message model for conversation history"""
    __tablename__ = "messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=False)
    
    # Message content
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    
    # RAG metadata for assistant messages
    sources_used = Column(JSON, nullable=True)  # List of source document IDs and chunks
    model_used = Column(String(100), nullable=True)  # e.g., "gpt-4", "gpt-3.5-turbo"
    tokens_used = Column(Integer, nullable=True)
    processing_time = Column(Float, nullable=True)  # seconds
    
    # Message metadata
    message_index = Column(Integer, nullable=False)  # Position in conversation
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")

class QueryLog(Base):
    """Log all queries for analytics and improvement"""
    __tablename__ = "query_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Query details
    query = Column(Text, nullable=False)
    query_hash = Column(String(64), nullable=False)  # For deduplication analysis
    
    # Response details
    response = Column(Text, nullable=True)
    sources_count = Column(Integer, default=0)
    
    # Performance metrics
    retrieval_time = Column(Float, nullable=True)  # seconds
    llm_time = Column(Float, nullable=True)
    total_time = Column(Float, nullable=True)
    tokens_used = Column(Integer, nullable=True)
    
    # Quality metrics (for future feedback integration)
    user_feedback = Column(String(20), nullable=True)  # thumbs_up, thumbs_down
    confidence_score = Column(Float, nullable=True)
    
    # Context
    conversation_id = Column(UUID(as_uuid=True), nullable=True)
    user_id = Column(String(100), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

class SystemMetrics(Base):
    """System performance metrics"""
    __tablename__ = "system_metrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Metrics
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Float, nullable=False)
    metric_unit = Column(String(50), nullable=True)
    
    # Context
    component = Column(String(100), nullable=True)  # e.g., "retrieval", "llm", "embedding"
    metadata = Column(JSON, nullable=True)
    
    # Timestamps
    timestamp = Column(DateTime, default=datetime.utcnow)
