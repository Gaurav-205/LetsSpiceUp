# Multi-stage build for production optimization

# Stage 1: Build backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy backend source
COPY backend/tsconfig.json ./
COPY backend/src ./src

# Build backend
RUN npm install --include=dev && npm run build && npm prune --production

# Stage 2: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source
COPY frontend ./

# Build frontend
RUN npm run build

# Stage 3: Production backend
FROM node:20-alpine AS backend-prod
WORKDIR /app

# Install production dependencies only
COPY --from=backend-builder /app/backend/package*.json ./
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 5000

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]

# Stage 4: Production frontend
FROM node:20-alpine AS frontend-prod
WORKDIR /app

# Install production dependencies
COPY --from=frontend-builder /app/frontend/package*.json ./
COPY --from=frontend-builder /app/frontend/.next ./.next
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/node_modules ./node_modules
COPY --from=frontend-builder /app/frontend/next.config.ts ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production
CMD ["npm", "start"]

