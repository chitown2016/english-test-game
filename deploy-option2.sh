#!/bin/bash
# Deploy EngQuest with backend on Lightsail and managed PostgreSQL (Supabase/Neon).
# Run this script as root or with sudo on the Lightsail box.
#
# Before running:
#   1. Either copy the english-test-game folder to /opt/engquest,
#      OR set REPO_URL below to a GitHub repo and the script will clone it.
#   2. Create a PostgreSQL database on Supabase or Neon and copy the connection string.
#   3. (Optional) Point a domain's A record to the Lightsail box public IP.
#      If you don't have a domain, you can use the Lightsail public IP directly over HTTP.

set -e

PROJECT_DIR="/opt/engquest"
NODE_VERSION="20"
# Optional: set this to your GitHub repo URL to clone instead of copying files
REPO_URL="https://github.com/chitown2016/english-test-game.git"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
  echo -e "${GREEN}[engquest]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[engquest]${NC} $1"
}

error() {
  echo -e "${RED}[engquest]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  error "Please run this script as root or with sudo: sudo bash deploy-option2.sh"
  exit 1
fi

# Check project exists or clone from GitHub
if [ ! -d "$PROJECT_DIR" ]; then
  if [ -n "$REPO_URL" ]; then
    log "Cloning project from $REPO_URL ..."
    git clone "$REPO_URL" "$PROJECT_DIR"
  else
    error "Project not found at $PROJECT_DIR."
    error "Copy the english-test-game folder to /opt/engquest first,"
    error "or set REPO_URL in this script to your GitHub repository."
    exit 1
  fi
fi

# Ensure project files are owned by the user who invoked sudo (not root)
if [ -n "$SUDO_USER" ]; then
  log "Setting ownership to $SUDO_USER ..."
  chown -R "$SUDO_USER:$SUDO_USER" "$PROJECT_DIR"
fi

# Helper to detect IP addresses
is_ip() {
  local ip="$1"
  if [[ "$ip" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    return 0
  fi
  return 1
}

# Prompt for required values
read -p "Domain name or public IP address (e.g., engquest.example.com or 1.2.3.4): " HOST
read -p "PostgreSQL connection string: " DATABASE_URL

if [ -z "$HOST" ] || [ -z "$DATABASE_URL" ]; then
  error "Host/IP and database URL are required."
  exit 1
fi

if is_ip "$HOST"; then
  USE_IP=true
  CORS_ORIGIN="http://$HOST"
  PROTOCOL="http"
  warn "Using IP address. SSL/HTTPS will be skipped."
  warn "Consider getting a free domain (e.g., DuckDNS) if you need HTTPS."
else
  USE_IP=false
  CORS_ORIGIN="https://$HOST"
  PROTOCOL="https"
fi

log "Starting deployment for $HOST ..."

# Update package list
log "Updating package list..."
apt-get update -y

# Install Node.js if not present
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'v' -f2 | cut -d'.' -f1)" != "$NODE_VERSION" ]; then
  log "Installing Node.js $NODE_VERSION..."
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash -
  apt-get install -y nodejs
else
  log "Node.js already installed: $(node -v)"
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
  log "Installing PM2..."
  npm install -g pm2
else
  log "PM2 already installed"
fi

warn "If your database password contains special characters (#, $, %, etc.),"
warn "make sure they are URL-encoded in the connection string."
warn "For example: # becomes %23, $ becomes %24."

# Backend setup
log "Setting up backend..."
cd "$PROJECT_DIR/backend"
npm install

# Create backend .env (quoted heredoc so $ in passwords is not expanded)
cat > .env <<'EOF'
PORT=3000
DATABASE_URL=$DATABASE_URL
CORS_ORIGIN=$CORS_ORIGIN
DB_MODE=pg
EOF

log "Running database migrations..."
npm run migrate

# Frontend setup
log "Building frontend..."
cd "$PROJECT_DIR/frontend"
npm install

# Set production API URL (same domain/IP via Nginx proxy)
cat > .env <<EOF
VITE_API_URL=/api
EOF

npm run build

# Nginx setup
log "Configuring Nginx..."
NGINX_SITE="/etc/nginx/sites-available/engquest"
NGINX_ENABLED="/etc/nginx/sites-enabled/engquest"

cat > "$NGINX_SITE" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $HOST;

    root $PROJECT_DIR/frontend/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
EOF

# Enable site
ln -sf "$NGINX_SITE" "$NGINX_ENABLED"

# Remove default site if it conflicts
if [ -f /etc/nginx/sites-enabled/default ]; then
  warn "Removing default Nginx site to avoid conflicts..."
  rm /etc/nginx/sites-enabled/default
fi

# Test and reload Nginx
nginx -t && systemctl reload nginx

# Start / restart backend with PM2
log "Starting backend with PM2..."
cd "$PROJECT_DIR/backend"
pm2 delete engquest-backend 2>/dev/null || true
pm2 start src/index.js --name engquest-backend
pm2 save
pm2 startup systemd -u michael --hp /home/michael 2>/dev/null || pm2 startup

# SSL with Certbot (only for domains)
if [ "$USE_IP" = false ]; then
  if ! command -v certbot &> /dev/null; then
    log "Installing Certbot..."
    apt-get install -y certbot python3-certbot-nginx
  fi
  log "Setting up SSL certificate..."
  certbot --nginx -d "$HOST" --non-interactive --agree-tos --no-eff-email -m "admin@$HOST" || true
fi

# Final ownership fix so the deploying user can manage files later
if [ -n "$SUDO_USER" ]; then
  log "Finalizing ownership for $SUDO_USER ..."
  chown -R "$SUDO_USER:$SUDO_USER" "$PROJECT_DIR"
fi

log "Deployment complete!"
log "Your site should be available at: $PROTOCOL://$HOST"
log ""
log "Useful commands:"
log "  pm2 logs engquest-backend    # view backend logs"
log "  pm2 restart engquest-backend # restart backend"
log "  systemctl status nginx       # check nginx"

if [ "$USE_IP" = true ]; then
  log ""
  warn "You are using an IP address. If the Lightsail instance is restarted,"
  warn "the public IP may change unless you attach a Lightsail static IP."
fi
