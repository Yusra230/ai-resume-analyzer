// src/utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // Capture stack trace (exclude constructor from it)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;