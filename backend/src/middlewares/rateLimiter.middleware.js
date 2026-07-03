const rateLimit = require('express-rate-limit');
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } = require('../config/constants');

// Strict limiter for AI routes
const aiRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: `Too many analysis requests. Please wait and try again later. Max ${RATE_LIMIT_MAX_REQUESTS} per ${RATE_LIMIT_WINDOW_MS / 60000} minutes.`,
  },
});

// Soft global limiter
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

module.exports = { aiRateLimiter, globalLimiter };