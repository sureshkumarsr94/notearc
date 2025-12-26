#!/bin/bash

# Deployment Script for NoteArc on AWS Lightsail

APP_NAME="notearc"
PORT=3000

echo "Starting deployment for $APP_NAME..."

# 1. Pull latest changes (if running from git)
# git pull origin main

# 2. Build Docker Image
echo "Building Docker image..."
docker build -t $APP_NAME .

# 3. Stop existing container if running
if [ "$(docker ps -q -f name=$APP_NAME)" ]; then
    echo "Stopping existing container..."
    docker stop $APP_NAME
    docker rm $APP_NAME
fi

# 4. Run new container
echo "Starting new container..."
# Ensure .env file exists and pass it to the container
if [ -f .env ]; then
    docker run -d \
        --name $APP_NAME \
        --restart unless-stopped \
        -p $PORT:3000 \
        --env-file .env \
        $APP_NAME
else
    echo "Error: .env file not found. Please create one with necessary environment variables."
    exit 1
fi

echo "Deployment successful! App running on port $PORT"
