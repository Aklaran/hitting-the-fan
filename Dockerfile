# ============================================
# Stage 1: Build Frontend
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY app/frontend/package.json ./app/frontend/
COPY app/backend/package.json ./app/backend/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY app/frontend ./app/frontend
COPY app/shared ./app/shared

# Build frontend
WORKDIR /app/app/frontend
RUN pnpm build

# ============================================
# Stage 2: Build Backend
# ============================================
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY app/backend/package.json ./app/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code and prisma schema
COPY app/backend ./app/backend
COPY app/shared ./app/shared

# Generate Prisma Client
WORKDIR /app/app/backend
RUN pnpm prisma generate

# Build TypeScript
RUN pnpm build

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY app/backend/package.json ./app/backend/

# Install ONLY production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy Prisma schema and generate client (needed at runtime)
COPY app/backend/prisma ./app/backend/prisma
WORKDIR /app/app/backend
RUN pnpm prisma generate

# Copy built backend from builder stage
COPY --from=backend-builder /app/app/backend/dist ./dist

# Copy shared code (if needed at runtime)
COPY --from=backend-builder /app/app/shared /app/app/shared

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

# Expose port (internal to container)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/auth/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/server.js"]
