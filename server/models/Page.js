const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  content: {
    heroTitle: { type: String, default: '' },
    heroSubtitle: { type: String, default: '' },
    sections: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Page', pageSchema);
