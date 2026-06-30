// src/routes/v1/resume.routes.js
const express = require('express');
const upload = require('../../middlewares/upload.middleware');
const { validateJobDescription } = require('../../middlewares/validation.middleware');
const { aiRateLimiter } = require('../../middlewares/rateLimiter.middleware');
const { uploadAndAnalyze } = require('../../controllers/resume.controller');

const router = express.Router();

// POST /api/v1/resume/analyze
router.post(
  '/analyze',
  aiRateLimiter, // ⭐ Strict rate limit to protect your OpenAI costs
  upload.single('resume'), // Expect form-data field named "resume"
  validateJobDescription, // Validate the jobDescription field in body
  uploadAndAnalyze
);

module.exports = router;