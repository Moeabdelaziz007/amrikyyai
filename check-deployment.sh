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
