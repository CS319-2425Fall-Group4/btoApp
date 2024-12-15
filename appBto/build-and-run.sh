#!/bin/bash

# --- Project-specific Build and Run Script for BTO App ---

# Exit immediately if a command exits with a non-zero status.
set -e

# Define colors for output.
GREEN="\033[0;32m"
RED="\033[0;31m"
RESET="\033[0m"

# Print the start of the script.
echo -e "${GREEN}Starting Build and Run Process for BTO App...${RESET}"

# Step 1: Ensure Docker is running.
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Docker is not running. Please start Docker and try again.${RESET}"
  exit 1
fi

# Step 2: Clean up old Docker containers and volumes.
echo -e "${GREEN}Cleaning up old containers and volumes...${RESET}"
docker-compose down --volumes --remove-orphans

# Step 3: Build Docker images.
echo -e "${GREEN}Building Docker images...${RESET}"
docker-compose build

# Step 4: Start Docker containers.
echo -e "${GREEN}Starting Docker containers...${RESET}"
docker-compose up --build -d

# Step 5: Check the status of containers.
echo -e "${GREEN}Checking container statuses...${RESET}"
docker-compose ps

# Step 6: Display helpful information about the running app.
echo -e "${GREEN}BTO App is running successfully!${RESET}"
echo -e "${GREEN}Frontend is available at: http://localhost:3000${RESET}"
echo -e "${GREEN}Backend is available at: http://localhost:5000${RESET}"
echo -e "${GREEN}Database is connected to PostgreSQL.${RESET}"

# Step 7: Log cleanup (optional).
echo -e "${GREEN}To view logs, use:${RESET}"
echo -e "  ${GREEN}docker-compose logs -f${RESET}"

# Final success message.
echo -e "${GREEN}Done! Your BTO App is ready.${RESET}"
