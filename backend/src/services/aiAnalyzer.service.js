// src/services/aiAnalyzer.service.js
const openai = require('../config/openai');
const AppError = require('../utils/AppError');

const analyzeResume = async (resumeText, jobDescription) => {
  // Build a strict JSON-format prompt
  const prompt = `
You are an expert technical HR recruiter. Analyze the provided resume against the given job description.

Return a SINGLE, VALID JSON object with EXACTLY these 5 keys:
- "matchScore": (integer, 0 to 100)
- "matchedSkills": (array of strings, skills found in resume that match the job)
- "missingSkills": (array of strings, critical skills missing from resume)
- "summary": (string, 2-3 sentences of personalized feedback)
- "improvementTips": (array of strings, 3-4 actionable recommendations)

Resume Text:
"""${resumeText}"""

Job Description:
"""${jobDescription}"""

Rules:
- Be strict and honest with the match score.
- Only include skills explicitly mentioned in the resume.
- Keep the summary professional and constructive.
- Output ONLY the JSON object. No markdown, no extra text.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use 'gpt-3.5-turbo' for cheaper, 'gpt-4o' for more accurate
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR recruiter. You always respond with valid JSON only.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }, // Enforces valid JSON
      max_tokens: 800,
    });

    const content = response.choices[0].message.content;

    // Safely parse the JSON
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('OpenAI returned invalid JSON:', content);
      throw new AppError('AI returned malformed data. Please try again.', 500);
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);

    // Handle OpenAI specific errors
    if (error.status === 429) {
      throw new AppError('AI service is currently overloaded. Please wait a moment.', 503);
    }
    if (error.status === 401) {
      throw new AppError('Invalid OpenAI API key. Please check server configuration.', 500);
    }

    // Re-throw AppError or wrap others
    if (error.isOperational) throw error;
    throw new AppError('Failed to analyze resume. Please try again later.', 503);
  }
};

module.exports = { analyzeResume };