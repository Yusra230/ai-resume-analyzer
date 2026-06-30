// src/middlewares/errorHandler.middleware.js
const { NODE_ENV } = require('../config/constants');

const errorHandler = (err, req, res, next) => {
  // Log full error for developers (but never leak to client)
  console.error(`[${new Date().toISOString()}] ERROR:`, err.stack || err);

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Multer-specific errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = `File too large. Max size is ${process.env.MAX_FILE_SIZE / 1024 / 1024}MB.`;
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected field. Please upload a single file with key "resume".';
  }

  // Handle Joi validation errors (they come as AppError already)
  // Handle OpenAI timeout errors
  if (err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED') {
    statusCode = 504;
    message = 'AI service is taking too long. Please try again.';
  }

  // In production, don't expose stack traces or internal error details
  const response = {
    status: 'error',
    message: message,
  };

  if (NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = err; // Use sparingly
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;