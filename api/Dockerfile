# Use lightweight Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package.json package-lock.json ./
# Install dependencies
RUN npm install

# Copy source code
COPY . .
# Build TypeScript
RUN npm run build
# Expose port
EXPOSE 8000

# Run compiled app
CMD ["node", "dist/server.js"]