const express = require('express');
const achievements = require('../data/achievements.json');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(achievements);
});

module.exports = router;
