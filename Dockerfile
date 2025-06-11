# Multi-stage Dockerfile for Nx workspace
# This can be used to build specific services by passing --build-arg SERVICE_NAME=<service-name>

# Use Node.js 22 Alpine as the base image
FROM node:22-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Accept build argument for service name
ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

# Build stage
FROM base AS builder

WORKDIR /app

# Copy package manager files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies for building)
RUN pnpm install --frozen-lockfile

# Copy source code and configuration files
COPY . .

# Build the specific service
RUN pnpm nx build ${SERVICE_NAME} --configuration=production

# Production stage
FROM base AS production

ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

WORKDIR /app

# Copy the built application
COPY --from=builder /app/dist/apps/${SERVICE_NAME} ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Default port (can be overridden)
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Start the application
CMD ["node", "main.js"]
