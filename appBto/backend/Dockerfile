# Use Node.js LTS as the base image
#FROM node:18

# Set the working directory inside the container
#WORKDIR /usr/src/app
#WORKDIR /src/

# Check if package.json exists and initialize it if it's missing or empty
#RUN [ -f package.json ] || npm init -y

# Add the required dependencies to package.json
#RUN npm install express sequelize pg pg-hstore dotenv

# Add development dependencies for convenience
#RUN npm install --save-dev nodemon

# Copy the rest of the application code
#COPY . .

# Expose port 5000 for the backend
#EXPOSE 5000

# Start the backend server in production mode
#CMD ["npm", "start"]

# Use Node.js LTS as the base image
FROM node:18

# Set the working directory inside the container (where server.js is located)
WORKDIR /usr/src/app

# Copy the wait-for-it script into the image
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

# Copy package.json and package-lock.json first for better caching
#COPY package.json package-lock.json ./
COPY package.json ./

# Install dependencies from package.json
RUN npm install

# Copy the rest of the application code (including src/)
COPY . .

# Expose port 5000 for the backend
EXPOSE 5000

# Run wait-for-it.sh and start the server
CMD ["bash", "./wait-for-it.sh", "database:5432", "--", "node", "src/server.js"]
