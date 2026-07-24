# Dockerfile for VELOCITY Platform
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Vite static assets
RUN npm run build

# Expose ports for API (5000) and Web App (3000)
EXPOSE 3000
EXPOSE 5000

# Start background API server and Vite preview/dev server
CMD ["npm", "run", "dev"]
