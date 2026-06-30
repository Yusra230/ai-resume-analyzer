// src/middlewares/upload.middleware.js
const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');
const { MAX_FILE_SIZE } = require('../config/constants');

// Allowed MIME types (strict)
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
];

// Sanitize filename to prevent path traversal attacks
const sanitizeFileName = (originalName) => {
  const name = path.basename(originalName); // Removes any directory paths
  // Remove any non-alphanumeric characters except dot, dash, underscore
  return name.replace(/[^a-zA-Z0-9._-]/g, '');
};

const storage = multer.memoryStorage(); // Store in RAM (better for serverless/cloud)

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    // Sanitize the filename and attach it to the file object
    file.originalname = sanitizeFileName(file.originalname);
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only PDF and DOCX files are allowed.', 400), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

module.exports = upload;