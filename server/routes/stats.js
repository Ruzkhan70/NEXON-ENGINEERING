const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const Client = require('../models/Client');
const Message = require('../models/Message');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalProjects,
      totalClients,
      totalMessages,
      unreadMessages,
      totalPages
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Client.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ status: 'new' }),
      5
    ]);
    
    res.json({
      totalUsers,
      totalProjects,
      totalClients,
      totalMessages,
      unreadMessages,
      totalPages
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
