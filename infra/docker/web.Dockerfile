# Base image with Bun
FROM oven/bun:1.3.1 AS base

# Install turbo CLI globally using Bun
FROM base AS turbo-cli
RUN bun add -g turbo

# Builder stage - prune dashboard workspace
FROM turbo-cli AS builder
WORKDIR /app
# Copy all files
COPY . .
# Prune dashboard workspace
RUN turbo prune @autonomi/web --docker

# Installer stage
FROM base AS installer
WORKDIR /app

# Copy package.json files from pruned workspace
COPY --from=builder /app/out/json/ .
COPY bunfig.toml .

# Install dependencies
RUN bun install

# Copy full source from pruned workspace
COPY --from=builder /app/out/full/ .

# Build-time NEXT_PUBLIC_ env vars (Railway passes these as build args)
ARG NEXT_PUBLIC_PRIVY_APP_ID

# Release tracking (Railway provides the git SHA automatically)
ARG RAILWAY_GIT_COMMIT_SHA
ENV NEXT_PUBLIC_SENTRY_RELEASE=$RAILWAY_GIT_COMMIT_SHA
ENV CI=true

# Build engine types (dependency) then dashboard only
# TURBO_UI=plain avoid interactive/stream UI so the RUN exits cleanly in Docker
ENV NODE_ENV=production
ENV TURBO_UI=plain
ENV TURBO_TELEMETRY_DISABLED=1


# Force no cache, no daemon, single run
RUN bunx turbo run build --filter=@autonomi/web...

# Runner stage - clean bun image, no turbo
FROM oven/bun:1.3.1 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --no-log-init -g nodejs nextjs

# Copy standalone output
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

CMD ["bun", "apps/web/server.js"]