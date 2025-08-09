"""
Script to populate Amrikyy AI with comprehensive coding expertise dataset
"""

import asyncio
import json
import os
from datetime import datetime
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, Base, engine
from app.models.database import Document, DocumentChunk
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService

async def load_coding_datasets():
    """Load all coding expertise datasets"""
    
    datasets = []
    data_dir = "/Users/cryptojoker710/amrikyy-ai/backend/data"
    
    # Load main coding dataset
    coding_file = os.path.join(data_dir, "coding_expertise_dataset.json")
    if os.path.exists(coding_file):
        with open(coding_file, 'r', encoding='utf-8') as f:
            datasets.extend(json.load(f))
    
    # Load advanced patterns dataset
    patterns_file = os.path.join(data_dir, "advanced_programming_patterns.json")
    if os.path.exists(patterns_file):
        with open(patterns_file, 'r', encoding='utf-8') as f:
            datasets.extend(json.load(f))
    
    return datasets

async def create_coding_expertise_documents():
    """Create comprehensive coding expertise documents"""
    
    print("🚀 Loading coding expertise datasets...")
    datasets = await load_coding_datasets()
    
    if not datasets:
        print("❌ No datasets found!")
        return
    
    print(f"📚 Found {len(datasets)} coding topics")
    
    db = SessionLocal()
    embedding_service = EmbeddingService()
    vector_service = VectorService()
    
    try:
        # Create main coding expertise document
        full_content = "# Amrikyy's Coding Expertise Database\n\n"
        full_content += "محمد عبدالعزيز (Amrikyy) - Expert Programming Knowledge Base\n\n"
        
        # Organize content by category
        categories = {}
        for item in datasets:
            category = item.get('category', 'general')
            if category not in categories:
                categories[category] = []
            categories[category].append(item)
        
        # Build comprehensive content
        for category, items in categories.items():
            full_content += f"## {category.upper()} Programming\n\n"
            for item in items:
                full_content += f"### {item['title']}\n"
                full_content += f"**Difficulty**: {item.get('difficulty', 'intermediate')}\n"
                full_content += f"**Language**: {item.get('language', 'python')}\n"
                full_content += f"**Tags**: {', '.join(item.get('tags', []))}\n\n"
                full_content += f"{item['content']}\n\n"
                full_content += "---\n\n"
        
        # Create document record
        document = Document(
            filename="amrikyy_coding_expertise.md",
            original_filename="amrikyy_coding_expertise.md",
            content_type="text/markdown",
            size=len(full_content.encode('utf-8')),
            file_path="/virtual/coding/amrikyy_coding_expertise.md",
            status="completed",
            title="Amrikyy's Complete Coding Expertise",
            author="محمد عبدالعزيز (Amrikyy)",
            language="en",
            processed_at=datetime.utcnow()
        )
        
        db.add(document)
        db.commit()
        db.refresh(document)
        
        print(f"✅ Created main document: {document.id}")
        
        # Create detailed chunks for each coding topic
        chunk_index = 0
        
        for item in datasets:
            # Create comprehensive chunk content
            chunk_content = f"""# {item['title']}

**Category**: {item.get('category', 'general')}
**Difficulty**: {item.get('difficulty', 'intermediate')} 
**Language**: {item.get('language', 'python')}
**Tags**: {', '.join(item.get('tags', []))}

{item['content']}

---
This is part of Amrikyy's programming expertise. محمد عبدالعزيز has extensive experience in {item.get('category', 'programming')} and specializes in {', '.join(item.get('tags', []))}.
"""
            
            # Create document chunk
            chunk = DocumentChunk(
                document_id=document.id,
                content=chunk_content,
                chunk_index=chunk_index,
                section_title=item['title'],
                content_hash=hash(chunk_content)
            )
            
            db.add(chunk)
            db.commit()
            db.refresh(chunk)
            
            # Generate embedding
            try:
                embedding = await embedding_service.embed_text(chunk_content)
                
                # Store in vector database
                vector_id = await vector_service.upsert_vector(
                    vector_id=str(chunk.id),
                    embedding=embedding,
                    metadata={
                        "document_id": str(document.id),
                        "chunk_id": str(chunk.id),
                        "title": item['title'],
                        "category": item.get('category', 'general'),
                        "difficulty": item.get('difficulty', 'intermediate'),
                        "language": item.get('language', 'python'),
                        "tags": item.get('tags', []),
                        "content_type": "coding_expertise",
                        "author": "Amrikyy",
                        "preview": chunk_content[:500]
                    }
                )
                
                # Update chunk with embedding ID
                chunk.embedding_id = vector_id
                db.commit()
                
                print(f"✅ Created coding chunk {chunk_index + 1}/{len(datasets)}: {item['title']}")
                chunk_index += 1
                
            except Exception as e:
                print(f"❌ Failed to create embedding for {item['title']}: {e}")
                continue
        
        # Create additional specialized documents
        await create_specialized_coding_docs(db, embedding_service, vector_service, document.id)
        
        print(f"🎉 Successfully populated coding expertise!")
        print(f"📄 Main Document ID: {document.id}")
        print(f"📦 Total chunks: {chunk_index}")
        
        return document.id
        
    except Exception as e:
        print(f"❌ Error creating coding expertise: {e}")
        db.rollback()
        raise
    finally:
        db.close()

async def create_specialized_coding_docs(db, embedding_service, vector_service, parent_doc_id):
    """Create specialized coding documents"""
    
    # Best Practices Document
    best_practices_content = """# Amrikyy's Coding Best Practices

## Clean Code Principles

### 1. Meaningful Names
```python
# Bad
def calc(x, y):
    return x * y * 0.1

# Good
def calculate_discount_amount(price, quantity):
    DISCOUNT_RATE = 0.1
    return price * quantity * DISCOUNT_RATE
```

### 2. Functions Should Do One Thing
```python
# Bad
def process_user_data(user_data):
    # Validate data
    if not user_data.get('email'):
        raise ValueError("Email required")
    
    # Save to database
    db.save(user_data)
    
    # Send email
    send_welcome_email(user_data['email'])
    
    # Log activity
    log_user_registration(user_data['id'])

# Good
def validate_user_data(user_data):
    if not user_data.get('email'):
        raise ValueError("Email required")

def save_user(user_data):
    return db.save(user_data)

def process_user_registration(user_data):
    validate_user_data(user_data)
    user = save_user(user_data)
    send_welcome_email(user['email'])
    log_user_registration(user['id'])
    return user
```

## Code Review Guidelines

### Security Checklist
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] Authentication and authorization
- [ ] Secure password handling
- [ ] HTTPS enforcement
- [ ] Rate limiting implementation

### Performance Checklist
- [ ] Algorithm complexity analysis
- [ ] Database query optimization
- [ ] Caching strategy
- [ ] Memory leak prevention
- [ ] Asynchronous processing where appropriate

## Testing Philosophy

### Test Pyramid
1. **Unit Tests (70%)**: Fast, isolated, deterministic
2. **Integration Tests (20%)**: Test component interactions
3. **E2E Tests (10%)**: Full user journey testing

### TDD Red-Green-Refactor Cycle
1. **Red**: Write failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

This represents Amrikyy's (محمد عبدالعزيز) approach to professional software development, gained through experience at Global Career Accelerator and various technical projects.
"""
    
    # Create best practices document
    bp_document = Document(
        filename="amrikyy_best_practices.md",
        original_filename="amrikyy_best_practices.md",
        content_type="text/markdown",
        size=len(best_practices_content.encode('utf-8')),
        file_path="/virtual/coding/amrikyy_best_practices.md",
        status="completed",
        title="Amrikyy's Coding Best Practices",
        author="محمد عبدالعزيز (Amrikyy)",
        language="en",
        processed_at=datetime.utcnow()
    )
    
    db.add(bp_document)
    db.commit()
    db.refresh(bp_document)
    
    # Create chunk for best practices
    bp_chunk = DocumentChunk(
        document_id=bp_document.id,
        content=best_practices_content,
        chunk_index=0,
        section_title="Amrikyy's Coding Best Practices"
    )
    
    db.add(bp_chunk)
    db.commit()
    db.refresh(bp_chunk)
    
    # Create embedding
    try:
        embedding = await embedding_service.embed_text(best_practices_content)
        
        vector_id = await vector_service.upsert_vector(
            vector_id=str(bp_chunk.id),
            embedding=embedding,
            metadata={
                "document_id": str(bp_document.id),
                "chunk_id": str(bp_chunk.id),
                "title": "Coding Best Practices",
                "category": "best-practices",
                "difficulty": "intermediate",
                "language": "python",
                "tags": ["clean-code", "best-practices", "code-review", "testing"],
                "content_type": "coding_expertise",
                "author": "Amrikyy",
                "preview": best_practices_content[:500]
            }
        )
        
        bp_chunk.embedding_id = vector_id
        db.commit()
        
        print("✅ Created best practices document")
        
    except Exception as e:
        print(f"❌ Failed to create best practices embedding: {e}")

async def test_coding_expertise_retrieval():
    """Test retrieval of coding expertise"""
    from app.services.retrieval_service import RetrievalService
    
    retrieval_service = RetrievalService()
    
    # Test coding queries
    test_queries = [
        "How to implement a circuit breaker pattern?",
        "What are SOLID principles in programming?",
        "Show me advanced JavaScript async patterns",
        "How to optimize algorithm performance?",
        "Explain clean architecture principles",
        "كيف أطبق مبادئ البرمجة النظيفة؟",
        "What's the best way to handle errors in Python?",
        "Show me design patterns for microservices",
        "How to implement event sourcing?",
        "Advanced testing strategies in software development"
    ]
    
    print("\n🔍 Testing coding expertise retrieval...")
    
    for query in test_queries:
        try:
            results = await retrieval_service.retrieve_by_text(
                query_text=query,
                top_k=3
            )
            
            print(f"\n❓ Query: {query}")
            print(f"📊 Found {len(results)} results:")
            
            for i, result in enumerate(results, 1):
                print(f"  {i}. {result.get('title', 'Unknown')}")
                print(f"     Category: {result.get('metadata', {}).get('category', 'unknown')}")
                print(f"     Difficulty: {result.get('metadata', {}).get('difficulty', 'unknown')}")
                print(f"     Score: {result.get('confidence', 0):.3f}")
                
        except Exception as e:
            print(f"❌ Query failed: {query} - {e}")

if __name__ == "__main__":
    print("🚀 Populating Amrikyy's coding expertise...")
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Run the population
    asyncio.run(create_coding_expertise_documents())
    
    # Test retrieval
    asyncio.run(test_coding_expertise_retrieval())
    
    print("\n✅ Coding expertise population complete!")
    print("\n🎯 Amrikyy is now a coding expert! You can ask:")
    print("   - Advanced programming questions")
    print("   - Algorithm and data structure questions") 
    print("   - Design patterns and architecture")
    print("   - Performance optimization")
    print("   - Best practices and code review")
    print("   - Multiple programming languages")
    print("\n💡 Example questions:")
    print("   - 'How do I implement a circuit breaker pattern?'")
    print("   - 'Show me advanced async patterns in JavaScript'")
    print("   - 'What are the SOLID principles?'")
    print("   - 'كيف أحسن أداء الخوارزميات؟'")
