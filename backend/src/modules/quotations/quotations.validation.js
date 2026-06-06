import Joi from 'joi';

export const quotationItemSchema = Joi.object({
  product_name: Joi.string().required(),
  quantity: Joi.number().integer().positive().required(),
  unit_price: Joi.number().positive().required(),
  subtotal: Joi.number().positive().required(),
});

export const quotationCreateSchema = Joi.object({
  rfq_id: Joi.string().uuid().required(),
  vendor_id: Joi.string().uuid().required(),
  total_amount: Joi.number().positive().required(),
  delivery_days: Joi.number().integer().positive().required(),
  notes: Joi.string().optional().allow('', null),
  status: Joi.string().valid('PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED').optional(),
  items: Joi.array().items(quotationItemSchema).min(1).required(),
});

export const quotationUpdateSchema = Joi.object({
  total_amount: Joi.number().positive().optional(),
  delivery_days: Joi.number().integer().positive().optional(),
  notes: Joi.string().optional().allow('', null),
  status: Joi.string().valid('PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED').optional(),
  items: Joi.array().items(quotationItemSchema).min(1).optional(),
});
