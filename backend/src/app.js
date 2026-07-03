// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { globalLimiter } = require('./middlewares/rateLimiter.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');
const { ALLOWED_ORIGIN, NODE_ENV } = require('./config/constants');
const resumeRoutes = require('./routes/v1/resume.routes');
const allowedOrigin = process.env.FRONTEND_URL || '*';
const app = express();
app.use(express.json({ limit: '1mb' })); // Limit JSON payload to 1MB

// Trust proxy (required for Railway/Render)
app.set('trust proxy', 1);

// ----- Standard Middlewares (Security & Logging) -----

// 1. Security headers
app.use(helmet());

// 2. CORS - Restrict to your frontend only
app.use(
  cors({
    origin: allowedOrigin,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);


// 4. Logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined')); // More detailed for production logs
}

// 5. Global Rate Limiter (soft layer) - applies to all routes
app.use(globalLimiter);

// ----- Routes -----
app.use('/api/v1/resume', resumeRoutes);
console.log('✅ Routes mounted successfully');
// Health check endpoint (useful for load balancers)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: NODE_ENV });
});


// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: `Route ${req.originalUrl} not found.` });
});

// ----- Global Error Handler (MUST be last) -----
app.use(errorHandler);

module.exports = app;