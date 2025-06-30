FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with verbose output for debugging
RUN npm ci --verbose

# Copy application code
COPY src/ ./src/

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"] 