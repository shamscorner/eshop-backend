#!/bin/bash

# Logs script for Docker containers
# Usage: ./scripts/docker-logs.sh [service] [environment]
# Service: mongodb, auth-service, api-gateway, all (default: all)
# Environment: dev, prod (default: dev)

set -e

SERVICE=${1:-all}
ENVIRONMENT=${2:-dev}

echo "📋 Showing logs for service: $SERVICE in environment: $ENVIRONMENT"

case $ENVIRONMENT in
  "dev"|"development")
    COMPOSE_FILES="-f docker-compose.yml -f docker-compose.dev.yml"
    ;;
  "prod"|"production")
    COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
    ;;
  *)
    echo "❌ Invalid environment: $ENVIRONMENT"
    echo "Valid options: dev, prod"
    exit 1
    ;;
esac

case $SERVICE in
  "mongodb"|"auth-service"|"api-gateway")
    docker-compose $COMPOSE_FILES logs -f $SERVICE
    ;;
  "all")
    docker-compose $COMPOSE_FILES logs -f
    ;;
  *)
    echo "❌ Invalid service: $SERVICE"
    echo "Valid options: mongodb, auth-service, api-gateway, all"
    exit 1
    ;;
esac
