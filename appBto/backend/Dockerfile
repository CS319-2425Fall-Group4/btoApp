# Use Node.js LTS as the base image
FROM node:18

# Set the working directory inside the container (where server.js is located)
WORKDIR /usr/src/app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy the wait-for-it script into the image
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5000 for the backend
EXPOSE 5000

# Run wait-for-it.sh and start the server
CMD ["bash", "./wait-for-it.sh", "database:5432", "--", "node", "src/server.js"]
