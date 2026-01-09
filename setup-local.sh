#!/bin/bash

# Rendezvous Social Club - Local Development Setup
# This script sets up everything you need for local testing

set -e

echo "🚀 Rendezvous Social Club - Local Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
echo "📦 Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo "Please start Docker Desktop and try again."
    echo "Download: https://www.docker.com/products/docker-desktop"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Check if Supabase CLI is installed
echo "🔧 Checking Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI not found. Installing...${NC}"
    
    # Detect OS and install
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install supabase/tap/supabase
        else
            echo -e "${RED}❌ Homebrew not found. Install from: https://brew.sh${NC}"
            echo "Or install Supabase CLI manually: npm install -g supabase"
            exit 1
        fi
    else
        # Linux or other - use npm
        npm install -g supabase
    fi
fi
echo -e "${GREEN}✅ Supabase CLI installed${NC}"
echo ""

# Initialize Supabase if not already done
if [ ! -d "supabase/.temp" ]; then
    echo "🎯 Initializing Supabase..."
    supabase init
    echo -e "${GREEN}✅ Supabase initialized${NC}"
else
    echo -e "${GREEN}✅ Supabase already initialized${NC}"
fi
echo ""

# Start Supabase
echo "🚢 Starting Supabase containers..."
echo "This may take 2-3 minutes on first run..."
echo ""

supabase start

echo ""
echo -e "${GREEN}✅ Supabase started successfully!${NC}"
echo ""

# Get the credentials
echo "📋 Getting local credentials..."
SUPABASE_URL=$(supabase status | grep "API URL" | awk '{print $3}')
SUPABASE_ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')

# Create .env file
echo "📝 Creating .env file..."
cat > .env << EOF
# Local Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=$SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Stripe (demo keys - not functional)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_demo
SUPABASE_SERVICE_ROLE_KEY=demo
STRIPE_SECRET_KEY=sk_test_demo
EOF

echo -e "${GREEN}✅ .env file created${NC}"
echo ""

# Run database migrations
echo "🗄️  Setting up database schema..."
supabase db reset --db-url postgresql://postgres:postgres@localhost:54322/postgres

echo -e "${GREEN}✅ Database schema created${NC}"
echo ""

# Run seed data
echo "🌱 Seeding database with dummy data..."
PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed.sql > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database seeded with dummy data${NC}"
else
    echo -e "${YELLOW}⚠️  Seed file might have issues, but continuing...${NC}"
fi
echo ""

# Print summary
echo ""
echo "================================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "================================================"
echo ""
echo "📊 Supabase Studio: http://localhost:54323"
echo "🌐 API URL: $SUPABASE_URL"
echo ""
echo "👥 Test Accounts:"
echo "   Admin:  admin@local.dev / admin123"
echo "   User 1: alice@local.dev / alice123"
echo "   User 2: bob@local.dev / bob123"
echo "   User 3: carol@local.dev / carol123"
echo "   User 4: david@local.dev / david123"
echo ""
echo "🎯 Dummy Data Included:"
echo "   • 6 events with RSVPs"
echo "   • 4 feed posts"
echo "   • 8 gallery images"
echo "   • 4 friend connections"
echo "   • Multiple notifications"
echo ""
echo "🚀 Starting the app..."
echo ""

# Start Expo
npx expo start --web

echo ""
echo "✨ Happy testing! ✨"
