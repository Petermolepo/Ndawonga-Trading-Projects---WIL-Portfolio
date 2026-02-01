// backend/server.js
// Full server: serves frontend + exposes APIs (projects, tenders, team, documents, contact, quotes, chat)
// Run with: node server.js

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const pool = require('./db'); // mysql2/promise pool

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// MULTER: file upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, safe);
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

/* ---------------- Projects ---------------- */
// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE status="active" ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/projects', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET project by id
app.get('/api/projects/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /api/projects/:id', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create project (admin upload)
app.post('/api/projects', upload.single('featured_image'), async (req, res) => {
  try {
    const { title, description, type, year, location } = req.body;
    const featured_image = req.file ? req.file.filename : null;
    const [result] = await pool.execute(
      'INSERT INTO projects (title, description, type, year, location, featured_image) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, type || null, year || null, location || null, featured_image]
    );
    res.json({ id: result.insertId, message: 'Project created' });
  } catch (err) {
    console.error('POST /api/projects', err);
    res.status(500).json({ error: 'Database insert error' });
  }
});

/* ---------------- Tenders ---------------- */
// GET tenders
app.get('/api/tenders', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tenders ORDER BY featured DESC, closing_date DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/tenders', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST tender
app.post('/api/tenders', upload.single('file'), async (req, res) => {
  try {
    const { title, description, closing_date } = req.body;
    const file = req.file ? req.file.filename : null;
    const [result] = await pool.execute(
      'INSERT INTO tenders (title, description, closing_date, file) VALUES (?, ?, ?, ?)',
      [title, description || null, closing_date || null, file]
    );
    res.json({ id: result.insertId, message: 'Tender created' });
  } catch (err) {
    console.error('POST /api/tenders', err);
    res.status(500).json({ error: 'Database insert error' });
  }
});

/* ---------------- Team ---------------- */
// GET team members
app.get('/api/team', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM team ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/team', err);
    res.status(500).json({ error: 'Database error' });
  }
});

/* ---------------- Documents ---------------- */
app.get('/api/documents', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM documents WHERE visible = 1 ORDER BY uploaded_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/documents', err);
    res.status(500).json({ error: 'Database error' });
  }
});

/* ---------------- Contact messages ---------------- */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message, category } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO messages (name, email, phone, subject, message, category) VALUES (?, ?, ?, ?, ?, ?)',
      [name || null, email || null, phone || null, subject || null, message || null, category || 'General']
    );
    res.json({ id: result.insertId, message: 'Message saved' });
  } catch (err) {
    console.error('POST /api/contact', err);
    res.status(500).json({ error: 'Database insert error' });
  }
});

/* ---------------- Quotes (Automated Quotation Requests) ---------------- */
// Clients can request a quote — we estimate a cost on the frontend and store the request here
app.post('/api/quotes', async (req, res) => {
  try {
    const { name, email, phone, project_type, area_sq_m, complexity, estimated_cost, message } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO quotes (name, email, phone, project_type, area_sq_m, complexity, estimated_cost, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name || null, email || null, phone || null, project_type || null, area_sq_m || 0, complexity || 'medium', estimated_cost || 0, message || null]
    );
    res.json({ id: result.insertId, message: 'Quote request saved' });
  } catch (err) {
    console.error('POST /api/quotes', err);
    res.status(500).json({ error: 'Database insert error' });
  }
});

/* ---------------- Chatbot (logs + simple fallback) ---------------- */
// POST /api/chat { message } -> returns { reply } and logs the conversation
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const sessionId = req.headers['x-session-id'] || 'web-session';
    const lower = (message || '').toLowerCase();
    let reply = "Hi — I'm Ndawonga assistant. Ask about tenders, projects, certificates, or request a quote.";

    if (lower.includes('tender')) {
      const [rows] = await pool.query('SELECT title, closing_date FROM tenders ORDER BY closing_date DESC LIMIT 5');
      reply = rows.length ? 'Current tenders:\n' + rows.map(r => `${r.title} (closes: ${r.closing_date})`).join('\n') : 'No active tenders currently.';
    } else if (lower.includes('project')) {
      reply = 'You can view our projects on the Projects page or request a quote there.';
    } else if (lower.includes('bbbee') || lower.includes('certificate') || lower.includes('cidb')) {
      reply = 'Certificates are in the Documents area. For official copies submit a contact request.';
    }

    // Log chat
    await pool.execute('INSERT INTO chatbot_logs (session_id, user_message, bot_response) VALUES (?, ?, ?)', [sessionId, message, reply]);

    res.json({ reply });
  } catch (err) {
    console.error('POST /api/chat', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
