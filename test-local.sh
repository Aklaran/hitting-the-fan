#!/bin/bash

# ============================================
# Local Docker Testing Script
# Test your Docker setup on Mac before deploying
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Local Docker Test${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
cd app/frontend
pnpm build
cd ../..
echo -e "${GREEN}✓ Frontend built${NC}"
echo ""

# Start Docker Compose
echo -e "${YELLOW}Starting Docker containers...${NC}"
docker compose -f docker-compose.local.yml up -d
echo ""

# Wait for services
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

# Health check
echo -e "${YELLOW}Running health check...${NC}"
HEALTH=$(curl -s http://localhost:8080/api/health || echo "failed")

if [[ $HEALTH == *"ok"* ]]; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo "Health check failed. Showing logs:"
    docker compose -f docker-compose.local.yml logs backend
    exit 1
fi

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Success! Your app is running locally${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Visit: http://localhost:8080"
echo ""
echo "Commands:"
echo "  View logs:  docker compose -f docker-compose.local.yml logs -f"
echo "  Stop:       docker compose -f docker-compose.local.yml down"
echo "  Restart:    docker compose -f docker-compose.local.yml restart"
echo ""
