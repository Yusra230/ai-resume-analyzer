const pdfParse = require('pdf-parse');  // ✅ Direct import
const mammoth = require('mammoth');
const AppError = require('../utils/AppError');

const cleanText = (text) => {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\x20-\x7E\n]/g, '')
    .trim();
};

const truncateText = (text, maxLength = 12000) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '... [truncated]';
};

const extractTextFromPDF = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer, { max: 0 });
    return truncateText(cleanText(data.text));
  } catch (error) {
    console.error('PDF Parsing Error:', error);
    throw new AppError('Failed to parse PDF file. It might be corrupted or password-protected.', 400);
  }
};

const extractTextFromDOCX = async (fileBuffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return truncateText(cleanText(result.value));
  } catch (error) {
    console.error('DOCX Parsing Error:', error);
    throw new AppError('Failed to parse DOCX file. It might be corrupted.', 400);
  }
};

module.exports = { extractTextFromPDF, extractTextFromDOCX };