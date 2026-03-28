const express = require('express');
const mongoose = require('mongoose');
const Content = require('../models/Content');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/:pageSlug', async (req, res) => {
  try {
    const content = await Content.findOne({ pageSlug: req.params.pageSlug });
    res.json(content || {});
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:pageSlug', requireAuth, async (req, res) => {
  try {
    const { heroTitle, heroSubtitle, cta, categories, additionalContent } = req.body;
    
    let content = await Content.findOne({ pageSlug: req.params.pageSlug });
    
    if (!content) {
      content = new Content({ pageSlug: req.params.pageSlug });
    }
    
    if (heroTitle !== undefined) content.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) content.heroSubtitle = heroSubtitle;
    if (cta) content.cta = { ...content.cta, ...cta };
    if (categories) content.categories = categories;
    if (additionalContent) content.additionalContent = { ...content.additionalContent, ...additionalContent };
    content.updatedAt = new Date();
    
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:pageSlug/categories', requireAuth, async (req, res) => {
  try {
    const { title, icon } = req.body;
    const content = await Content.findOne({ pageSlug: req.params.pageSlug });
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    const newCategory = {
      _id: new mongoose.Types.ObjectId(),
      title: title || 'New Category',
      icon: icon || '',
      order: content.categories.length,
      services: []
    };
    
    content.categories.push(newCategory);
    await content.save();
    
    res.json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:pageSlug/categories/:categoryId', requireAuth, async (req, res) => {
  try {
    const content = await Content.findOne({ pageSlug: req.params.pageSlug });
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    content.categories = content.categories.filter(c => c._id.toString() !== req.params.categoryId);
    await content.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:pageSlug/categories/:categoryId/services', requireAuth, async (req, res) => {
  try {
    const { title, description, icon, image, buttonText } = req.body;
    const content = await Content.findOne({ pageSlug: req.params.pageSlug });
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    const category = content.categories.id(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const newService = {
      _id: new mongoose.Types.ObjectId(),
      title: title || 'New Service',
      description: description || '',
      icon: icon || '',
      image: image || '',
      buttonText: buttonText || 'Get Service',
      order: category.services.length
    };
    
    category.services.push(newService);
    await content.save();
    
    res.json(newService);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:pageSlug/categories/:categoryId/services/:serviceId', requireAuth, async (req, res) => {
  try {
    const content = await Content.findOne({ pageSlug: req.params.pageSlug });
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    const category = content.categories.id(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    category.services = category.services.filter(s => s._id.toString() !== req.params.serviceId);
    await content.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
