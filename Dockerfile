# Multi-stage Dockerfile for Angular 18 frontend
# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy project sources
COPY angular.json tsconfig*.json ./
COPY public ./public
COPY src ./src

# Build (production by default due to angular.json defaultConfiguration)
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine AS runtime
LABEL org.opencontainers.image.source="https://example.com/your/jira-frontend" \
      org.opencontainers.image.description="Jira-like Angular frontend" \
      org.opencontainers.image.licenses="MIT"

# Remove default nginx site config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom nginx config (with SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /app/dist/jira-like-app/browser /usr/share/nginx/html

# (Optional) Add a non-root user - nginx image already uses nginx user for worker processes.
# Expose HTTP port
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

# Use default nginx entrypoint/cmd
