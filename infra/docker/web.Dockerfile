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

# Generate a partial monorepo with pruned lockfile for web workspace
RUN turbo prune @autonomi/web --docker

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
RUN turbo build --filter=@autonomi/web...

# Production stage
FROM base AS runner
RUN apk update && apk add --no-cache wget
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

USER bun

# Copy standalone output (includes traced node_modules and server.js)
COPY --from=installer --chown=bun:bun /app/apps/web/.next/standalone ./
# Copy static assets
COPY --from=installer --chown=bun:bun /app/apps/web/.next/static ./apps/web/.next/static
# Copy public assets
COPY --from=installer --chown=bun:bun /app/apps/web/public ./apps/web/public

# Run from the apps/web directory (standalone server.js expects this path)
WORKDIR /app/apps/web

EXPOSE 3000

# Health check for Swarm rolling updates
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Graceful shutdown signal for rolling updates
STOPSIGNAL SIGTERM

CMD ["bun", "run", "server.js"]
