// src/config/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { AI_TIMEOUT_MS } = require('./constants');

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('Missing GOOGLE_API_KEY in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Configure the model (you can change to 'gemini-3.5-pro' for higher accuracy)
const model = genAI.getGenerativeModel({
  model: 'gemini-3-flash-preview', 
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 1500,
    // Gemini doesn't have a built-in JSON mode, but we'll enforce it via prompt
  },
});

// We'll add a timeout wrapper because Gemini SDK doesn't have built-in timeout
const callGeminiWithTimeout = async (prompt, timeoutMs) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API timeout')), timeoutMs)
  );
  const requestPromise = model.generateContent(prompt);
  return Promise.race([requestPromise, timeoutPromise]);
};

module.exports = { callGeminiWithTimeout, model };