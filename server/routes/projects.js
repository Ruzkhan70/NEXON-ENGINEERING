const express = require('express');
const Project = require('../models/Project');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, category, client, year, image, featured } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const project = new Project({
      title,
      description: description || '',
      category: category || 'General',
      client: client || '',
      year: year || new Date().getFullYear().toString(),
      image: image || '',
      featured: featured || false
    });
    
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, description, category, client, year, image, featured } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (category !== undefined) project.category = category;
    if (client !== undefined) project.client = client;
    if (year !== undefined) project.year = year;
    if (image !== undefined) project.image = image;
    if (featured !== undefined) project.featured = featured;
    project.updatedAt = new Date();
    
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
