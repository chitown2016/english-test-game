const express = require('express');
const path = require('path');
const router = express.Router();

const testsPath = path.join(__dirname, '..', 'data', 'tests');
const tests = require(path.join(testsPath, 'index.js'));

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

router.get('/:id', (req, res) => {
  const test = tests.find((t) => t.id === req.params.id);
  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }
  res.json(test);
});

module.exports = router;
