const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  companyName: { type: String, default: 'NEXON Engineering Services' },
  companyTagline: { type: String, default: 'Industrial Excellence, Trusted Solutions' },
  logo: { type: String, default: '/images/logo.png' },
  favicon: { type: String, default: '/images/favicon.ico' },
  email: { type: String, default: 'nexonengineering.service@gmail.com' },
  phone: { type: String, default: '+94 77 375 3621' },
  whatsapp: { type: String, default: '+94773753621' },
  address: { type: String, default: 'WVP9+FGX, Colombo 01000, Sri Lanka' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  mapsEmbed: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
