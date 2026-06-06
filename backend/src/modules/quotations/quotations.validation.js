import Joi from 'joi';

export const quotationItemSchema = Joi.object({
  product_name: Joi.string().trim().min(1).required(),
  quantity: Joi.number().integer().positive().min(1).required(),
  unit_price: Joi.number().min(0).required(),
  subtotal: Joi.number().min(0).required(),
});

export const quotationCreateSchema = Joi.object({
  rfq_id: Joi.string().uuid().required(),
  vendor_id: Joi.string().uuid().optional().allow(null, ''),
  total_amount: Joi.number().min(0).required(),
  delivery_days: Joi.number().integer().positive().min(1).required(),
  notes: Joi.string().trim().optional().allow('', null),
  status: Joi.string().valid('PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED').optional(),
  items: Joi.array().items(quotationItemSchema).min(1).required(),
});

export const quotationUpdateSchema = Joi.object({
  total_amount: Joi.number().positive().min(0).optional(),
  delivery_days: Joi.number().integer().positive().min(1).optional(),
  notes: Joi.string().trim().optional().allow('', null),
  status: Joi.string().valid('PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED').optional(),
  items: Joi.array().items(quotationItemSchema).min(1).optional(),
});
