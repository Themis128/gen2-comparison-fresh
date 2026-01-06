#!/bin/bash

# Playwright Test Runner with Dev Server
# This script starts the dev server and runs tests

set -e

# Configuration
PORT=50000
DEV_SERVER_PID=""

# Function to clean up processes
cleanup() {
    echo "🧹 Cleaning up..."
    if [ ! -z "$DEV_SERVER_PID" ]; then
        echo "Stopping dev server (PID: $DEV_SERVER_PID)..."
        kill $DEV_SERVER_PID 2>/dev/null || true
    fi
    # Also kill any remaining next processes
    pkill -f "next dev" 2>/dev/null || true
}

# Set trap to cleanup on exit
trap cleanup EXIT INT TERM

echo "🚀 Starting Playwright E2E tests..."
echo "📁 Working directory: $(pwd)"

# Start the dev server in the background
echo "🌐 Checking Next.js dev server on port $PORT..."
if curl -s http://localhost:$PORT > /dev/null 2>&1; then
    echo "✅ Dev server is already running on port $PORT"
else
    echo "🌐 Starting Next.js dev server on port $PORT..."
    npx next dev --port $PORT &
    DEV_SERVER_PID=$!
fi

# Wait for the server to be ready
echo "⏳ Waiting for dev server to start..."
for i in {1..30}; do
    if curl -s http://localhost:$PORT > /dev/null 2>&1; then
        echo "✅ Dev server is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Dev server failed to start within 30 seconds"
        exit 1
    fi
    sleep 1
done

# Set the base URL for Playwright
export PLAYWRIGHT_BASE_URL="http://localhost:$PORT"

echo "🎭 Running Playwright tests..."
echo "   Base URL: $PLAYWRIGHT_BASE_URL"

# Run the tests with explicit configuration
if [ "$1" ]; then
    # Run specific test file if provided
    npx playwright test "$1" --reporter=list
else
    # Run all tests
    npx playwright test --reporter=list
fi

echo "🎉 Tests completed!"
