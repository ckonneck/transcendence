# Use Node.js base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy everything
COPY . .

# Set the default working directory to backend
WORKDIR /app/backend

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]

