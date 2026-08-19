require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { runMigrations } = require('./db');
const testsRouter = require('./routes/tests');
const progressRouter = require('./routes/progress');
const achievementsRouter = require('./routes/achievements');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  allowedHeaders: ['Content-Type', 'X-Device-Id'],
}));
app.use(express.json());

app.use('/api/tests', testsRouter);
app.use('/api/progress', progressRouter);
app.use('/api/achievements', achievementsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  await runMigrations();
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
