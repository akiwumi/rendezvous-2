#!/bin/bash

echo "🚀 Rendezvous Social Club - Environment Setup"
echo "=============================================="
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled. Keeping existing .env file."
        exit 0
    fi
fi

# Copy template
cp .env.example .env
echo "✅ Created .env file from template"
echo ""

echo "📝 Next steps:"
echo "1. Create a Supabase project at https://app.supabase.com"
echo "2. Get your credentials from Settings > API"
echo "3. Edit .env and replace placeholder values"
echo "4. Run: npx expo start --web"
echo ""
echo "📖 See QUICK_START.md for detailed instructions"

