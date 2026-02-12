# syntax=docker/dockerfile:1
FROM oven/bun:1.3.5-alpine AS base

# Builder stage - prunes monorepo and installs dependencies
FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Install turbo globally with specific version for better caching
RUN bun install -g turbo@^2

# Copy entire monorepo for pruning
COPY . .

# Generate a partial monorepo with pruned lockfile for server workspace
RUN turbo prune @autonomi/api --docker

# Installer stage - installs dependencies from pruned workspace
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Install turbo in this stage too since we need it for building
RUN bun install -g turbo@^2

# Copy lockfile and package.json files from pruned workspace
COPY --from=builder /app/out/json/ .

# Install dependencies (includes dev dependencies needed for build)
RUN bun install

# Copy source files
COPY --from=builder /app/out/full/ .

# Build the application
RUN turbo build --filter=@autonomi/api...

# Production stage
FROM base AS production
RUN apk update && apk add --no-cache wget
WORKDIR /app

# Copy only production dependencies
COPY --from=builder /app/out/json/ .
RUN bun install

# Copy built packages (including @autonomi/types with dist/ folder)
COPY --from=installer --chown=bun:bun /app/packages ./packages

# Copy the application code
COPY --from=installer --chown=bun:bun /app/apps/api ./apps/api

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4001

USER bun

# Set working directory to the API app
WORKDIR /app/apps/api

EXPOSE 4001

# Health check for Swarm rolling updates
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4001/health || exit 1

# Graceful shutdown signal for rolling updates
STOPSIGNAL SIGTERM

CMD ["bun", "run", "src/index.ts"]