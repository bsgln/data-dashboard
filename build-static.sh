#!/bin/bash

# Build for static hosting
npm run build:client

echo "✅ Static build complete in dist/spa/"
echo "📁 Upload the dist/spa/ folder to any static host:"
echo "   - GitHub Pages"
echo "   - Netlify Drop"
echo "   - Vercel"
echo "   - Surge.sh"
echo "   - Firebase Hosting"

# Optional: Create a simple server for local testing
echo "🚀 To test locally: cd dist/spa && python -m http.server 8000"
