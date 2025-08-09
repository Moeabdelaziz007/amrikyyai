# Amrikyy AI - RAG-Powered AI Assistant

> مساعد ذكي، موجز، واعٍ للسياق، يعطي إجابات مستندة إلى مصادر (cited)

## Project Overview

Amrikyy AI is a ChatGPT-like conversational AI assistant powered by RAG (Retrieval-Augmented Generation) that provides sourced, accurate answers while avoiding hallucination.

### Key Features

- 🔍 **RAG-powered responses** with source citations
- 📚 **Document ingestion** from multiple sources (PDF, DOCX, Slack, Google Drive, etc.)
- 🎨 **Modern UI** with React + Next.js + Tailwind CSS
- ⚡ **Real-time streaming** responses
- 🔒 **Enterprise-ready** with authentication and ACLs
- 📊 **Admin dashboard** for content management and analytics

## Architecture

```
Frontend (Next.js + React + Tailwind)
    ↓
API Gateway (REST + GraphQL)
    ↓
Backend (FastAPI)
    ├── Ingestion Pipeline
    ├── Vector Database (Pinecone/Weaviate)
    ├── RAG Orchestrator
    └── LLM Service
    ↓
Storage (PostgreSQL + S3 + Redis)
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI**: React 18 + Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **API**: FastAPI with async/await
- **Database**: PostgreSQL (metadata) + Redis (cache)
- **Vector DB**: Pinecone (managed) or Weaviate (self-hosted)
- **File Storage**: S3-compatible storage
- **Queue**: Celery with Redis

### ML/AI
- **Embeddings**: OpenAI text-embedding-3-large
- **LLM**: OpenAI GPT-4o / Gemini Pro
- **Reranker**: Cross-encoder models
- **OCR**: Tesseract

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL
- Redis

### Setup

1. **Clone and install dependencies**:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
pip install -r requirements.txt
```

2. **Environment setup**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database setup**:
```bash
# Run migrations
cd backend
alembic upgrade head
```

4. **Start development servers**:
```bash
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev
```

## Project Structure

```
amrikyy-ai/
├── frontend/                 # Next.js frontend application
├── backend/                  # FastAPI backend application
├── shared/                   # Shared types and utilities
├── docs/                     # Documentation
├── docker/                   # Docker configuration
├── k8s/                      # Kubernetes manifests
├── .github/                  # GitHub workflows
└── README.md
```

## Development Phases

- **Phase 0 (Week 0-2)**: Infrastructure setup and basic chat
- **Phase 1 (Week 3-6)**: MVP with file upload and RAG
- **Phase 2 (Week 7-10)**: Connectors and advanced features
- **Phase 3 (Week 11-16)**: Enterprise features and scaling
- **Phase 4 (Ongoing)**: Analytics and optimization

## Contributing

Please read our [Contributing Guide](./docs/CONTRIBUTING.md) for development setup and coding standards.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
