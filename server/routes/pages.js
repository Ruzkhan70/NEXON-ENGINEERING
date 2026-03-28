const express = require('express');
const Page = require('../models/Page');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

const defaultPages = [
  { slug: 'home', label: 'Home', order: 0 },
  { slug: 'about', label: 'About', order: 1 },
  { slug: 'services', label: 'Services', order: 2 },
  { slug: 'projects', label: 'Projects', order: 3 },
  { slug: 'contact', label: 'Contact', order: 4 }
];

router.get('/', async (req, res) => {
  try {
    let pages = await Page.find().sort({ order: 1 });
    
    if (pages.length === 0) {
      for (const page of defaultPages) {
        await Page.create(page);
      }
      pages = await Page.find().sort({ order: 1 });
    }
    
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/public', async (req, res) => {
  try {
    const pages = await Page.find({ visible: true }).sort({ order: 1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:slug', requireAuth, async (req, res) => {
  try {
    const { visible, label, order, content } = req.body;
    
    let page = await Page.findOne({ slug: req.params.slug });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    if (typeof visible !== 'undefined') page.visible = visible;
    if (label) page.label = label;
    if (typeof order !== 'undefined') page.order = order;
    if (content) page.content = { ...page.content, ...content };
    page.updatedAt = new Date();
    
    await page.save();
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
