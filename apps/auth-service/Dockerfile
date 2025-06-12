# Builder Stage
FROM node:22-slim AS builder

WORKDIR /workspace

RUN apt-get update && apt-get install -y openssl

# Copy necessary files for building the app
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY .eslintrc.json ./
COPY webpack.*.config.js ./

COPY apps/auth-service ./apps/auth-service
COPY libs/graphql ./libs/graphql
COPY libs/grpc ./libs/grpc
COPY libs/nestjs ./libs/nestjs
COPY libs/mongodb ./libs/mongodb

# Install dependencies
RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler

# Build the app
RUN npx nx build auth-service

# Runner Stage
FROM node:22-slim AS runner

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Copy necessary files
COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/apps/auth-service/package.json ./apps/auth-service/package.json
COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/package.json
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json
COPY --from=builder /workspace/libs/mongodb/package.json ./libs/mongodb/package.json
COPY --from=builder /workspace/package-lock.json ./

# Set production environment
ENV NODE_ENV=production

# Install production dependencies
RUN npm ci

# Copy build output and other files
COPY --from=builder /workspace/node_modules/@prisma-clients/auth/ ./node_modules/@prisma-clients/auth/
COPY --from=builder /workspace/dist ./dist

# Run the application
CMD ["node", "dist/apps/auth/main"]
