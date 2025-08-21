#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "🚀 Starting deployment process..."

# Step 1: Build the Next.js application for production.
echo "📦 Building Next.js application..."
npm run build

# Step 2: Deploy to Firebase.
# This command deploys Hosting.
# You can add other services like 'firestore' if you need to deploy rules.
echo "🔥 Deploying to Firebase (Hosting)..."
firebase deploy --only hosting

echo "✅ Deployment to Firebase completed successfully!"
