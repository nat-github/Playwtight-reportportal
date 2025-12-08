#!/bin/bash

echo "🚀 Setting up Playwright ReportPortal Framework..."

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p tests/{web,api}
mkdir -p reports/{screenshots,logs,junit}
mkdir -p src/{pages/{web,api},helpers}
mkdir -p test-results playwright-report

# Create .env file if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env 2>/dev/null || cat > .env << EOF
# Application URLs
BASE_URL_WEB=https://uibank.uipath.com
BASE_URL_API=https://jsonplaceholder.typicode.com

# ReportPortal Configuration
REPORTPORTAL_ENABLED=false
REPORTPORTAL_ENDPOINT=http://localhost:8080
REPORTPORTAL_PROJECT=default_personal
REPORTPORTAL_TOKEN=default_token_here
REPORTPORTAL_LAUNCH=Playwright_Tests

# Test Configuration
HEADLESS=true
SLOW_MO=0
RETRY_ATTEMPTS=1
EOF
    echo "⚠️  Please update .env file with your configuration"
fi

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install --with-deps chromium

# Create test files if they don't exist
if [ ! -f tests/web/login.spec.ts ]; then
    echo "📝 Creating test files..."
    
    # Create login test
    cat > tests/web/login.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('UI Bank Login Tests', () => {
  
  test('Navigate to UI Bank and verify page loads', async ({ page }) => {
    await page.goto('https://uibank.uipath.com');
    await expect(page).toHaveTitle(/UI Bank/);
    console.log('✅ UI Bank page loaded successfully');
  });

  test('Check login form exists', async ({ page }) => {
    await page.goto('https://uibank.uipath.com');
    const usernameField = page.locator('input[name="username"], input[type="email"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    console.log('✅ Login form found');
  });
});
EOF

    # Create API test
    cat > tests/api/jsonplaceholder.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('JSONPlaceholder API Tests', () => {
  
  test('GET /posts returns array of posts', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts');
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(posts.length).toBeGreaterThan(0);
    console.log(`✅ Got ${posts.length} posts`);
  });

  test('GET /posts/1 returns specific post', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post.id).toBe(1);
    console.log(`✅ Post 1 title: ${post.title}`);
  });
});
EOF
fi

echo "✅ Setup completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env file if needed"
echo "2. Run tests locally: npm test"
echo "3. Run with UI: npm run test:ui"
echo "4. Start ReportPortal: npm run docker:up"
echo "5. Run tests with Docker: npm run docker:test"