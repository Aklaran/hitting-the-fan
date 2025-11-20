# Deployment Guide

This guide walks you through deploying your Hitting the Fan application to your VPS using Docker.

## Architecture Overview

```
                    Internet
                       │
                       ▼
                ┌─────────────┐
                │   Nginx     │ :80, :443
                │  (Alpine)   │
                └──────┬──────┘
                       │
          ┌────────────┼────────────┐
          │                         │
          ▼                         ▼
    ┌──────────┐            ┌────────────┐
    │ Backend  │ :3000      │  Postgres  │ :5432
    │ (Node.js)│────────────│   (v16)    │
    └──────────┘            └────────────┘
                                   │
                                   ▼
                            ┌────────────┐
                            │  Backup    │
                            │  Service   │
                            └────────────┘
```

**Services:**

- **Nginx**: Reverse proxy, serves static files, handles SSL
- **Backend**: Node.js/Express/tRPC API (port 3000, internal only)
- **Postgres**: PostgreSQL database (port 5432, internal only)
- **Backup**: Automated daily backups

**Network:**

- Only Nginx is exposed to the internet (ports 80/443)
- Backend and Postgres communicate on private Docker network
- All services restart automatically on failure

## Prerequisites

### On Your Local Machine (Mac)

- Docker Desktop installed (for local testing)
- Node.js 20+ and pnpm installed
- SSH access to your VPS

### On Your VPS (Ubuntu)

- Docker and Docker Compose installed
- At least 512MB RAM (you have this!)
- SSH access configured

## First-Time Setup

### 1. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and set:

```bash
# Database
DB_NAME=hitting_the_fan
DB_USER=htfuser
DB_PASSWORD=<generate strong password>

# Session
SESSION_SECRET=<generate with: openssl rand -base64 32>

# Kinde Auth (from https://app.kinde.com/)
KINDE_DOMAIN=your-subdomain.kinde.com
KINDE_CLIENT_ID=your_client_id
KINDE_CLIENT_SECRET=your_client_secret
KINDE_REDIRECT_URI=http://your-vps-ip/api/auth/kinde_callback
KINDE_LOGOUT_REDIRECT_URI=http://your-vps-ip

# Logging (optional)
# Valid values: fatal, error, warn, info, debug, trace
# Default: info (production), debug (development)
LOG_LEVEL=info
# Log file path for production (only used in production)
# Default: /var/log/htf/htf.log
# Note: The docker-compose.yml mounts a volume to /var/log/htf
LOG_FILE_PATH=/var/log/htf/htf.log
```

### 2. Update SSH Configuration (Optional)

If your VPS SSH config is different, update these in `deploy.sh`:

```bash
VPS_USER="aklaran"
VPS_HOST="hitting-the-fan-ubuntu-vps"
VPS_PATH="~/app"
```

### 3. Install Docker on VPS

If not already installed:

```bash
ssh aklaran@hitting-the-fan-ubuntu-vps

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Log out and back in for group changes to take effect
exit
```

### 4. Initial Database Setup

Since you're migrating from Supabase, you have two options:

**Option A: Start Fresh**

```bash
# Just deploy - migrations will run automatically
./deploy.sh
```

**Option B: Migrate from Supabase**

```bash
# Export from Supabase
pg_dump $SUPABASE_DATABASE_URL > supabase-export.sql

# Deploy the app first
./deploy.sh

# Import data
cat supabase-export.sql | ssh aklaran@hitting-the-fan-ubuntu-vps \
  'cd ~/app && docker compose exec -T postgres psql -U htfuser htf'
```

## Deployment

### Deploy to Production

Run the deployment script:

```bash
./deploy.sh
```

This will:

1. Build frontend locally
2. Check for `.env` file
3. Sync files to VPS
4. Build Docker images on VPS
5. Start containers
6. Run database migrations
7. Perform health checks

### Manual Deployment Steps

If you prefer to deploy manually:

```bash
# 1. Build frontend locally
cd app/frontend
pnpm build
cd ../..

# 2. Sync to VPS
rsync -avz --exclude='node_modules' --exclude='.git' \
  ./ aklaran@hitting-the-fan-ubuntu-vps:~/app/

# 3. On VPS, build and start
ssh aklaran@hitting-the-fan-ubuntu-vps
cd ~/app
docker compose build
docker compose up -d
docker compose exec backend npx prisma migrate deploy
```

## Database Management

### Backups

**Automatic Backups:**

- Daily backups run automatically at midnight
- Kept for 7 days, 4 weeks, 6 months (configurable)
- Stored in `~/app/backups` on VPS

**Manual Backup:**

```bash
./backup.sh backup
```

**List Backups:**

```bash
./backup.sh list
```

**Download Backups:**

```bash
./backup.sh download
```

**Restore from Backup:**

```bash
./backup.sh restore backups/htf-20241019.sql.gz
```

**Cleanup Old Backups:**

```bash
./backup.sh cleanup
```

### Database Migrations

**Create a migration:**

```bash
cd app/backend
pnpm prisma migrate dev --name your_migration_name
```

**Deploy migrations to production:**

```bash
# Migrations run automatically during deployment
# Or manually:
ssh aklaran@hitting-the-fan-ubuntu-vps \
  'cd ~/app && docker compose exec backend npx prisma migrate deploy'
```

## Monitoring & Debugging

### View Logs

**All services:**

```bash
ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose logs -f'
```

**Specific service:**

```bash
ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose logs -f backend'
ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose logs -f nginx'
ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose logs -f postgres'
```

### Check Service Status

```bash
ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose ps'
```

### Access Database

```bash
ssh aklaran@hitting-the-fan-ubuntu-vps \
  'cd ~/app && docker compose exec postgres psql -U htfuser htf'
```

### Restart Services

**All services:**

```bash
ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose restart'
```

**Specific service:**

```bash
ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose restart backend'
```

### Resource Usage

```bash
ssh aklaran@hitting-the-fan-ubuntu-vps 'docker stats'
```

## Troubleshooting

### Out of Memory Errors

If you see OOM errors:

1. **Check memory usage:**

   ```bash
   ssh aklaran@hitting-the-fan-ubuntu-vps 'free -h'
   ```

2. **Reduce Postgres memory:**
   Edit `docker-compose.yml` and lower `shared_buffers`:

   ```yaml
   command:
     - 'postgres'
     - '-c'
     - 'shared_buffers=64MB' # Lower this
   ```

3. **Restart services:**
   ```bash
   ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose restart'
   ```

### Container Won't Start

1. **Check logs:**

   ```bash
   ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose logs backend'
   ```

2. **Check environment variables:**

   ```bash
   ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && cat .env'
   ```

3. **Rebuild container:**
   ```bash
   ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose up -d --build backend'
   ```

### Database Connection Errors

1. **Verify Postgres is running:**

   ```bash
   ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose ps postgres'
   ```

2. **Check DATABASE_URL:**

   ```bash
   ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose exec backend env | grep DATABASE_URL'
   ```

3. **Test connection:**
   ```bash
   ssh aklaran@hitting-the-fan-ubuntu-vps \
     'cd ~/app && docker compose exec postgres pg_isready -U htfuser'
   ```

### Nginx Configuration Errors

1. **Test config:**

   ```bash
   ssh aklaran@hitting-the-fan-ubuntu-vps \
     'cd ~/app && docker compose exec nginx nginx -t'
   ```

2. **Reload config:**
   ```bash
   ssh aklaran@hitting-the-fan-ubuntu-vps \
     'cd ~/app && docker compose exec nginx nginx -s reload'
   ```

## Adding SSL/HTTPS

Once you have a domain name pointed to your VPS:

### 1. Install Certbot on VPS

```bash
ssh aklaran@hitting-the-fan-ubuntu-vps
sudo apt-get update
sudo apt-get install certbot
```

### 2. Get SSL Certificate

```bash
sudo certbot certonly --standalone -d yourdomain.com
```

### 3. Copy Certificates

```bash
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ~/app/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ~/app/ssl/
sudo chown $USER:$USER ~/app/ssl/*
```

### 4. Update nginx.conf

Uncomment the HTTPS section in `nginx.conf` and update domain name.

### 5. Restart Nginx

```bash
cd ~/app
docker compose restart nginx
```

### 6. Auto-Renewal

Add to crontab:

```bash
0 0 1 * * certbot renew --quiet && cp /etc/letsencrypt/live/yourdomain.com/*.pem ~/app/ssl/ && cd ~/app && docker compose restart nginx
```

## Performance Optimization

### Postgres Tuning

For 512MB RAM, current settings are optimal. If you upgrade RAM:

```yaml
# In docker-compose.yml
command:
  - 'postgres'
  - '-c'
  - 'shared_buffers=256MB' # 25% of RAM
  - '-c'
  - 'effective_cache_size=1GB' # 50% of RAM
```

### Nginx Caching

Already configured! Static files cache for 1 year.

### Backend Optimization

Consider adding:

- Connection pooling (already configured via Prisma)
- Redis for session storage (for multiple backend instances)

## Scaling Up

When you outgrow your VPS:

### Vertical Scaling

- Upgrade to 1GB/2GB RAM droplet
- No code changes needed!

### Horizontal Scaling

- Add more backend containers (load balanced by Nginx)
- Move Postgres to managed database (DigitalOcean, Supabase, Neon)
- Add Redis for shared sessions

## Costs

**Current Setup:**

- VPS: $4/month (DigitalOcean)
- Domain: ~$12/year (optional)
- SSL: Free (Let's Encrypt)
- **Total: $4-5/month**

**If you scale:**

- Larger VPS: $12-24/month
- Managed Database: $15-25/month
- Still way cheaper than multiple SaaS services!

## Security Checklist

- [ ] Strong database password in `.env`
- [ ] Session secret generated securely
- [ ] `.env` file NOT committed to git
- [ ] Firewall configured (only ports 22, 80, 443 open)
- [ ] SSH key authentication (disable password auth)
- [ ] Regular backups verified
- [ ] SSL certificate installed
- [ ] Nginx rate limiting enabled (already configured)

## Support

Having issues? Check:

1. Logs: `docker compose logs -f`
2. Service status: `docker compose ps`
3. Resource usage: `docker stats`

## What's Next?

Ideas for improvements:

- Add monitoring (Prometheus + Grafana)
- Set up CI/CD with GitHub Actions
- Add staging environment
- Implement blue-green deployments
- Add log aggregation (Loki)
- Set up alerting (when things break)
