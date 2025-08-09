"""
Database configuration and session management
"""

from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import redis
from app.core.config import settings
import structlog

logger = structlog.get_logger()

# SQLAlchemy engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_pre_ping=True,
    echo=settings.ENVIRONMENT == "development"
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Redis connection
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency to get Redis client
def get_redis():
    return redis_client

async def create_tables():
    """Create all database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error("Failed to create database tables", error=str(e))
        raise

async def check_db_connection():
    """Check database connectivity"""
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        logger.info("Database connection verified")
        return True
    except Exception as e:
        logger.error("Database connection failed", error=str(e))
        return False

async def check_redis_connection():
    """Check Redis connectivity"""
    try:
        redis_client.ping()
        logger.info("Redis connection verified")
        return True
    except Exception as e:
        logger.error("Redis connection failed", error=str(e))
        return False
