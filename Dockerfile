# Simple Node.js container
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY src/ ./src/

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"] 