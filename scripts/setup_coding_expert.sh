#!/bin/bash

# Setup Amrikyy AI as Master Coding Expert
echo "🚀 Setting up Amrikyy AI as Master Coding Expert..."

# Check if backend is running
if ! curl -f http://localhost:8000/health >/dev/null 2>&1; then
    echo "❌ Backend is not running. Please start it first:"
    echo "   cd backend && docker-compose up -d"
    exit 1
fi

# Check if database is accessible
echo "🔍 Checking database connectivity..."
cd backend

# First populate personal bio data
echo "📚 Step 1: Populating personal bio data..."
python scripts/populate_bio_data.py

if [ $? -ne 0 ]; then
    echo "❌ Failed to populate bio data. Exiting."
    exit 1
fi

# Then populate coding expertise
echo "💻 Step 2: Populating advanced coding expertise..."
python scripts/populate_coding_expertise.py

if [ $? -eq 0 ]; then
    echo "✅ Coding expertise populated successfully!"
    echo ""
    echo "🎉 Amrikyy AI is now a MASTER CODING EXPERT!"
    echo ""
    echo "🧠 Expertise Areas:"
    echo "  ✓ Advanced Algorithms & Data Structures"
    echo "  ✓ Software Architecture & Design Patterns"
    echo "  ✓ Clean Code & SOLID Principles"
    echo "  ✓ Distributed Systems & Microservices"
    echo "  ✓ Performance Optimization & Profiling"
    echo "  ✓ Test-Driven Development (TDD)"
    echo "  ✓ Event Sourcing & CQRS"
    echo "  ✓ Functional Programming Patterns"
    echo "  ✓ Concurrency & Async Programming"
    echo "  ✓ DevOps & CI/CD Best Practices"
    echo ""
    echo "💬 Programming Languages:"
    echo "  🐍 Python (Expert)"
    echo "  🟨 JavaScript/TypeScript (Advanced)"
    echo "  🐹 Go (Intermediate)"
    echo "  🦀 Rust (Learning)"
    echo "  📊 SQL (Advanced)"
    echo "  🐚 Shell Scripting (Advanced)"
    echo ""
    echo "💡 You can now ask advanced questions like:"
    echo "  - 'Implement a circuit breaker pattern in Python'"
    echo "  - 'Show me clean architecture with CQRS'"
    echo "  - 'How to optimize this algorithm?'"
    echo "  - 'Design a microservices architecture'"
    echo "  - 'كيف أطبق مبادئ SOLID في الكود؟'"
    echo "  - 'Advanced async patterns in JavaScript'"
    echo "  - 'Event sourcing implementation'"
    echo "  - 'Performance profiling techniques'"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "📖 API Docs: http://localhost:8000/api/v1/docs"
    echo ""
    echo "🎓 Amrikyy (محمد عبدالعزيز) is ready to help with:"
    echo "  • Code reviews and best practices"
    echo "  • Architecture decisions and design patterns"
    echo "  • Performance optimization strategies"
    echo "  • Advanced programming concepts"
    echo "  • Real-world development challenges"
else
    echo "❌ Failed to populate coding expertise. Check the logs above."
    exit 1
fi
