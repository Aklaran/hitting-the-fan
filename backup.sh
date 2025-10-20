#!/bin/bash

# ============================================
# Database Backup & Restore Script
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
VPS_USER="${VPS_USER:-aklaran}"
VPS_HOST="${VPS_HOST:-hitting-the-fan-ubuntu-vps}"
VPS_PATH="${VPS_PATH:-~/app}"
BACKUP_DIR="./backups"

# ============================================
# Functions
# ============================================

show_usage() {
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  backup              Create a backup of the database"
    echo "  list                List all available backups"
    echo "  restore <file>      Restore from a backup file"
    echo "  download            Download all backups from VPS"
    echo "  cleanup             Remove backups older than 30 days"
    echo ""
    echo "Examples:"
    echo "  $0 backup"
    echo "  $0 restore backups/htf-20241019.sql.gz"
    echo "  $0 download"
    exit 1
}

backup() {
    echo -e "${YELLOW}Creating database backup...${NC}"

    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="htf-${TIMESTAMP}.sql.gz"

    ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${VPS_PATH}
docker compose exec -T postgres pg_dump -U htfuser htf | gzip > backups/${BACKUP_FILE}
ENDSSH

    echo -e "${GREEN}✓ Backup created: ${BACKUP_FILE}${NC}"
    echo ""
    echo "To download: ./backup.sh download"
}

list_backups() {
    echo -e "${YELLOW}Backups on VPS:${NC}"
    echo ""

    ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${VPS_PATH}/backups
ls -lh *.sql.gz 2>/dev/null || echo "No backups found"
ENDSSH
}

restore() {
    if [ -z "$1" ]; then
        echo -e "${RED}Error: Please specify a backup file${NC}"
        echo "Usage: $0 restore <backup-file>"
        echo ""
        echo "Available backups:"
        list_backups
        exit 1
    fi

    BACKUP_FILE="$1"

    if [ ! -f "$BACKUP_FILE" ]; then
        echo -e "${RED}Error: Backup file not found: ${BACKUP_FILE}${NC}"
        exit 1
    fi

    echo -e "${RED}WARNING: This will overwrite the current database!${NC}"
    read -p "Are you sure? (yes/no): " -r
    echo

    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "Restore cancelled"
        exit 0
    fi

    echo -e "${YELLOW}Restoring database from ${BACKUP_FILE}...${NC}"

    # Upload backup to VPS if not already there
    BASENAME=$(basename "$BACKUP_FILE")
    scp "$BACKUP_FILE" ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/backups/

    # Restore on VPS
    ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${VPS_PATH}

# Stop backend to prevent connections
docker compose stop backend

# Drop and recreate database
docker compose exec -T postgres psql -U htfuser -d postgres << 'EOSQL'
DROP DATABASE IF EXISTS htf;
CREATE DATABASE htf;
EOSQL

# Restore from backup
gunzip < backups/${BASENAME} | docker compose exec -T postgres psql -U htfuser htf

# Start backend
docker compose start backend
ENDSSH

    echo -e "${GREEN}✓ Database restored successfully${NC}"
}

download() {
    echo -e "${YELLOW}Downloading backups from VPS...${NC}"

    mkdir -p "$BACKUP_DIR"

    rsync -avz --progress \
        ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/backups/ \
        "$BACKUP_DIR/"

    echo -e "${GREEN}✓ Backups downloaded to ${BACKUP_DIR}/${NC}"
}

cleanup() {
    echo -e "${YELLOW}Cleaning up old backups (older than 30 days)...${NC}"

    ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${VPS_PATH}/backups
find . -name "htf-*.sql.gz" -mtime +30 -delete
echo "Remaining backups:"
ls -lh *.sql.gz 2>/dev/null || echo "No backups found"
ENDSSH

    echo -e "${GREEN}✓ Cleanup complete${NC}"
}

# ============================================
# Main Script
# ============================================

case "${1:-}" in
    backup)
        backup
        ;;
    list)
        list_backups
        ;;
    restore)
        restore "$2"
        ;;
    download)
        download
        ;;
    cleanup)
        cleanup
        ;;
    *)
        show_usage
        ;;
esac
