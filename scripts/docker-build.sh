#!/bin/bash

# Build script for Docker containers
# Usage: ./scripts/docker-build.sh [environment]
# Environment: dev, prod (default: dev)

set -e

ENVIRONMENT=${1:-dev}
PROJECT_NAME="eshop"

echo "🐋 Building Docker containers for environment: $ENVIRONMENT"

case $ENVIRONMENT in
  "dev"|"development")
    echo "📦 Building development containers..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
    ;;
  "prod"|"production")
    echo "📦 Building production containers..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
    ;;
  *)
    echo "❌ Invalid environment: $ENVIRONMENT"
    echo "Valid options: dev, prod"
    exit 1
    ;;
esac

echo "✅ Build completed for $ENVIRONMENT environment"
