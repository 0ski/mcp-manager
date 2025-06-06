# Multi-stage Dockerfile for Webhook Handler using Bun
FROM oven/bun:alpine AS base

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install

# Create app directory
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/
WORKDIR /temp/dev
RUN bun install

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
WORKDIR /temp/prod
RUN bun install --production

# Copy node_modules from temp directory
# Then copy all (non-ignored) project files into the image
FROM base AS prerelease
WORKDIR /app

# Copy production dependencies
COPY --from=install /temp/prod/node_modules node_modules

# Copy source code
COPY . .

# Copy production dependencies and source code into final image
FROM base AS release
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S bun-user
RUN adduser -S bun-user -u 1001 -G bun-user

# Copy application files
COPY --from=prerelease --chown=bun-user:bun-user /app/index.ts ./index.ts
COPY --from=prerelease --chown=bun-user:bun-user /app/node_modules ./node_modules
COPY --from=prerelease --chown=bun-user:bun-user /app/package.json ./package.json
COPY --from=prerelease --chown=bun-user:bun-user /app/tsconfig.json ./tsconfig.json

# Switch to non-root user
USER bun-user

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "const http = require('http'); http.get('http://localhost:3000', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Start the application
CMD ["bun", "run", "index.ts"]
