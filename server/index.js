require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, '..', 'data');
const IMAGES_DIR = path.join(__dirname, '..', 'images');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const CLIENT_DIST_DIR = path.join(__dirname, '..', 'client', 'dist');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'nexon-engineering-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000, httpOnly: true }
}));

function loadJSON(filename, defaultData = {}) {
  const file = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) { console.error(`Error loading ${filename}:`, e); }
  return defaultData;
}

function saveJSON(filename, data) {
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

let users = loadJSON('users.json', []);
let settings = loadJSON('settings.json', { companyName: 'NEXON Engineering', companyTagline: 'Industrial Excellence', logo: '/images/logo.png', email: 'nexonengineering.service@gmail.com', phone: '+94 77 375 3621', whatsapp: '+94773753621', address: 'Colombo, Sri Lanka', facebook: '', instagram: '', linkedin: '', mapsEmbed: '' });
let pages = loadJSON('pages.json', [{ _id: '1', slug: 'home', label: 'Home', visible: true, order: 0, content: { heroTitle: 'Engineering Innovation', heroSubtitle: 'Trusted industrial solutions' } }, { _id: '2', slug: 'about', label: 'About', visible: true, order: 1, content: {} }, { _id: '3', slug: 'services', label: 'Services', visible: true, order: 2, content: {} }, { _id: '4', slug: 'projects', label: 'Projects', visible: true, order: 3, content: {} }, { _id: '5', slug: 'contact', label: 'Contact', visible: true, order: 4, content: {} }]);
let projects = loadJSON('projects.json', []);
let clients = loadJSON('clients.json', []);
let messages = loadJSON('messages.json', []);

if (users.length === 0) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  users.push({ _id: '1', username: 'admin', password: hashedPassword, role: 'admin', email: 'admin@nexon.lk', createdAt: new Date().toISOString() });
  saveJSON('users.json', users);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.role = user.role;
    res.json({ success: true, user: { id: user._id, username: user.username, role: user.role } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/logout', (req, res) => { req.session.destroy(); res.json({ success: true }); });

app.get('/api/auth/check', (req, res) => {
  if (req.session.userId) res.json({ authenticated: true, user: { id: req.session.userId, username: req.session.username, role: req.session.role } });
  else res.json({ authenticated: false });
});

app.get('/api/users', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  res.json(users.map(u => ({ _id: u._id, username: u.username, role: u.role, createdAt: u.createdAt })));
});

app.post('/api/users', (req, res) => {
  if (!req.session.userId || req.session.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { username, password, role } = req.body;
  if (users.find(u => u.username === username)) return res.status(400).json({ error: 'Username exists' });
  const newUser = { _id: generateId(), username, password: bcrypt.hashSync(password, 10), role: role || 'editor', createdAt: new Date().toISOString() };
  users.push(newUser);
  saveJSON('users.json', users);
  res.json({ success: true, user: { _id: newUser._id, username: newUser.username, role: newUser.role } });
});

app.patch('/api/users/:id', (req, res) => {
  if (!req.session.userId || req.session.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const user = users.find(u => u._id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (req.body.role && ['admin', 'editor'].includes(req.body.role)) user.role = req.body.role;
  saveJSON('users.json', users);
  res.json({ success: true, user: { _id: user._id, username: user.username, role: user.role } });
});

app.delete('/api/users/:id', (req, res) => {
  if (!req.session.userId || req.session.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  if (req.params.id === req.session.userId) return res.status(400).json({ error: 'Cannot delete yourself' });
  users = users.filter(u => u._id !== req.params.id);
  saveJSON('users.json', users);
  res.json({ success: true });
});

app.get('/api/settings', (req, res) => res.json(settings));

app.put('/api/settings', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  settings = { ...settings, ...req.body };
  saveJSON('settings.json', settings);
  res.json(settings);
});

app.get('/api/pages', (req, res) => res.json(pages));

app.get('/api/pages/public', (req, res) => res.json(pages.filter(p => p.visible)));

app.put('/api/pages/:slug', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  const page = pages.find(p => p.slug === req.params.slug);
  if (!page) return res.status(404).json({ error: 'Page not found' });
  if (typeof req.body.visible !== 'undefined') page.visible = req.body.visible;
  if (req.body.label) page.label = req.body.label;
  if (req.body.content) page.content = { ...page.content, ...req.body.content };
  saveJSON('pages.json', pages);
  res.json(page);
});

app.get('/api/projects', (req, res) => res.json(projects));

app.post('/api/projects', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  const project = { _id: generateId(), ...req.body, createdAt: new Date().toISOString() };
  projects.push(project);
  saveJSON('projects.json', projects);
  res.json(project);
});

app.put('/api/projects/:id', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  const project = projects.find(p => p._id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Not found' });
  Object.assign(project, req.body);
  saveJSON('projects.json', projects);
  res.json(project);
});

app.delete('/api/projects/:id', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  projects = projects.filter(p => p._id !== req.params.id);
  saveJSON('projects.json', projects);
  res.json({ success: true });
});

app.get('/api/clients', (req, res) => res.json(clients));

app.post('/api/clients', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  const client = { _id: generateId(), ...req.body, createdAt: new Date().toISOString() };
  clients.push(client);
  saveJSON('clients.json', clients);
  res.json(client);
});

app.put('/api/clients/:id', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  const client = clients.find(c => c._id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Not found' });
  Object.assign(client, req.body);
  saveJSON('clients.json', clients);
  res.json(client);
});

app.delete('/api/clients/:id', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  clients = clients.filter(c => c._id !== req.params.id);
  saveJSON('clients.json', clients);
  res.json({ success: true });
});

app.get('/api/messages', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  res.json(messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/messages', (req, res) => {
  const { name, email, message, phone } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Required fields missing' });
  const newMessage = { _id: generateId(), name, email, message, phone: phone || '', status: 'new', createdAt: new Date().toISOString() };
  messages.push(newMessage);
  saveJSON('messages.json', messages);
  res.json(newMessage);
});

app.patch('/api/messages/:id', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  const msg = messages.find(m => m._id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Not found' });
  if (req.body.status) msg.status = req.body.status;
  saveJSON('messages.json', messages);
  res.json(msg);
});

app.delete('/api/messages/:id', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  messages = messages.filter(m => m._id !== req.params.id);
  saveJSON('messages.json', messages);
  res.json({ success: true });
});

app.get('/api/stats', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ totalUsers: users.length, totalProjects: projects.length, totalClients: clients.length, totalMessages: messages.length, unreadMessages: messages.filter(m => m.status === 'new').length, totalPages: pages.length });
});

app.get('/admin', (req, res) => {
  const adminIndex = path.join(CLIENT_DIST_DIR, 'index.html');
  if (fs.existsSync(adminIndex)) res.sendFile(adminIndex);
  else res.status(404).send('Admin not built. Run: npm run build');
});

app.get('/admin/*', (req, res) => {
  const adminIndex = path.join(CLIENT_DIST_DIR, 'index.html');
  if (fs.existsSync(adminIndex)) res.sendFile(adminIndex);
  else res.status(404).send('Admin not built');
});

app.use('/images', express.static(IMAGES_DIR));
app.use(express.static(PUBLIC_DIR));
app.get('/', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));

app.listen(PORT, () => {
  console.log(`\n🚀 NEXON Engineering Running!`);
  console.log(`📍 Website: http://localhost:${PORT}`);
  console.log(`🔐 Admin: http://localhost:${PORT}/admin`);
  console.log(`👤 Login: admin / admin123\n`);
});
