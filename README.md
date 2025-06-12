# E-Shop Backend - Microservices Architecture

[![Nx](https://img.shields.io/badge/Built%20with-Nx-143157.svg?style=flat&logo=nx)](https://nx.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-green.svg?style=flat&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red.svg?style=flat&logo=nestjs)](https://nestjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg?style=flat&logo=docker)](https://www.docker.com/)

A modern, scalable e-commerce backend built with **Nx monorepo**, **NestJS**, **gRPC**, and **MongoDB**. This microservices architecture provides a solid foundation for building enterprise-grade e-commerce applications.

## 🏗️ Architecture Overview

This workspace contains a microservices-based e-commerce backend with the following services:

- **🚪 API Gateway** (`api-gateway`) - HTTP REST API entry point (Port: 8080)
- **🔐 Auth Service** (`auth-service`) - Authentication and authorization (Port: 50051)
- **📚 Common Library** (`@eshop/common`) - Shared types, utilities, and protobuf definitions

### Technology Stack

- **Framework**: NestJS with TypeScript
- **Communication**: gRPC for inter-service communication
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with Passport.js
- **Build System**: Nx with Webpack
- **Package Manager**: pnpm
- **Containerization**: Docker with multi-stage builds
- **Runtime**: Node.js 22 Alpine

## 🚀 Quick Start

### Prerequisites

- **Node.js 22+** (recommended via [nvm](https://github.com/nvm-sh/nvm))
- **pnpm** package manager
- **Docker** and **Docker Compose**
- **Git**

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd eshop-backend

# Install dependencies
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**

```env
JWT_SECRET=your-super-secret-jwt-key-here
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-password-here
NODE_ENV=development
```

### 3. Start with Docker (Recommended)

```bash
# Start development environment
./scripts/docker-start.sh dev

# Or manually
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View logs
./scripts/docker-logs.sh all dev
```

### 4. Start without Docker (Local Development)

```bash
# Start MongoDB (ensure MongoDB is running locally)
# Start all services in development mode
pnpm dev

# Or start services individually
pnpm serve:auth-service
pnpm serve:api-gateway
```

## 📋 Available Commands

### Development Commands

```bash
# Start all services in development mode
pnpm dev

# Start specific service
pnpm serve:api-gateway
pnpm serve:auth-service

# Build all services
pnpm build

# Build specific service
pnpm build:api-gateway
pnpm build:auth-service

# Run tests
pnpm test
pnpm test:api-gateway
pnpm test:auth-service

# Lint code
pnpm lint
pnpm lint:fix

# Format code
pnpm format
pnpm format:check

# Generate protobuf types
pnpm generate:proto
```

### Docker Commands

```bash
# Development environment
./scripts/docker-start.sh dev
./scripts/docker-stop.sh dev
./scripts/docker-logs.sh all dev

# Production environment
./scripts/docker-start.sh prod
./scripts/docker-stop.sh prod
./scripts/docker-logs.sh all prod

# Build containers
./scripts/docker-build.sh dev
./scripts/docker-build.sh prod

# View logs for specific service
./scripts/docker-logs.sh api-gateway dev
```

### Nx Commands

```bash
# Show project graph
pnpm graph

# Run affected tests
pnpm affected:test

# Run affected builds
pnpm affected:build

# Show affected projects
nx affected --target=build --dry-run

# Show project details
nx show project api-gateway
```

## 🔧 Service Details

### API Gateway (Port: 8080)

- **Role**: HTTP REST API entry point
- **Responsibilities**: Request routing, authentication middleware, response formatting
- **Endpoints**:
  - `POST /auth/login` - User authentication
  - `POST /auth/register` - User registration
  - `GET /users/profile` - Get user profile (authenticated)
  - `GET /health` - Health check

### Auth Service (Port: 50051)

- **Role**: Authentication and authorization
- **Protocol**: gRPC
- **Responsibilities**: JWT token generation, user verification, password hashing
- **Methods**: `Login`, `Register`, `ValidateToken`

### User Service (Port: 50052)

- **Role**: User management and profiles
- **Protocol**: gRPC
- **Database**: MongoDB
- **Responsibilities**: User CRUD operations, profile management
- **Methods**: `CreateUser`, `GetUser`, `UpdateUser`, `DeleteUser`

## 🌍 Deployment

### Docker Production Deployment

```bash
# Create production environment file
cp .env.example .env.prod
# Edit .env.prod with production values

# Build and start production containers
./scripts/docker-build.sh prod
./scripts/docker-start.sh prod

# Scale services (Docker Swarm)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --scale api-gateway=3
```

### Container Health Checks

All services include health checks:

- **MongoDB**: Connection ping every 30s
- **Services**: TCP connection check every 30s
- **API Gateway**: HTTP health endpoint check

### Environment Configurations

- **Development**: Hot reload, exposed ports, volume mounts
- **Production**: Optimized builds, health checks, resource limits, replicas

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run e2e tests
pnpm test:e2e

# Run specific service tests
pnpm test:auth-service
pnpm test:api-gateway

# Test coverage
pnpm test --coverage
```

## 📊 Monitoring and Debugging

### View Logs

```bash
# All services
./scripts/docker-logs.sh all dev

# Specific service
./scripts/docker-logs.sh mongodb dev

# Follow logs in real-time
docker-compose logs -f api-gateway
```

### Health Checks

```bash
# Check all container health
docker-compose ps

# API Gateway health
curl http://localhost:8080/health

# MongoDB connection
docker exec eshop-mongodb mongosh --eval "db.adminCommand('ping')"
```

### Database Access

```bash
# Access MongoDB shell
docker exec -it eshop-mongodb mongosh -u admin -p password --authenticationDatabase admin

# View databases
docker exec -it eshop-mongodb mongosh -u admin -p password --authenticationDatabase admin --eval "show dbs"
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **gRPC Security**: Internal service communication
- **Docker Security**: Non-root users, minimal attack surface
- **Environment Variables**: Secure configuration management

## 🚦 API Endpoints

### Authentication

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### User Management

```http
GET /users/profile
Authorization: Bearer <jwt-token>
```

## 🔧 Development Setup

### VS Code Extensions (Recommended)

- Nx Console
- ESLint
- Prettier
- TypeScript Importer
- Docker
- Thunder Client (API testing)

### Project Structure

```
eshop-backend/
├── apps/
│   ├── api-gateway/          # HTTP REST API gateway
│   ├── auth-service/         # Authentication service
├── libs/
│   └── common/               # Shared libraries and types
├── proto/                    # Protocol Buffer definitions
├── scripts/                  # Docker utility scripts
├── docker-compose*.yml       # Docker configuration
└── Dockerfile               # Multi-service Docker build
```

## 🐛 Troubleshooting

### Common Issues

**1. Port Already in Use**

```bash
# Find process using port
lsof -i :8080
# Kill process
kill -9 <PID>
```

**2. MongoDB Connection Issues**

```bash
# Check MongoDB logs
./scripts/docker-logs.sh mongodb dev

# Restart MongoDB
docker-compose restart mongodb
```

**3. Build Failures**

```bash
# Clean Nx cache
pnpm clean

# Rebuild containers
./scripts/docker-build.sh dev
```

**4. Permission Issues (macOS/Linux)**

```bash
# Make scripts executable
chmod +x scripts/*.sh
```

## 📈 Performance Considerations

- **Build Optimization**: Multi-stage Docker builds
- **Caching**: Nx build caching, Docker layer caching
- **Resource Limits**: Production container resource limits
- **Connection Pooling**: MongoDB connection pooling
- **Load Balancing**: Multiple service replicas in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript and ESLint rules
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure Docker builds pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Nx, NestJS, and modern DevOps practices**
