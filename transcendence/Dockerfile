# Use Node.js base image
FROM node:22

# Install jq
RUN apt-get update && apt-get install -y jq

# Set working directory
WORKDIR /app

# Copy backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy everything
COPY . .

# Set the default working directory to backend
WORKDIR /app/backend

# ⬅️ Copy the entrypoint script into the root of the container
COPY /entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port
EXPOSE 3000

# Use custom entrypoint to wait for Vault setup
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

