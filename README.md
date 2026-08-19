# EngQuest — Gamified English Tests

A mobile-friendly website with gamified English multiple-choice tests. All explanations inside the tests are in Russian so your wife can learn comfortably, while this README and setup docs are in English.

## Structure

- `frontend/` — Vite + React + Tailwind CSS
- `backend/` — Node.js + Express + PostgreSQL

## Quick Start (local development)

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

By default the backend runs with an **in-memory** database (`DB_MODE=memory` in `.env`). This is convenient for local development without installing PostgreSQL.

### 2. Frontend

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Switching to PostgreSQL (VPS / production)

1. Create a PostgreSQL database.
2. In `backend/.env` set:
   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
   DB_MODE=pg
   ```
3. Run migrations:
   ```bash
   cd backend
   npm run migrate
   ```
4. Start the backend:
   ```bash
   npm start
   ```

## Environment Variables

### Backend `.env`

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/engquest
CORS_ORIGIN=http://localhost:5173
DB_MODE=memory   # or pg for PostgreSQL
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:3000/api
```

## Features

- 📱 Mobile-first interface with large touch targets
- 🎨 Soft pastel theme
- 🎮 Points, streaks, levels, badges, speed bonus
- 🇷🇺 Russian explanations for every answer
- 💾 Server-side progress via anonymous device ID
- ⚡ Fast animations and responsive interactions

## Adding New Tests

Add a JSON file to `backend/src/data/tests/`, then import it in `backend/src/data/tests/index.js`.

## Deployment

Build the frontend with `npm run build` inside `frontend/` and host the `dist/` folder on any static host. Deploy the backend on your VPS with PostgreSQL.
