// src/controllers/resume.controller.js
const { asyncWrapper } = require('../utils/asyncWrapper');
const AppError = require('../utils/AppError');
const { extractTextFromPDF, extractTextFromDOCX } = require('../services/parser.service');
const { analyzeResume } = require('../services/aiAnalyzer.service');

const uploadAndAnalyze = asyncWrapper(async (req, res) => {
  // 1. Check if file exists (Multer already validated size/type)
  if (!req.file) {
    throw new AppError('Please upload a resume file (PDF or DOCX).', 400);
  }

  // 2. Extract job description (already validated by Joi middleware)
  const { jobDescription } = req.body;

  // 3. Parse the file based on MIME type
  const fileBuffer = req.file.buffer;
  let extractedText;

  if (req.file.mimetype === 'application/pdf') {
    extractedText = await extractTextFromPDF(fileBuffer);
  } else {
    // DOC or DOCX
    extractedText = await extractTextFromDOCX(fileBuffer);
  }

  // 4. Ensure we actually extracted text
  if (!extractedText || extractedText.trim().length === 0) {
    throw new AppError('No readable text found in the file. Please upload a text-based resume.', 400);
  }

  // 5. Call AI for analysis
  const analysisResult = await analyzeResume(extractedText, jobDescription);

  // 6. Send successful response
  res.status(200).json({
    status: 'success',
    data: analysisResult,
  });
});

module.exports = { uploadAndAnalyze };