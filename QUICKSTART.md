# Quick Start Guide

Get your app deployed in 5 minutes!

## What I've Set Up For You

Your project now has a complete Docker deployment stack:

```
hitting-the-fan/
├── Dockerfile              # Multi-stage build for backend
├── docker-compose.yml      # Orchestrates all services
├── nginx.conf              # Reverse proxy configuration
├── .dockerignore          # Excludes unnecessary files
├── .env.example           # Environment variable template
├── deploy.sh              # One-command deployment
├── backup.sh              # Database backup/restore tools
├── DEPLOYMENT.md          # Comprehensive deployment guide
└── QUICKSTART.md          # This file!
```

## Changes Made to Your Code

**app/backend/src/server.ts:**
- ✅ Removed static file serving (Nginx handles this now)
- ✅ Added `/api/health` endpoint for health checks
- ✅ Backend now only handles API routes

That's it! Your app is now containerized and ready to deploy.

## Deploy Right Now (5 Steps)

### Step 1: Create Environment File (2 minutes)

```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `DB_PASSWORD`: A strong password
- `SESSION_SECRET`: Run `openssl rand -base64 32`
- Kinde credentials from https://app.kinde.com/

### Step 2: Update Kinde Redirect URLs (1 minute)

In Kinde dashboard, update your callback URLs to:
- Redirect URL: `http://YOUR_VPS_IP/api/auth/kinde_callback`
- Logout URL: `http://YOUR_VPS_IP`

### Step 3: Ensure Docker is Installed on VPS (Skip if done)

```bash
ssh aklaran@hitting-the-fan-ubuntu-vps

# Quick Docker install
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo apt-get install docker-compose-plugin

# Log out and back in
exit
```

### Step 4: Deploy! (2 minutes)

```bash
./deploy.sh
```

That's it! The script will:
- Build your frontend
- Sync files to VPS
- Build Docker images
- Start all containers (nginx, backend, postgres)
- Run migrations
- Verify everything is working

### Step 5: Visit Your App

```
http://YOUR_VPS_IP
```

## What's Running?

After deployment, you have:

- **Nginx** on port 80 (serving your React app + proxying API)
- **Backend** on internal port 3000 (tRPC API)
- **Postgres** on internal port 5432 (database)
- **Backup Service** (daily automatic backups)

## Useful Commands

**View logs:**
```bash
ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose logs -f'
```

**Restart everything:**
```bash
ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose restart'
```

**Create backup:**
```bash
./backup.sh backup
```

**Check what's running:**
```bash
ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose ps'
```

## Troubleshooting

**Deployment fails?**
1. Check `.env` file exists and has all values
2. Verify you can SSH to VPS: `ssh aklaran@hitting-the-fan-ubuntu-vps`
3. Check VPS has Docker: `ssh aklaran@hitting-the-fan-ubuntu-vps 'docker --version'`

**App not loading?**
1. Check logs: `ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose logs'`
2. Check backend health: `curl http://YOUR_VPS_IP/api/health`
3. Verify containers are running: `ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose ps'`

**Out of memory?**
- This shouldn't happen with current setup (~250MB total usage)
- Check: `ssh aklaran@hitting-the-fan-ubuntu-vps 'free -h'`

## Next Steps

Once you're comfortable with the basic deployment:

1. **Add a Domain** - Point a domain to your VPS IP
2. **Enable HTTPS** - Free SSL with Let's Encrypt (instructions in DEPLOYMENT.md)
3. **Set Up Monitoring** - Know when things break
4. **Automate Deployments** - GitHub Actions (push to deploy)

See `DEPLOYMENT.md` for detailed instructions on all of this.

## Understanding the Stack

**How it works:**

```
User visits http://your-vps-ip
    │
    ▼
Nginx (port 80)
    │
    ├─ /               → Serves React app (static files)
    ├─ /api/trpc       → Proxies to backend:3000
    └─ /api/auth       → Proxies to backend:3000
                             │
                             ▼
                        Backend (port 3000)
                             │
                             ▼
                        Postgres (port 5432)
```

**Why this is better than installing directly:**
- ✅ Builds happen on your Mac (plenty of RAM)
- ✅ VPS just runs pre-built containers (low memory)
- ✅ Nginx handles static files (10-50x faster than Node)
- ✅ Backend only handles API (more efficient)
- ✅ Automatic restarts on failure
- ✅ Easy rollbacks (just redeploy old version)
- ✅ Portable (works on any server with Docker)

## Memory Usage

Your 512MB VPS should be plenty:

```
nginx:     ~10MB
backend:   ~100MB
postgres:  ~60MB
backup:    ~5MB
OS:        ~50MB
─────────────────
Total:     ~225MB
Free:      ~287MB + 1GB swap
```

## Development Workflow

```bash
# 1. Make changes locally
# 2. Test locally (optional - Docker Compose works on Mac too!)
docker compose up

# 3. Deploy to VPS
./deploy.sh

# 4. Monitor
ssh aklaran@hitting-the-fan-ubuntu-vps 'cd ~/app && docker compose logs -f backend'
```

## Questions?

- **Comprehensive guide**: Read `DEPLOYMENT.md`
- **Backup/restore**: Run `./backup.sh` (no arguments for help)
- **Deployment options**: Run `./deploy.sh` and check the script

Happy deploying!
