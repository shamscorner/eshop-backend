#!/bin/bash

# Stop script for Docker containers
# Usage: ./scripts/docker-stop.sh [environment]
# Environment: dev, prod, all (default: dev)

set -e

ENVIRONMENT=${1:-dev}

echo "🛑 Stopping Docker containers for environment: $ENVIRONMENT"

case $ENVIRONMENT in
  "dev"|"development")
    echo "🔧 Stopping development environment..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
    ;;
  "prod"|"production")
    echo "🏭 Stopping production environment..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
    ;;
  "all")
    echo "🛑 Stopping all environments..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml down 2>/dev/null || true
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml down 2>/dev/null || true
    ;;
  *)
    echo "❌ Invalid environment: $ENVIRONMENT"
    echo "Valid options: dev, prod, all"
    exit 1
    ;;
esac

echo "✅ Containers stopped for $ENVIRONMENT environment"
