# Use Node.js LTS as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Check if package.json exists and initialize it if it's missing or empty
RUN [ -f package.json ] || npm init -y

# Add dependencies required for the React app
RUN npm install react react-dom react-scripts axios

# Copy package.json and package-lock.json (if present) into the container
COPY package.json ./
#COPY package-lock.json ./ || true
#COPY package.json package-lock.json ./

# Install dependencies (if the file exists and contains dependencies)
RUN [ -s package.json ] && npm install || true

# Copy the rest of the application code into the container
COPY . .

# Build the React app
RUN npm run build

# Install a lightweight HTTP server to serve the React app
RUN npm install -g serve

# Expose port 3000 for the frontend
EXPOSE 3000

# Serve the React build folder in production
CMD ["serve", "-s", "build"]
