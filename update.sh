#!/bin/bash
# Update an already-deployed EngQuest instance (see deploy-option2.sh for first-time setup).
# Run on the Lightsail box: bash /opt/engquest/update.sh

set -e

PROJECT_DIR="/opt/engquest"

GREEN='\033[0;32m'
NC='\033[0m'

log() {
  echo -e "${GREEN}[engquest]${NC} $1"
}

cd "$PROJECT_DIR"

log "Pulling latest code..."
git pull

log "Installing backend dependencies (only if changed)..."
cd "$PROJECT_DIR/backend"
npm install

log "Building frontend..."
cd "$PROJECT_DIR/frontend"
npm install
npm run build

log "Restarting backend..."
pm2 restart engquest-backend

log "Update complete! Site is running the latest code."
