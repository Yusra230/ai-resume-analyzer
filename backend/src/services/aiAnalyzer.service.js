// src/services/aiAnalyzer.service.js
const { callGeminiWithTimeout } = require('../config/gemini');
const AppError = require('../utils/AppError');
const { AI_TIMEOUT_MS } = require('../config/constants');

// Helper: extract JSON from a mixed response
const extractJSON = (text) => {
  // Find the first JSON object in the text
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  let jsonStr = match[0];
  // Clean common issues: trailing commas in objects/arrays
  jsonStr = jsonStr
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .trim();

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    // Fallback: try to parse after removing markdown fences
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      return null;
    }
  }
};

const analyzeResume = async (resumeText, jobDescription) => {
  // Shorten the prompt to reduce token usage and ensure concise output
  const prompt = `
You are an expert HR recruiter. Analyze the resume against the job description.

Return a VALID JSON object with exactly these keys:
- "matchScore": integer 0-100
- "matchedSkills": array of strings (skills in resume matching job)
- "missingSkills": array of strings (critical skills missing)
- "summary": string (2-3 sentences)
- "improvementTips": array of strings (3-4 recommendations)

Resume text:
"""${resumeText.slice(0, 10000)}"""

Job description:
"""${jobDescription.slice(0, 5000)}"""

Output only the JSON object, no other text.
`;

  try {
    const result = await callGeminiWithTimeout(prompt, AI_TIMEOUT_MS);
    const content = result.response.text();

    const parsed = extractJSON(content);
    if (!parsed) {
      console.error('Gemini returned unparseable content:', content);
      throw new AppError('AI returned malformed data. Please try again.', 500);
    }

    // Validate required keys
    const required = ['matchScore', 'matchedSkills', 'missingSkills', 'summary', 'improvementTips'];
    const missing = required.filter(key => !(key in parsed));
    if (missing.length) {
      console.error('Missing keys in AI response:', missing, parsed);
      throw new AppError('AI response missing required fields.', 500);
    }

    return parsed;
  } catch (error) {
    console.error('Gemini API Error:', error);

    // Handle specific errors
    if (error.message === 'Gemini API timeout') {
      throw new AppError('AI service is taking too long. Please try again.', 504);
    }
    if (error.status === 429 || error.message?.includes('quota')) {
      throw new AppError('AI service is currently overloaded. Please wait a moment.', 503);
    }
    if (error.status === 403 || error.message?.includes('API key')) {
      throw new AppError('Invalid Gemini API key. Please check server configuration.', 500);
    }

    // Re-throw AppError if already operational, else wrap
    if (error.isOperational) throw error;
    throw new AppError('Failed to analyze resume. Please try again later.', 503);
  }
};

module.exports = { analyzeResume };