const { callGeminiWithTimeout } = require('../config/gemini');
const AppError = require('../utils/AppError');
const { AI_TIMEOUT_MS, MAX_RESUME_CHARS, MAX_JOB_DESC_CHARS } = require('../config/constants');

// Improved JSON extraction (tolerate trailing comma, incomplete arrays)
const extractJSON = (text) => {
  // Remove markdown fences
  let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  // Try to find the first { and the last } and grab between
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return null;

  let jsonStr = cleaned.substring(start, end + 1);
  // Fix common JSON issues: trailing commas
  jsonStr = jsonStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    // If it fails, try to parse after adding missing closing braces (rare)
    // But likely it's still incomplete, so return null
    return null;
  }
};

const analyzeResume = async (resumeText, jobDescription) => {
  const resumeSnippet = resumeText.slice(0, MAX_RESUME_CHARS);
  const jobSnippet = jobDescription.slice(0, MAX_JOB_DESC_CHARS);

  // Prompt optimized for brevity
  const prompt = `
You are an expert HR recruiter. Analyze the resume against the job description.

Return a JSON object with these exact keys:
- "matchScore": number 0-100
- "matchedSkills": string[] (skills in resume that match job)
- "missingSkills": string[] (critical skills missing)
- "summary": string (2 sentences max)
- "improvementTips": string[] (3 bullet points, each max 8 words)
- "strengths": string[] (top 3 strengths)
- "weaknesses": string[] (top 3 weaknesses)

Resume:
"""${resumeSnippet}"""

Job Description:
"""${jobSnippet}"""

Output ONLY the JSON object. No additional text.
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
    if (error.message === 'Gemini API timeout') {
      throw new AppError('AI service is taking too long. Please try again.', 504);
    }
    if (error.status === 429 || error.message?.includes('quota')) {
      throw new AppError('AI service is currently overloaded. Please wait.', 503);
    }
    if (error.status === 403 || error.message?.includes('API key')) {
      throw new AppError('Invalid Gemini API key.', 500);
    }
    if (error.isOperational) throw error;
    throw new AppError('Failed to analyze resume. Please try again later.', 503);
  }
};

module.exports = { analyzeResume };