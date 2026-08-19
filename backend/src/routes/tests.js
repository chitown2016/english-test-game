const express = require('express');
const path = require('path');
const router = express.Router();
const { getProgress } = require('../services/progress');

const testsPath = path.join(__dirname, '..', 'data', 'tests');
const tests = require(path.join(testsPath, 'index.js'));
const { pool } = require(path.join(__dirname, '..', 'data', 'questions.json'));

const GENERAL_TEST_ID = 'general';
const GENERAL_QUESTION_COUNT = 10;

function getDeviceId(req) {
  const id = req.headers['x-device-id'];
  if (!id) return null;
  return id;
}

function calculateWeight(stats) {
  if (!stats) return 1;
  let weight = 1;
  if (stats.lastCorrect === true) weight *= 0.4;
  if (stats.lastCorrect === false) weight *= 2.0;
  const seenCount = stats.seen || 0;
  weight *= Math.pow(0.9, seenCount);
  return Math.max(0.05, weight);
}

function weightedRandomSample(items, weights, count) {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const result = [];
  const pool = items.map((item, i) => ({ item, weight: weights[i] }));

  while (result.length < count && pool.length > 0) {
    const threshold = Math.random() * pool.reduce((sum, p) => sum + p.weight, 0);
    let cumulative = 0;
    for (let i = 0; i < pool.length; i += 1) {
      cumulative += pool[i].weight;
      if (cumulative >= threshold) {
        result.push(pool[i].item);
        pool.splice(i, 1);
        break;
      }
    }
  }

  return result;
}

function buildGeneralTest(questions) {
  return {
    id: GENERAL_TEST_ID,
    title: 'Общий тест',
    description: 'Случайные вопросы на разные темы.',
    level: 1,
    difficulty: 'easy',
    unlockLevel: 1,
    timeLimitSeconds: 15,
    questionCount: questions.length,
    questions,
  };
}

router.get('/', (req, res) => {
  res.json(tests.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    level: t.level,
    difficulty: t.difficulty,
    unlockLevel: t.unlockLevel,
    timeLimitSeconds: t.timeLimitSeconds,
    questionCount: t.questions.length,
  })));
});

router.get('/general', async (req, res) => {
  const deviceId = getDeviceId(req);
  let questionStats = {};
  if (deviceId) {
    try {
      const progress = await getProgress(deviceId);
      questionStats = progress.questionStats || {};
    } catch (err) {
      console.error('Failed to load progress for general test:', err);
    }
  }

  const weights = pool.map((q) => calculateWeight(questionStats[q.id]));
  const selected = weightedRandomSample(pool, weights, GENERAL_QUESTION_COUNT);
  const test = buildGeneralTest(selected);
  res.json(test);
});

router.get('/:id', (req, res) => {
  if (req.params.id === GENERAL_TEST_ID) {
    return res.status(400).json({ error: 'Use /api/tests/general for the general test' });
  }

  const test = tests.find((t) => t.id === req.params.id);
  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }
  res.json(test);
});

module.exports = router;
