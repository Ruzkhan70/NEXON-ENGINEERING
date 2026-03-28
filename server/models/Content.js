const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  buttonText: { type: String, default: 'Get Service' },
  order: { type: Number, default: 0 }
});

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, default: '' },
  order: { type: Number, default: 0 },
  services: [serviceSchema]
});

const contentSchema = new mongoose.Schema({
  pageSlug: { type: String, required: true, unique: true },
  heroTitle: { type: String, default: '' },
  heroSubtitle: { type: String, default: '' },
  cta: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    buttonText: { type: String, default: '' },
    link: { type: String, default: '' }
  },
  categories: [categorySchema],
  additionalContent: { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', contentSchema);
