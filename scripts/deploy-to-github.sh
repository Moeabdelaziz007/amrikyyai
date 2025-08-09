#!/bin/bash

# Deploy Amrikyy AI to GitHub Repository
echo "🚀 Deploying Amrikyy AI to GitHub..."

# Configuration
REPO_URL="https://github.com/Moeabdelaziz007/amrikyyai.git"
REPO_NAME="amrikyyai"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Navigate to project root
cd /Users/cryptojoker710/amrikyy-ai

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git branch -M main
fi

# Add remote origin
echo "🔗 Setting up remote repository..."
git remote remove origin 2>/dev/null || true
git remote add origin $REPO_URL

# Create .gitignore for production
echo "📋 Creating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.py[cod]
*$py.class

# Environment files
.env
.env.local
.env.production
.env.staging
*.env

# Build outputs
build/
dist/
.next/
out/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Storage
storage/
temp/
uploads/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Database
*.sqlite
*.db

# Vector databases
*.index
*.faiss

# Certificates
*.pem
*.key
*.crt

# Docker
.dockerignore

# Monitoring
grafana_data/
prometheus_data/
loki_data/
EOF

# Stage all files
echo "📦 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "🎉 Initial commit: Amrikyy AI - RAG-powered coding expert

✨ Features:
- Complete RAG pipeline with vector search
- Advanced coding expertise knowledge base
- Bilingual support (Arabic/English)
- Personal AI assistant (محمد عبدالعزيز/Amrikyy)
- Modern Next.js frontend with chat UI
- FastAPI backend with async processing
- Docker containerization
- Production-ready deployment configs

🧠 Expertise Areas:
- Advanced Algorithms & Data Structures
- Software Architecture & Design Patterns
- Clean Code & SOLID Principles
- Microservices & Distributed Systems
- Performance Optimization
- Test-Driven Development
- Event Sourcing & CQRS
- Concurrency & Async Programming

🛠️ Tech Stack:
- Frontend: Next.js 14, React 18, Tailwind CSS
- Backend: FastAPI, Python 3.11, SQLAlchemy
- AI: OpenAI GPT-4, Vector embeddings
- Database: PostgreSQL, Redis, Pinecone/Weaviate
- Deployment: Docker, GitHub Actions, Nginx

Created by محمد عبدالعزيز (Amrikyy) - Technology Expert & AI Developer"

# Push to GitHub
echo "🚀 Pushing to GitHub repository..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Successfully deployed to GitHub!"
    echo ""
    echo "📍 Repository: $REPO_URL"
    echo "🔗 View at: https://github.com/Moeabdelaziz007/amrikyyai"
    echo ""
    echo "📋 Next steps:"
    echo "1. 🔑 Set up GitHub Secrets for deployment:"
    echo "   - OPENAI_API_KEY"
    echo "   - PINECONE_API_KEY" 
    echo "   - DEPLOY_HOST (your server)"
    echo "   - DEPLOY_USER (SSH user)"
    echo "   - DEPLOY_KEY (SSH private key)"
    echo ""
    echo "2. 🌐 Configure your domain:"
    echo "   - Update ALLOWED_HOSTS in env.production"
    echo "   - Set up SSL certificates"
    echo "   - Configure DNS records"
    echo ""
    echo "3. 🚀 Deploy to production:"
    echo "   - Use docker-compose.prod.yml"
    echo "   - Set up monitoring with Grafana/Prometheus"
    echo "   - Configure backup strategies"
    echo ""
    echo "4. 🧠 Populate knowledge base:"
    echo "   - Run ./scripts/setup_coding_expert.sh on server"
    echo "   - Verify vector database connection"
    echo "   - Test RAG pipeline functionality"
    echo ""
    echo "💡 Your AI coding expert is ready to deploy!"
else
    echo "❌ Failed to push to GitHub. Please check your credentials and try again."
    echo "Make sure you have write access to the repository."
    exit 1
fi
