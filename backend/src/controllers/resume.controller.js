// src/controllers/resume.controller.js
const asyncWrapper  = require('../utils/asyncWrapper');
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

// New function for JSON input
const analyzeFromText = asyncWrapper(async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    throw new AppError('Resume text and job description are required.', 400);
  }

  let extractedText = '';

  // Check if the resumeText is a base64 encoded file (starts with "__B64__")
  if (resumeText.startsWith('__B64__')) {
    const base64Data = resumeText.substring(7); // remove prefix
    const buffer = Buffer.from(base64Data, 'base64');

    // Detect file type from buffer (magic numbers)
    const isPDF = buffer.slice(0, 4).toString('hex') === '25504446'; // %PDF
    const isDOCX = buffer.slice(0, 4).toString('hex') === '504b0304'; // ZIP (DOCX is a zip)

    if (isPDF) {
      extractedText = await extractTextFromPDF(buffer);
    } else if (isDOCX) {
      extractedText = await extractTextFromDOCX(buffer);
    } else {
      // Fallback: try to decode as text (could be a plain text file)
      extractedText = buffer.toString('utf-8');
    }
  } else {
    // Plain text resume
    extractedText = resumeText;
  }

  if (!extractedText || extractedText.trim().length === 0) {
    throw new AppError('No readable text found in the resume.', 400);
  }

  // Call the same AI analysis function
  const analysisResult = await analyzeResume(extractedText, jobDescription);

  res.status(200).json({
    status: 'success',
    data: analysisResult,
  });
});

// Export both functions
module.exports = { uploadAndAnalyze, analyzeFromText };