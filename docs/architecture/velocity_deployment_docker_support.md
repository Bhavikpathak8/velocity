# VELOCITY Deployment Guide (Docker & Production)

This document outlines the containerization and deployment strategy for the VELOCITY e-commerce platform, covering the Next.js frontend, Express.js backend, and PostgreSQL database.

## 1. Backend Dockerization (Express.js)

`backend/Dockerfile`
```dockerfile
# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose API port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
```

## 2. Frontend Dockerization (Next.js)

`frontend/Dockerfile`
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

## 3. Orchestration (Docker Compose)

`docker-compose.yml`
```yaml
version: '3.8'

services:
  # Database
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: velocity_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # API Backend
  backend:
    build: ./backend
    restart: always
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/velocity_db
      JWT_SECRET: ${JWT_SECRET}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
    depends_on:
      - db
    ports:
      - "5000:5000"

  # Web Frontend
  frontend:
    build: ./frontend
    restart: always
    environment:
      NEXT_PUBLIC_API_URL: http://backend:5000
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${STRIPE_PUB_KEY}
    depends_on:
      - backend
    ports:
      - "3000:3000"

volumes:
  postgres_data:
```

## 4. Environment Variables (.env)
Required keys for production deployment:
- `DB_USER` / `DB_PASSWORD`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY` / `STRIPE_PUB_KEY`
- `NODE_ENV=production`

## 5. Deployment Workflow
1. **Build:** `docker-compose build`
2. **Launch:** `docker-compose up -d`
3. **Migrate:** Run DB initialization scripts via `docker exec`.
