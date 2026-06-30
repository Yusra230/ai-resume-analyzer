// src/middlewares/validation.middleware.js
const Joi = require('joi');
const AppError = require('../utils/AppError');

const validateJobDescription = (req, res, next) => {
  const schema = Joi.object({
    jobDescription: Joi.string()
      .min(10, 'utf8')
      .max(15000, 'utf8') // Prevent massive payloads
      .required()
      .messages({
        'string.empty': 'Job description is required.',
        'string.min': 'Job description must be at least 10 characters.',
        'string.max': 'Job description cannot exceed 15000 characters.',
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

module.exports = { validateJobDescription };