require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const path       = require('path');
const rateLimit  = require('express-rate-limit');

const connectDB      = require('./config/db');
const publicRoutes   = require('./routes/publicRoutes');
const adminRoutes    = require('./routes/adminRoutes');
const authRoutes     = require('./routes/authRoutes');
const errorHandler   = require('./middleware/errorHandler');

// ── Connect to MongoDB ──────────────────────
connectDB();

const app = express();

// ── Security headers ───────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images to load from frontend
  })
);

// ── CORS ───────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173', // Vite preview
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Request parsing ────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── HTTP logging ───────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Static files (uploaded images) ─────────
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'), {
    maxAge: '1d',
    etag: true,
  })
);

// ── Rate limiting ──────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, message: 'Too many submissions. Please try again in an hour.' },
});

app.use('/api', globalLimiter);
app.use('/api/contact',   formLimiter);
app.use('/api/volunteer', formLimiter);

// ── Routes ─────────────────────────────────
app.use('/api/auth',   authRoutes);
app.use('/api',        publicRoutes);
app.use('/api/admin',  adminRoutes);

// ── Health check ───────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date().toISOString() });
});

// ── 404 handler ────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ── Global error handler ───────────────────
app.use(errorHandler);

// ── Start server ───────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀  DREFO API running on http://localhost:${PORT}`);
  console.log(`    Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`    Health      : http://localhost:${PORT}/health\n`);
});

module.exports = app;
