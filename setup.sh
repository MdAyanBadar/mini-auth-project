#!/bin/bash

# Mini Auth Quick Setup Script
echo "🚀 Mini Auth Setup Script"
echo "=========================="
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd backend
cp .env.example .env
echo "⚠️  Please edit backend/.env with your credentials:"
echo "   - DATABASE_URL (from NeonDB)"
echo "   - GOOGLE_CLIENT_ID (from Google Cloud Console)"
echo ""
npm install
cd ..

# Frontend setup
echo "📦 Setting up Frontend..."
cd frontend
cp .env.example .env
echo "⚠️  Please edit frontend/.env with your credentials:"
echo "   - VITE_GOOGLE_CLIENT_ID (same as backend)"
echo ""
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your NeonDB connection string and Google Client ID"
echo "2. Edit frontend/.env with your Google Client ID"
echo "3. Run backend: cd backend && npm run dev"
echo "4. Run frontend: cd frontend && npm run dev"
echo "5. Open http://localhost:3000"
echo ""
echo "📚 See README.md for detailed instructions"
