"""
Script to populate Amrikyy AI database with personal bio data
"""

import asyncio
import json
from datetime import datetime
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, Base, engine
from app.models.database import Document, DocumentChunk
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService

# Bio data for محمد عبدالعزيز (Amrikyy)
BIO_DATA = [
    {
        "id": "bio-1",
        "title": "المعلومات الشخصية",
        "text": "محمد عبدالعزيز (Amrikyy)، طالب دراسات عليا في التكنولوجيا. مواطن أمريكي ومصري، مولود في 10 يوليو 1999 في مصر.",
        "metadata": {"category": "personal", "source": "LinkedIn", "lang": "ar"}
    },
    {
        "id": "bio-2", 
        "title": "الملخص المهني",
        "text": "تكنولوجي متعدد التخصصات بخبرة عملية في الذكاء الاصطناعي، Web3، UX، واستراتيجية البيانات. معتمد من OpenAI، Intel، وL'Oréal. ماهر في Python، الأمن السيبراني، هندسة البرومبت، وسرد القصص الرقمية. شغوف ببناء حلول مستقبلية تربط التقنية بالتأثير الإنساني.",
        "metadata": {"category": "summary", "source": "LinkedIn", "lang": "ar"}
    },
    {
        "id": "bio-3",
        "title": "المهارات", 
        "text": "هندسة البرومبت، تصميم UX/UI، SEO، نمذجة أدوات الذكاء الاصطناعي، التواصل بين الثقافات، A/B Testing، تحليل البيانات، التفكير التصميمي، Python لتطبيقات الذكاء الاصطناعي والأتمتة، أساسيات البلوكشين.",
        "metadata": {"category": "skills", "source": "LinkedIn", "lang": "ar"}
    },
    {
        "id": "bio-4",
        "title": "الخبرة — Innovation & Strategy Intern",
        "text": "Global Career Accelerator (عن بُعد) — مايو 2025 حتى أغسطس 2025. عمل على تصميم محتوى وتجارب مستخدم لمشاريع مع L'Oréal وGRAMMY U وIntel وUNESCO، شملت اختبارات A/B، تحسينات UX، تحليل بيانات الاستدامة، تطوير صفحات هبوط، وبناء شخصيات مستخدم.",
        "metadata": {"category": "experience", "source": "LinkedIn", "lang": "ar"}
    },
    {
        "id": "bio-5",
        "title": "الخبرة — Freelance Projects", 
        "text": "من مايو 2023 حتى الآن: بناء أدوات ولوحات ذكاء اصطناعي تجمع بين الحوسبة الكمومية وWeb3 وتصميم UX. أمثلة: Moe QuantumAI Dashboard، مشروع StayX في تحدي Coinbase Web3، وأدوات توليد صور AI. ركز على التصميم الموجه للمستخدم والنماذج السريعة وتدفقات البيانات الذكية.",
        "metadata": {"category": "experience", "source": "LinkedIn", "lang": "ar"}
    },
    {
        "id": "bio-6",
        "title": "الخبرة — Crypto Derivatives Trader",
        "text": "Bybit — عن بُعد — من يناير 2020 حتى الآن: تنفيذ تداول المشتقات والعقود المستقبلية في أسواق العملات المشفرة، تحليل حركة الأسعار، إدارة المخاطر، وبناء استراتيجيات تداول باستخدام بيانات السوق اللحظية.",
        "metadata": {"category": "experience", "source": "LinkedIn", "lang": "ar"}
    },
    {
        "id": "bio-7",
        "title": "التعليم",
        "text": "بكالوريوس علوم في هندسة الأمن السيبراني — جامعة Kennesaw State (2022–الحاضر). دبلوم علوم الحاسوب — Chattahoochee Technical College (2017–2021).",
        "metadata": {"category": "education", "source": "LinkedIn", "lang": "ar"}
    },
    {
        "id": "bio-8", 
        "title": "الشهادات",
        "text": "شهادة UX/UI & Prototyping من L'Oréal × GCA (أغسطس 2025). شهادة AI Professional Skills من OpenAI × GCA (أغسطس 2025). شهادة Understanding LLMs and Basic Prompting Techniques من CodeSignal (أغسطس 2025). شهادة Intercultural Skills من UNESCO × GCA (أغسطس 2025). شهادة Frontend Developer من HackerRank (يوليو 2025). شهادة Data Visualization من Intel × GCA (يونيو 2025).",
        "metadata": {"category": "certifications", "source": "LinkedIn", "lang": "ar"}
    },
    {
        "id": "bio-9",
        "title": "الجوائز والتكريم", 
        "text": "قائمة العميد — جامعة Kennesaw State (يونيو 2024 وديسمبر 2023) لتميز الأداء الأكاديمي والمحافظة على معدل مرتفع في برنامج الأمن السيبراني.",
        "metadata": {"category": "awards", "source": "LinkedIn", "lang": "ar"}
    },
    {
        "id": "bio-10",
        "title": "اللغات",
        "text": "العربية (لهجة مصرية) — اللغة الأم. الإنجليزية — مستوى متقدم.",
        "metadata": {"category": "languages", "source": "LinkedIn", "lang": "ar"}
    }
]

async def create_bio_document():
    """Create a consolidated bio document"""
    
    # Combine all bio sections into one document
    full_bio = "# السيرة الذاتية - محمد عبدالعزيز (Amrikyy)\n\n"
    
    for section in BIO_DATA:
        full_bio += f"## {section['title']}\n"
        full_bio += f"{section['text']}\n\n"
    
    db = SessionLocal()
    try:
        # Create document record
        document = Document(
            filename="amrikyy_bio.md",
            original_filename="amrikyy_bio.md", 
            content_type="text/markdown",
            size=len(full_bio.encode('utf-8')),
            file_path="/virtual/bio/amrikyy_bio.md",
            status="completed",
            title="السيرة الذاتية - محمد عبدالعزيز (Amrikyy)",
            author="محمد عبدالعزيز",
            language="ar",
            processed_at=datetime.utcnow()
        )
        
        db.add(document)
        db.commit()
        db.refresh(document)
        
        print(f"✅ Created document: {document.id}")
        
        # Create chunks for each bio section
        embedding_service = EmbeddingService()
        vector_service = VectorService()
        
        for i, section in enumerate(BIO_DATA):
            # Create document chunk
            chunk_content = f"{section['title']}\n{section['text']}"
            
            chunk = DocumentChunk(
                document_id=document.id,
                content=chunk_content,
                chunk_index=i,
                section_title=section['title'],
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
                        "title": section['title'],
                        "category": section['metadata']['category'],
                        "source": section['metadata']['source'],
                        "language": section['metadata']['lang'],
                        "content": chunk_content[:500]  # First 500 chars for preview
                    }
                )
                
                # Update chunk with embedding ID
                chunk.embedding_id = vector_id
                db.commit()
                
                print(f"✅ Created chunk {i+1}/10: {section['title']}")
                
            except Exception as e:
                print(f"❌ Failed to create embedding for chunk {i+1}: {e}")
                continue
        
        print(f"🎉 Successfully populated bio data for محمد عبدالعزيز (Amrikyy)")
        print(f"📄 Document ID: {document.id}")
        print(f"📦 Total chunks: {len(BIO_DATA)}")
        
        return document.id
        
    except Exception as e:
        print(f"❌ Error creating bio document: {e}")
        db.rollback()
        raise
    finally:
        db.close()

async def test_bio_retrieval():
    """Test retrieval of bio information"""
    from app.services.retrieval_service import RetrievalService
    
    retrieval_service = RetrievalService()
    
    # Test queries
    test_queries = [
        "من هو محمد عبدالعزيز؟",
        "ما هي خبرات Amrikyy المهنية؟", 
        "أين درس محمد؟",
        "ما هي مهارات Amrikyy التقنية؟",
        "What is Amrikyy's background in AI?",
        "Tell me about Mohamed's certifications"
    ]
    
    print("\n🔍 Testing bio retrieval...")
    
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
                print(f"     Score: {result.get('confidence', 0):.3f}")
                print(f"     Preview: {result.get('content', '')[:100]}...")
                
        except Exception as e:
            print(f"❌ Query failed: {query} - {e}")

if __name__ == "__main__":
    print("🚀 Populating Amrikyy bio data...")
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Run the population
    asyncio.run(create_bio_document())
    
    # Test retrieval
    asyncio.run(test_bio_retrieval())
    
    print("\n✅ Bio data population complete!")
