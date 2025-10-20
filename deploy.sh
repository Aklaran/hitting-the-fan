#!/bin/bash

# ============================================
# Deployment Script for Hitting the Fan
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
VPS_USER="${VPS_USER:-aklaran}"
VPS_HOST="${VPS_HOST:-hitting-the-fan-ubuntu-vps}"
VPS_PATH="${VPS_PATH:-~/app}"

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Hitting the Fan - Deployment Script${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# ============================================
# Step 1: Build Frontend Locally
# ============================================
echo -e "${YELLOW}[1/6] Building frontend...${NC}"
cd app/frontend
pnpm build
cd ../..
echo -e "${GREEN}✓ Frontend built${NC}"
echo ""

# ============================================
# Step 2: Check for .env file
# ============================================
echo -e "${YELLOW}[2/6] Checking environment variables...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}✗ .env file not found!${NC}"
    echo "Please create a .env file based on .env.example"
    exit 1
fi
echo -e "${GREEN}✓ .env file found${NC}"
echo ""

# ============================================
# Step 3: Sync files to VPS
# ============================================
echo -e "${YELLOW}[3/6] Syncing files to VPS...${NC}"

# Create necessary directories on VPS
ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${VPS_PATH}/{app/backend,app/frontend/dist,backups,ssl}"

# Rsync files
rsync -avz --progress \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    --exclude='dist' \
    --exclude='coverage' \
    ./ ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/

echo -e "${GREEN}✓ Files synced${NC}"
echo ""

# ============================================
# Step 4: Build and Start Docker Containers
# ============================================
echo -e "${YELLOW}[4/6] Building and starting Docker containers on VPS...${NC}"

ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd ~/app

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Pull latest images
docker compose pull postgres nginx backup 2>/dev/null || true

# Build backend
echo "Building backend image..."
docker compose build backend

# Stop old containers
echo "Stopping old containers..."
docker compose down

# Start new containers
echo "Starting new containers..."
docker compose up -d

# Wait for services to be healthy
echo "Waiting for services to start..."
sleep 10

# Check status
docker compose ps
ENDSSH

echo -e "${GREEN}✓ Docker containers started${NC}"
echo ""

# ============================================
# Step 5: Run Database Migrations
# ============================================
echo -e "${YELLOW}[5/6] Running database migrations...${NC}"

ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd ~/app
docker compose exec -T backend npx prisma migrate deploy
ENDSSH

echo -e "${GREEN}✓ Migrations completed${NC}"
echo ""

# ============================================
# Step 6: Health Check
# ============================================
echo -e "${YELLOW}[6/6] Running health checks...${NC}"

sleep 5

# Get VPS IP
VPS_IP=$(ssh ${VPS_USER}@${VPS_HOST} "curl -s ifconfig.me")

echo "Checking backend health..."
HEALTH_RESPONSE=$(curl -s "http://${VPS_IP}/api/health" || echo "failed")

if [[ $HEALTH_RESPONSE == *"ok"* ]]; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
    echo "Response: $HEALTH_RESPONSE"
    exit 1
fi

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Your app is running at: http://${VPS_IP}"
echo ""
echo "Useful commands:"
echo "  View logs:        ssh ${VPS_USER}@${VPS_HOST} 'cd ~/app && docker compose logs -f'"
echo "  Restart:          ssh ${VPS_USER}@${VPS_HOST} 'cd ~/app && docker compose restart'"
echo "  Stop:             ssh ${VPS_USER}@${VPS_HOST} 'cd ~/app && docker compose down'"
echo "  Database shell:   ssh ${VPS_USER}@${VPS_HOST} 'cd ~/app && docker compose exec postgres psql -U htfuser htf'"
echo ""
