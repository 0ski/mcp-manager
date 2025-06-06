# Dockerfile for webhook-handler
FROM oven/bun:alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY index.ts ./

# Start the application
CMD ["bun", "index.ts"]
