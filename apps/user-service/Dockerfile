# Use Node.js 22 Alpine as the base image
FROM node:22-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Build stage
FROM base AS builder

WORKDIR /app

# Copy package manager files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code and configuration files
COPY . .

# Build the application
RUN pnpm nx build user-service --configuration=production

# Production stage
FROM base AS production

WORKDIR /app

# Copy the built application
COPY --from=builder /app/dist/apps/user-service ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose the port
EXPOSE 50052

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('net').createConnection(50052, 'localhost').on('connect', () => process.exit(0)).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "main.js"]
