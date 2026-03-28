const express = require('express');
const Settings = require('../models/Settings');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates._id;
    delete updates.__v;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    
    Object.assign(settings, updates);
    settings.updatedAt = new Date();
    await settings.save();
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
