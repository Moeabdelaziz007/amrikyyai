#!/bin/bash

# Setup Amrikyy Persona in the Database
echo "🚀 Setting up Amrikyy AI with personal bio data..."

# Check if backend is running
if ! curl -f http://localhost:8000/health >/dev/null 2>&1; then
    echo "❌ Backend is not running. Please start it first:"
    echo "   cd backend && docker-compose up -d"
    exit 1
fi

# Check if database is accessible
echo "🔍 Checking database connectivity..."
cd backend

# Run the bio data population script
echo "📚 Populating bio data for محمد عبدالعزيز (Amrikyy)..."
python scripts/populate_bio_data.py

if [ $? -eq 0 ]; then
    echo "✅ Bio data populated successfully!"
    echo ""
    echo "🎉 Amrikyy AI is now personalized with your information!"
    echo ""
    echo "You can now ask questions like:"
    echo "  - من هو محمد عبدالعزيز؟"
    echo "  - ما هي خبرات Amrikyy المهنية؟"
    echo "  - أين درس محمد؟"
    echo "  - What is Amrikyy's background in AI?"
    echo "  - Tell me about Mohamed's certifications"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "📖 API Docs: http://localhost:8000/api/v1/docs"
else
    echo "❌ Failed to populate bio data. Check the logs above."
    exit 1
fi
