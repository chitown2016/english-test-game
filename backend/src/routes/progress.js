const express = require('express');
const { getProgress, upsertProgress } = require('../services/progress');
const router = express.Router();

function getDeviceId(req) {
  const id = req.headers['x-device-id'];
  if (!id) {
    return null;
  }
  return id;
}

router.get('/', async (req, res) => {
  const deviceId = getDeviceId(req);
  if (!deviceId) {
    return res.status(400).json({ error: 'X-Device-Id header is required' });
  }
  try {
    const progress = await getProgress(deviceId);
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

router.put('/', async (req, res) => {
  const deviceId = getDeviceId(req);
  if (!deviceId) {
    return res.status(400).json({ error: 'X-Device-Id header is required' });
  }
  try {
    const progress = await upsertProgress(deviceId, req.body);
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

module.exports = router;
