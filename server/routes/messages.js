const express = require('express');
const Message = require('../models/Message');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stats', requireAuth, async (req, res) => {
  try {
    const total = await Message.countDocuments();
    const unread = await Message.countDocuments({ status: 'new' });
    const replied = await Message.countDocuments({ status: 'replied' });
    res.json({ total, unread, replied });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    
    const newMessage = new Message({
      name,
      email,
      phone: phone || '',
      subject: subject || '',
      message,
      status: 'new'
    });
    
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    if (status && ['new', 'read', 'replied', 'archived'].includes(status)) {
      message.status = status;
      await message.save();
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
