// src/utils/asyncWrapper.js
// Eliminates try-catch repetition in controllers
const asyncWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncWrapper;