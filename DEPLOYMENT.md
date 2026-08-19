# Deployment Requirements Document — EngQuest

## 1. Project Overview

EngQuest is a small, mobile-first web application that serves gamified English multiple-choice tests. The target user is the developer’s wife (one user). All in-app explanations are in Russian; this document is in English for the deploying agent.

- **Project root**: `C:\Users\mtulum\Documents\english-test-game`
- **Frontend**: `frontend/` — Vite + React + Tailwind CSS
- **Backend**: `backend/` — Node.js + Express
- **Database**: PostgreSQL (preferred) or in-memory SQLite fallback for local dev only

## 2. Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│   Browser       │────────▶│  Node.js backend │────────▶│  PostgreSQL  │
│  (React app)    │  HTTP   │  (Express)       │  SQL    │              │
└─────────────────┘         └──────────────────┘         └──────────────┘
```

- The frontend is a static SPA. It can be served by the backend or by a separate static host.
- The backend exposes a REST API on port `3000` by default.
- The frontend talks to the backend via `VITE_API_URL`.
- Anonymous progress is keyed by a device ID stored in the browser’s `localStorage`.

## 3. Files and Folders

```
english-test-game/
├── frontend/
│   ├── src/                 # React source code
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env                 # VITE_API_URL
├── backend/
│   ├── src/
│   │   ├── index.js         # Express server entry
│   │   ├── db/              # Database abstraction (pg + memory fallback)
│   │   ├── routes/          # tests, progress, achievements
│   │   ├── services/        # business logic
│   │   └── data/            # test JSON files
│   ├── migrations/
│   │   └── 001_init.sql     # PostgreSQL schema
│   ├── package.json
│   ├── .env                 # runtime config
│   └── .env.example         # production template
└── README.md
```

## 4. Resource Requirements

### Runtime (approximate)

| Component  | RAM (idle) | CPU | Notes |
|------------|-----------|-----|-------|
| Node.js backend | 30–80 MB | very low | one user |
| PostgreSQL | 100–300 MB | low | can be lower after tuning |
| Nginx/Caddy (optional) | 10–30 MB | very low | reverse proxy + SSL |
| Frontend (static) | 0 MB | 0 MB | served by backend or static host |

### Minimum recommended host

- **With PostgreSQL on the same box**: 1 GB RAM, 1 vCPU.
- **Without PostgreSQL (managed DB or SQLite)**: 512 MB RAM, 1 vCPU.

## 5. Environment Variables

### Backend (`backend/.env`)

```env
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
CORS_ORIGIN=https://your-frontend-domain.com
DB_MODE=pg
```

- `PORT`: the port the backend listens on.
- `DATABASE_URL`: PostgreSQL connection string. Required when `DB_MODE=pg`.
- `CORS_ORIGIN`: the origin of the frontend. Use the exact URL (no trailing slash).
- `DB_MODE`: `pg` for PostgreSQL, `memory` for local dev only. **Production must be `pg`.**

### Frontend (`frontend/.env`)

```env
VITE_API_URL=https://your-backend-domain.com/api
```

- Must point to the backend’s `/api` path.

## 6. Deployment Options

The deploying agent should choose one of the following based on available resources on the Lightsail box.

### Option A: Full self-hosted on Lightsail (recommended if box has ≥1 GB RAM)

1. Install Node.js and PostgreSQL on the Lightsail box.
2. Create a PostgreSQL database and user.
3. Copy the project to the box (e.g., `/opt/engquest`).
4. In `backend/.env`, set `DATABASE_URL`, `CORS_ORIGIN`, and `DB_MODE=pg`.
5. Run migrations:
   ```bash
   cd /opt/engquest/backend
   npm install
   npm run migrate
   ```
6. Build the frontend:
   ```bash
   cd /opt/engquest/frontend
   npm install
   npm run build
   ```
7. Configure the backend to serve the built frontend from `frontend/dist`, OR serve `frontend/dist` with Nginx/Caddy.
8. Set up a reverse proxy (Nginx or Caddy) with SSL.
9. Run the backend with a process manager (`pm2` or `systemd`).

### Option B: Backend on Lightsail + managed PostgreSQL

Same as Option A, but use an external PostgreSQL such as AWS RDS, Supabase, or Neon. This is recommended if the Lightsail box has only 512 MB RAM.

### Option C: Backend on Lightsail + static frontend hosting

- Host the frontend on GitHub Pages, Netlify, AWS S3, or CloudFront.
- Run only the backend on Lightsail.
- Set `CORS_ORIGIN` to the frontend URL.

## 7. SSL / Domain

- Use a reverse proxy (Nginx or Caddy) to terminate SSL.
- Get a certificate via Let’s Encrypt or AWS Certificate Manager.
- The backend itself does not need to handle SSL if it sits behind a reverse proxy.

## 8. Process Management

Use `pm2` or `systemd` to keep the backend running after logout and reboots.

Example with `pm2`:

```bash
cd /opt/engquest/backend
npm install -g pm2
pm2 start src/index.js --name engquest-backend
pm2 save
pm2 startup
```

## 9. Verification Checklist

After deployment, verify:

- [ ] `https://your-domain.com/` loads the frontend.
- [ ] `https://your-domain.com/api/health` returns `{"status":"ok"}`.
- [ ] `GET /api/tests` returns a JSON list of tests.
- [ ] Completing a test updates progress in PostgreSQL.
- [ ] Refreshing the page restores progress.
- [ ] The layout works on a mobile viewport (no horizontal scroll, large buttons).

## 10. Decision Criteria for the Agent

1. Check available RAM on the Lightsail box:
   - If **≥ 1 GB**, choose **Option A** (full self-hosted).
   - If **512 MB**, choose **Option B** (managed PostgreSQL) or **Option C** (static frontend).
2. Check whether PostgreSQL is already installed and running:
   - If yes, reuse it.
   - If no, decide whether to install it or use a managed database based on RAM.
3. Check whether a domain and SSL are already configured:
   - If yes, use the existing reverse proxy.
   - If no, install Caddy (simplest) or Nginx + Certbot.
4. Prefer the option with the fewest moving parts while keeping the box stable.

## 11. Notes and Warnings

- **Do not use `DB_MODE=memory` in production.** It resets when the backend restarts.
- **Back up the PostgreSQL database regularly**, even though there is only one user.
- The frontend uses Russian text and explanations; do not translate them.
- Keep `CORS_ORIGIN` exact. Wildcards can cause issues with credentials-like headers.

## 12. Support Commands

Check backend logs:

```bash
pm2 logs engquest-backend
```

Restart backend:

```bash
pm2 restart engquest-backend
```

Run migrations:

```bash
cd /opt/engquest/backend
npm run migrate
```

Rebuild frontend after code changes:

```bash
cd /opt/engquest/frontend
npm run build
```
