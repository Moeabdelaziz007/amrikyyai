#!/bin/bash

# Setup GitHub Deployment for Amrikyy AI
echo "🚀 Setting up GitHub deployment for Amrikyy AI..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📋 GitHub Deployment Setup Checklist:"
echo ""

echo "1. 🔧 Frontend (GitHub Pages):"
echo "   ✅ Next.js configured for static export"
echo "   ✅ GitHub Actions workflow created"
echo "   ✅ Will be available at: https://moeabdelaziz007.github.io/amrikyyai"
echo ""

echo "2. 🔧 Backend Options:"
echo ""
echo "   Option A: Render (Recommended - Free tier available)"
echo "   📋 Steps:"
echo "   1. Go to https://render.com and sign up"
echo "   2. Connect your GitHub repository"
echo "   3. Use the render.yaml configuration provided"
echo "   4. Set environment variables in Render dashboard:"
echo "      - OPENAI_API_KEY=your-openai-key"
echo "      - PINECONE_API_KEY=your-pinecone-key"
echo "   5. Deploy will be automatic from GitHub pushes"
echo ""

echo "   Option B: Railway"
echo "   📋 Steps:"
echo "   1. Go to https://railway.app and sign up"
echo "   2. Connect GitHub repository"
echo "   3. Deploy backend directory"
echo "   4. Add environment variables"
echo ""

echo "   Option C: Vercel (Serverless)"
echo "   📋 Steps:"
echo "   1. Go to https://vercel.com and sign up"
echo "   2. Import GitHub repository"
echo "   3. Configure build settings for FastAPI"
echo ""

echo "3. 🔑 Required GitHub Secrets:"
echo "   Go to your repository → Settings → Secrets and variables → Actions"
echo "   Add these secrets:"
echo ""
echo "   For Render deployment:"
echo "   - RENDER_API_KEY=your-render-api-key"
echo "   - RENDER_SERVICE_ID=your-service-id"
echo ""
echo "   For Railway deployment:"
echo "   - RAILWAY_TOKEN=your-railway-token"
echo ""
echo "   General secrets:"
echo "   - OPENAI_API_KEY=your-openai-api-key"
echo "   - PINECONE_API_KEY=your-pinecone-api-key"
echo ""

echo "4. 🌐 Enable GitHub Pages:"
echo "   1. Go to repository → Settings → Pages"
echo "   2. Source: GitHub Actions"
echo "   3. The workflow will automatically deploy on push to main"
echo ""

echo "5. 🧠 Knowledge Base Setup:"
echo "   After backend deployment, run these commands on your server:"
echo "   - Setup coding expertise: curl -X POST https://your-backend-url/api/v1/setup"
echo "   - Or manually populate via admin interface"
echo ""

echo "6. 🔗 Update API URL:"
echo "   Once backend is deployed, update the frontend environment:"
echo "   - Edit .github/workflows/github-pages.yml"
echo "   - Change NEXT_PUBLIC_API_URL to your deployed backend URL"
echo ""

echo "📱 Expected URLs after deployment:"
echo "   Frontend: https://moeabdelaziz007.github.io/amrikyyai"
echo "   Backend (Render): https://amrikyy-ai-backend.onrender.com"
echo "   API Docs: https://amrikyy-ai-backend.onrender.com/api/v1/docs"
echo ""

echo "🎯 Quick Start Commands:"
echo ""
echo "# Push changes to trigger deployment"
echo "git add ."
echo "git commit -m 'Setup GitHub deployment'"
echo "git push origin main"
echo ""

echo "# Check deployment status"
echo "echo 'Visit https://github.com/Moeabdelaziz007/amrikyyai/actions'"
echo ""

echo "🎉 GitHub deployment is configured!"
echo "   Next: Set up your cloud backend service and update the API URL"

# Create a quick deployment status checker
cat > check-deployment.sh << 'EOF'
#!/bin/bash
echo "🔍 Checking Amrikyy AI deployment status..."
echo ""

echo "Frontend (GitHub Pages):"
curl -s -o /dev/null -w "Status: %{http_code}\n" https://moeabdelaziz007.github.io/amrikyyai/ || echo "❌ Not accessible"

echo ""
echo "Backend (if deployed):"
curl -s -o /dev/null -w "Status: %{http_code}\n" https://amrikyy-ai-backend.onrender.com/health || echo "❌ Not accessible"

echo ""
echo "GitHub Actions:"
echo "Visit: https://github.com/Moeabdelaziz007/amrikyyai/actions"
EOF

chmod +x check-deployment.sh
echo "📊 Created deployment checker: ./check-deployment.sh"
