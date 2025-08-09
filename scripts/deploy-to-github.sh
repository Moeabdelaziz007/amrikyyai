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

# Create enhanced commit
echo "💾 Creating enhanced commit..."
git commit -m "🚀 Enhanced Amrikyy AI v2.0 - Advanced RAG System + Smart Dashboard

✨ New Features:
- 📊 Quantum Smart Dashboard with real-time analytics
- 🧠 Enhanced AI chatbot with smart suggestions
- 🎯 AI mode selection (Chat, Code, Analyze) 
- ⚡ Context-aware input suggestions
- 📈 Real-time performance monitoring
- 🔗 Professional LinkedIn integration
- 💼 Updated professional bio and credentials

🎛️ Smart Dashboard Features:
- Real-time query and performance analytics
- System health monitoring with live metrics
- RAG accuracy and LLM usage tracking
- Interactive data visualization
- Export and analysis tools
- Quantum-inspired UI design

🤖 Enhanced Chatbot:
- Smart contextual suggestions system
- Multi-mode AI interactions (Chat/Code/Analyze)
- Improved user experience with visual feedback
- Dynamic placeholders and mode indicators
- Enhanced message input with auto-suggestions

👤 Professional Updates:
- 🧠 AI x Web Dev (React, Firebase, LLMs)
- 🔐 Cybersecurity @KSU | ✨ 2× Dean's List + Honor Society
- 📈 Crypto Derivatives Trader | 🏛️ BlackRock Talent Community
- 🔗 LinkedIn: https://www.linkedin.com/in/mohamed-abdelaziz-815797347/

🛠️ Tech Stack Enhanced:
- Frontend: Next.js 14, React 18, Tailwind CSS, Zustand
- Backend: FastAPI, Python 3.11, SQLAlchemy, async/await
- AI: OpenAI GPT-4o, RAG pipeline, Vector embeddings
- Database: PostgreSQL, Redis, Pinecone/Weaviate
- Analytics: Real-time dashboard, performance monitoring
- Deployment: Docker, GitHub Actions, Multi-platform support

🧠 Advanced Expertise Areas:
- AI & Machine Learning (LLMs, RAG systems)
- Web Development (React, Firebase, Next.js)
- Cybersecurity & Network Security
- Crypto Trading & Financial Technology
- Software Architecture & Design Patterns
- Clean Code & SOLID Principles
- Performance Optimization & Analytics
- Real-time Systems & Data Visualization

Created by محمد عبدالعزيز (Amrikyy) - AI & Web Development Expert"

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
