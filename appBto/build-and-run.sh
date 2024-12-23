#!/bin/bash

# Build and start all services
docker-compose build
docker-compose up -d

# Wait for services to be ready
sleep 10

# Run initial setup
docker-compose exec backend npm run setup
docker-compose exec scraper python scraper.py

echo "Application is running!"
