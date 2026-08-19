#!/bin/bash
# Run this on your Lightsail box to collect resource diagnostics.
# Usage: bash diagnose.sh

echo "=================================="
echo "EngQuest Deployment Diagnostics"
echo "=================================="
echo ""

echo "--- OS Info ---"
uname -a
if command -v lsb_release &> /dev/null; then
  lsb_release -a 2>/dev/null
fi
echo ""

echo "--- Memory ---"
free -h
echo ""

echo "--- Swap ---"
swapon --show 2>/dev/null || echo "No swap enabled"
echo ""

echo "--- Disk Usage ---"
df -h -x tmpfs -x devtmpfs
echo ""

echo "--- CPU Load (1 / 5 / 15 min) ---"
uptime
echo ""

echo "--- Top Memory Consumers ---"
ps aux --sort=-%mem | head -20
echo ""

echo "--- Top CPU Consumers ---"
ps aux --sort=-%cpu | head -10
echo ""

echo "--- PostgreSQL Status ---"
if command -v pg_isready &> /dev/null; then
  pg_isready
elif systemctl list-units --full -all 2>/dev/null | grep -q postgresql; then
  systemctl status postgresql --no-pager 2>/dev/null | head -10
else
  echo "PostgreSQL not detected"
fi
echo ""

echo "--- Node.js / npm ---"
if command -v node &> /dev/null; then
  node -v
  npm -v
else
  echo "Node.js not installed"
fi
echo ""

echo "--- Listening Ports ---"
if command -v ss &> /dev/null; then
  ss -tlnp
elif command -v netstat &> /dev/null; then
  netstat -tlnp 2>/dev/null | head -30
else
  echo "ss/netstat not available"
fi
echo ""

echo "--- Nginx / Caddy Status ---"
if command -v nginx &> /dev/null; then
  nginx -v 2>&1
  systemctl status nginx --no-pager 2>/dev/null | head -5
elif command -v caddy &> /dev/null; then
  caddy version
  systemctl status caddy --no-pager 2>/dev/null | head -5
else
  echo "No Nginx or Caddy detected"
fi
echo ""

echo "=================================="
echo "End of diagnostics"
echo "=================================="
