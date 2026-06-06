import Joi from 'joi';

export const userCreateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR').required(),
  is_active: Joi.boolean().optional(),
});

export const userUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  role: Joi.string().valid('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR').optional(),
  is_active: Joi.boolean().optional(),
});
