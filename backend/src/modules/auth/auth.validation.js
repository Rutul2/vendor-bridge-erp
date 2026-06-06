import Joi from 'joi';

const passwordRule = Joi.string()
  .min(8)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
  .required()
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    'any.required': 'Password is required'
  });

export const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).required().messages({
    'string.empty': 'Name cannot be empty or just spaces',
    'string.min': 'Name must be at least 2 characters long'
  }),
  email: Joi.string().trim().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'Email cannot be empty',
    'string.email': 'Please provide a valid email address'
  }),
  password: passwordRule,
  role: Joi.string().valid('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR').required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'Email cannot be empty',
    'string.email': 'Please provide a valid email address'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password cannot be empty'
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: passwordRule,
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
