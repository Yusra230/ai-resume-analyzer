// src/middlewares/rateLimiter.middleware.js
const rateLimit = require('express-rate-limit');
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } = require('../config/constants');

// Strict limiter for AI routes (prevents cost abuse)
const aiRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: `Too many analysis requests. Please wait and try again later. Max ${RATE_LIMIT_MAX_REQUESTS} per ${RATE_LIMIT_WINDOW_MS / 60000} minutes.`,
  },
  keyGenerator: (req) => {
    // Use IP address as the key (since no user ID)
    return req.ip || req.connection.remoteAddress;
  },
});

// Soft global limiter (optional, but good)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

module.exports = { aiRateLimiter, globalLimiter };