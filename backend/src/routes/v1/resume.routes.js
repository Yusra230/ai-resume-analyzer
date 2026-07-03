// src/routes/v1/resume.routes.js
const express = require('express');
const upload = require('../../middlewares/upload.middleware');
const { validateJobDescription } = require('../../middlewares/validation.middleware');
const { aiRateLimiter } = require('../../middlewares/rateLimiter.middleware');
const { uploadAndAnalyze, analyzeFromText  } = require('../../controllers/resume.controller');

const router = express.Router();

// 🔥 ADD THIS DEBUG ROUTE (to check if the router is mounted)
router.get('/test-router', (req, res) => {
  res.json({ message: 'Resume router is mounted and working!' });
});

// POST /api/v1/resume/analyze
router.post(
  '/analyze',
  aiRateLimiter, // Strict rate limit to protect Gemini costs
  upload.single('resume'), // Expect form-data field named "resume"
  validateJobDescription, // Validate the jobDescription field in body
  uploadAndAnalyze
);

// New JSON endpoint (no file upload)
router.post(
  '/analyze-json',
  aiRateLimiter,
  express.json(), // middleware to parse JSON body
  (req, res, next) => {
    // We'll validate manually inside the controller or use Joi
    next();
  },
  analyzeFromText
);
module.exports = router;