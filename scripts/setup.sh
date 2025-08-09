#!/bin/bash

# Amrikyy AI Setup Script
echo "🚀 Setting up Amrikyy AI..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file
echo "📝 Creating environment file..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created .env file. Please edit it with your API keys."
else
    echo "⚠️  .env file already exists. Skipping creation."
fi

# Create storage directories
echo "📁 Creating storage directories..."
mkdir -p backend/storage/documents
mkdir -p backend/storage/temp
mkdir -p backend/logs

# Start infrastructure services
echo "🐳 Starting infrastructure services..."
cd backend
docker-compose up -d postgres redis weaviate

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
# TODO: Add Alembic migration commands when ready

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Install backend dependencies (if running locally)
echo "🐍 Setting up Python environment..."
cd ../backend
if command -v python3 &> /dev/null; then
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    echo "✅ Python environment created and dependencies installed."
else
    echo "⚠️  Python3 not found. Using Docker for backend."
fi

cd ..

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your OpenAI API key and other configurations"
echo "2. Start the development servers:"
echo "   Frontend: cd frontend && npm run dev"
echo "   Backend: cd backend && docker-compose up backend"
echo "3. Open http://localhost:3000 to access the application"
echo ""
echo "For more information, see the README.md file."
