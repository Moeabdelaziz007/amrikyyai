"""
Custom exception classes
"""

from typing import Optional

class AmrikyyException(Exception):
    """Base exception class for Amrikyy AI"""
    
    def __init__(
        self, 
        detail: str = "An error occurred",
        status_code: int = 500,
        error_code: str = "GENERIC_ERROR"
    ):
        self.detail = detail
        self.status_code = status_code
        self.error_code = error_code
        super().__init__(self.detail)

class ValidationError(AmrikyyException):
    """Validation error"""
    
    def __init__(self, detail: str = "Validation failed", field: Optional[str] = None):
        error_code = f"VALIDATION_ERROR_{field.upper()}" if field else "VALIDATION_ERROR"
        super().__init__(detail, 400, error_code)

class AuthenticationError(AmrikyyException):
    """Authentication error"""
    
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(detail, 401, "AUTHENTICATION_ERROR")

class AuthorizationError(AmrikyyException):
    """Authorization error"""
    
    def __init__(self, detail: str = "Access denied"):
        super().__init__(detail, 403, "AUTHORIZATION_ERROR")

class NotFoundError(AmrikyyException):
    """Resource not found error"""
    
    def __init__(self, detail: str = "Resource not found", resource: Optional[str] = None):
        error_code = f"{resource.upper()}_NOT_FOUND" if resource else "NOT_FOUND"
        super().__init__(detail, 404, error_code)

class ConflictError(AmrikyyException):
    """Resource conflict error"""
    
    def __init__(self, detail: str = "Resource conflict"):
        super().__init__(detail, 409, "CONFLICT_ERROR")

class ExternalServiceError(AmrikyyException):
    """External service error"""
    
    def __init__(self, detail: str = "External service error", service: Optional[str] = None):
        error_code = f"{service.upper()}_ERROR" if service else "EXTERNAL_SERVICE_ERROR"
        super().__init__(detail, 502, error_code)

class RateLimitError(AmrikyyException):
    """Rate limit exceeded error"""
    
    def __init__(self, detail: str = "Rate limit exceeded"):
        super().__init__(detail, 429, "RATE_LIMIT_ERROR")

class FileProcessingError(AmrikyyException):
    """File processing error"""
    
    def __init__(self, detail: str = "File processing failed"):
        super().__init__(detail, 422, "FILE_PROCESSING_ERROR")

class EmbeddingError(AmrikyyException):
    """Embedding generation error"""
    
    def __init__(self, detail: str = "Embedding generation failed"):
        super().__init__(detail, 500, "EMBEDDING_ERROR")

class RetrievalError(AmrikyyException):
    """Document retrieval error"""
    
    def __init__(self, detail: str = "Document retrieval failed"):
        super().__init__(detail, 500, "RETRIEVAL_ERROR")

class LLMError(AmrikyyException):
    """LLM processing error"""
    
    def __init__(self, detail: str = "LLM processing failed"):
        super().__init__(detail, 500, "LLM_ERROR")
