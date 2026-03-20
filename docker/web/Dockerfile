# =============================================================================
# docker/web/Dockerfile — Nginx frontend container
#
# Stage 1 (builder): installs deps and runs the Vite SPA build.
# Stage 2 (runner):  minimal Nginx image serving the static SPA and
#                    reverse-proxying /api/* to the Express API container.
#
# Build context must be the project root (set in docker-compose.yml):
#   docker build -f docker/web/Dockerfile .
# =============================================================================

# ---- Stage 1: Build --------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

# Enable native addon compilation (required for better-sqlite3 which is pulled
# in by npm ci even though the web stage doesn't use it at runtime)
RUN apk add --no-cache python3 make g++

# Install all dependencies
COPY package*.json ./
RUN npm ci

# Copy source tree
COPY . .

# Compile: Vite builds frontend SPA → .local/vite/dist/
RUN npm run build:vite

# ---- Stage 2: Runtime ------------------------------------------------------
FROM nginx:1.27-alpine

# Copy built SPA assets
COPY --from=builder /app/.local/vite/dist /usr/share/nginx/html

# Nginx site config — proxies /api/* to Express API container
COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
