const { GoogleGenerativeAI } = require('@google/generative-ai');
const { AI_TIMEOUT_MS, AI_MAX_OUTPUT_TOKENS } = require('./constants');

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('Missing GOOGLE_API_KEY in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: AI_MAX_OUTPUT_TOKENS, // ✅ now 4096
  },
});

const callGeminiWithTimeout = async (prompt, timeoutMs) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Gemini API timeout')), timeoutMs);
  });
  const requestPromise = model.generateContent(prompt);
  const race = Promise.race([requestPromise, timeoutPromise]);
  race.finally(() => clearTimeout(timeoutId));
  return race;
};

module.exports = { callGeminiWithTimeout, model };