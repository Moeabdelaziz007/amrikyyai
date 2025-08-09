"""
RAG Service - Core RAG pipeline implementation
"""

from typing import List, Optional
import structlog
from datetime import datetime
import hashlib
import asyncio

from app.core.config import settings
from app.models.schemas import QueryRequest, QueryResponse, Source, QueryOptions
from app.services.retrieval_service import RetrievalService
from app.services.llm_service import LLMService
from app.services.embedding_service import EmbeddingService
from app.core.exceptions import RetrievalError, LLMError

logger = structlog.get_logger()

class RAGService:
    """RAG pipeline orchestrator"""
    
    def __init__(self):
        self.retrieval_service = RetrievalService()
        self.llm_service = LLMService()
        self.embedding_service = EmbeddingService()
    
    async def process_query(
        self, 
        query: str, 
        conversation_id: Optional[str] = None,
        options: Optional[QueryOptions] = None
    ) -> QueryResponse:
        """
        Process a query through the complete RAG pipeline
        
        Steps:
        1. Generate query embedding
        2. Retrieve relevant documents
        3. Rerank results
        4. Build context
        5. Generate response with LLM
        6. Extract citations
        """
        start_time = datetime.utcnow()
        
        if not options:
            options = QueryOptions()
        
        try:
            logger.info("Starting RAG pipeline", query=query[:100])
            
            # Step 1: Generate query embedding
            query_embedding = await self.embedding_service.embed_query(query)
            
            # Step 2: Retrieve relevant documents
            retrieved_docs = await self.retrieval_service.retrieve(
                query_embedding=query_embedding,
                query_text=query,
                top_k=options.top_k or settings.RETRIEVAL_TOP_K
            )
            
            logger.info("Retrieved documents", count=len(retrieved_docs))
            
            # Step 3: Rerank if we have results
            if retrieved_docs:
                reranked_docs = await self.retrieval_service.rerank(
                    query=query,
                    documents=retrieved_docs,
                    top_k=options.top_k or settings.RERANK_TOP_K
                )
            else:
                reranked_docs = []
            
            # Step 4: Build context and prompt
            context = self._build_context(reranked_docs)
            prompt = self._build_prompt(query, context)
            
            # Step 5: Generate response
            response_content = await self.llm_service.generate_response(
                prompt=prompt,
                temperature=options.temperature or settings.OPENAI_TEMPERATURE,
                max_tokens=options.max_tokens or settings.OPENAI_MAX_TOKENS,
                model=options.model or settings.OPENAI_MODEL
            )
            
            # Step 6: Extract sources and create response
            sources = self._extract_sources(reranked_docs)
            
            # Calculate processing time
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            
            # Create response
            response = QueryResponse(
                id=self._generate_response_id(query, response_content),
                content=response_content,
                sources=sources if options.sources else None,
                conversation_id=conversation_id or self._generate_conversation_id(),
                timestamp=datetime.utcnow(),
                model_used=options.model or settings.OPENAI_MODEL,
                processing_time=processing_time
            )
            
            logger.info("RAG pipeline completed", 
                       response_id=response.id, 
                       processing_time=processing_time,
                       sources_count=len(sources))
            
            return response
            
        except Exception as e:
            logger.error("RAG pipeline failed", error=str(e), query=query[:100])
            raise LLMError(f"Failed to process query: {str(e)}")
    
    def _build_context(self, documents: List[dict]) -> str:
        """Build context string from retrieved documents"""
        if not documents:
            return ""
        
        context_parts = []
        for i, doc in enumerate(documents, 1):
            source_info = f"===SOURCE {i}==="
            metadata = f"metadata: {doc.get('metadata', {})}"
            passage = f"passage: \"{doc['content']}\""
            end_marker = f"===END SOURCE {i}==="
            
            context_parts.append(f"{source_info}\n{metadata}\n{passage}\n{end_marker}")
        
        return "\n\n".join(context_parts)
    
    def _build_prompt(self, query: str, context: str) -> str:
        """Build the complete prompt for the LLM"""
        system_prompt = """System: You are Amrikyy AI — an expert, concise, and careful assistant. ALWAYS follow these rules:
1) When the user asks a factual or document-related question, first consult the provided SOURCES. Use only the information contained in those sources to answer factual claims.
2) For each factual claim, include one or more bracketed citations like [Source 1] referencing the labelled retrieved passages. After the main answer, include a "Sources" list with full metadata and a short quoted snippet for each cited source.
3) If the retrieved sources do not support the answer, do NOT fabricate. Say "I could not find a supporting source in the provided documents." Offer to search more sources or ask clarifying questions.
4) If asked for opinion or synthesis beyond the sources, label your answer clearly as "Opinion:" and separate model knowledge from source-based facts.
5) Keep responses concise (2-6 sentences) by default unless the user requests detail. Offer "more details" as an expandable option.
6) Respect user privacy and do not disclose private or restricted content unless the user has explicit rights.
7) If the user asks for the raw retrieved passages, show them in the "Retrieved Passages" block unchanged and cite them.

Respond in Arabic when appropriate, and always maintain a helpful and professional tone."""

        if context:
            full_prompt = f"{system_prompt}\n\n{context}\n\nINSTRUCTION: Answer using the retrieved sources. For each factual claim cite the source(s) like [Source 1]. If no supporting source: 'No source found.'\n\nUser Question: {query}\n\nAssistant:"
        else:
            full_prompt = f"{system_prompt}\n\nNo relevant sources were found in the knowledge base. Please provide a helpful response based on general knowledge while noting the lack of specific sources.\n\nUser Question: {query}\n\nAssistant:"
        
        return full_prompt
    
    def _extract_sources(self, documents: List[dict]) -> List[Source]:
        """Extract sources from retrieved documents"""
        sources = []
        
        for i, doc in enumerate(documents, 1):
            source = Source(
                id=doc.get('id', f'source_{i}'),
                title=doc.get('title', 'Unknown Document'),
                snippet=doc.get('content', '')[:500] + ('...' if len(doc.get('content', '')) > 500 else ''),
                url=doc.get('url'),
                timestamp=doc.get('timestamp'),
                confidence=doc.get('confidence'),
                metadata=doc.get('metadata')
            )
            sources.append(source)
        
        return sources
    
    def _generate_response_id(self, query: str, response: str) -> str:
        """Generate a unique response ID"""
        content = f"{query}:{response}:{datetime.utcnow().isoformat()}"
        return hashlib.md5(content.encode()).hexdigest()[:16]
    
    def _generate_conversation_id(self) -> str:
        """Generate a new conversation ID"""
        content = f"conv:{datetime.utcnow().isoformat()}"
        return hashlib.md5(content.encode()).hexdigest()[:16]
