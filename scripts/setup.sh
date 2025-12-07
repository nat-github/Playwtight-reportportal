#!/bin/bash

echo "🚀 Setting up Playwright with ReportPortal..."

# Copy environment template
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your credentials"
fi

# Create reports directory
echo "📁 Creating report directories..."
mkdir -p reports/{html-report,junit}

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Playwright
echo "🌐 Installing Playwright browsers..."
npx playwright install --with-deps

echo "✅ Setup completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env file with your UI Bank credentials"
echo "2. Update REPORTPORTAL_TOKEN in .env"
echo "3. Start ReportPortal: npm run docker:up"
echo "4. Run tests: npm run test:reportportal"
echo "5. View results at: http://localhost:8080"