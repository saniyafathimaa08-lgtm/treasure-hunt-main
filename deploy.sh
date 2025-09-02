#!/bin/bash

echo "🚀 IEDC Treasure Hunt Deployment Script"
echo "======================================"

# Check if git is clean
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ Please commit all changes before deploying"
    exit 1
fi

echo "✅ Git repository is clean"

# Update environment for production
echo "📝 Updating environment for production..."

# Create production .env file
cat > .env.production << EOF
DATABASE_URL=postgresql://user:password@host:port/database
PORT=5000
NODE_ENV=production
EOF

echo "✅ Production environment file created"
echo ""
echo "🌐 Deployment Options:"
echo "1. Render (Recommended) - Full-stack deployment"
echo "2. Railway - Backend deployment"
echo "3. Netlify + Render - Hybrid deployment"
echo ""
echo "📋 Next Steps:"
echo "1. Choose your deployment platform"
echo "2. Follow the instructions in DEPLOYMENT.md"
echo "3. Update the DATABASE_URL in .env.production"
echo "4. Deploy your application"
echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT.md"
echo ""
echo "🔗 Quick Links:"
echo "- Render: https://render.com"
echo "- Railway: https://railway.app"
echo "- Netlify: https://netlify.com"
echo ""
echo "✨ Happy Deploying!"
