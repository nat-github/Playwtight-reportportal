# Use official Playwright image with all browsers
FROM mcr.microsoft.com/playwright:v1.42.1-focal

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (production only for smaller image)
RUN npm ci --only=production

# Copy source code
COPY . .

# Install Playwright browsers (Chromium only to save space)
RUN npx playwright install --with-deps chromium

# Create directories for reports
RUN mkdir -p reports/screenshots reports/logs reports/junit \
    test-results playwright-report

# Set environment variables
ENV CI=true
ENV HEADLESS=true

# Default command - runs all tests
CMD ["npx", "playwright", "test", "--reporter=html,list"]