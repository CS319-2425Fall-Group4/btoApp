# Use Node.js LTS as the base image
FROM node:18

# Set the working directory inside the container (where server.js is located)
WORKDIR /usr/src/app

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# Expose port 5000 for the backend
EXPOSE 5000

# Run wait-for-db.sh and start the server
CMD ["/wait-for-db.sh", "database", "npm", "start"]
