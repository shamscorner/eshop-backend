#!/bin/bash

# Start script for Docker containers
# Usage: ./scripts/docker-start.sh [environment]
# Environment: dev, prod (default: dev)

set -e

ENVIRONMENT=${1:-dev}

echo "🚀 Starting Docker containers for environment: $ENVIRONMENT"

case $ENVIRONMENT in
  "dev"|"development")
    echo "🔧 Starting development environment..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
    ;;
  "prod"|"production")
    echo "🏭 Starting production environment..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
    ;;
  *)
    echo "❌ Invalid environment: $ENVIRONMENT"
    echo "Valid options: dev, prod"
    exit 1
    ;;
esac

echo "✅ Containers started for $ENVIRONMENT environment"
echo "📊 Container status:"
docker-compose ps
