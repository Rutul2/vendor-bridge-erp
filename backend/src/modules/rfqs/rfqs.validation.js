import Joi from 'joi';

export const rfqItemSchema = Joi.object({
  product_name: Joi.string().required(),
  description: Joi.string().optional().allow('', null),
  quantity: Joi.number().integer().positive().required(),
  unit: Joi.string().required(),
  estimated_price: Joi.number().positive().required(),
});

export const rfqCreateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow('', null),
  deadline: Joi.date().iso().required(),
  status: Joi.string().valid('DRAFT','OPEN','UNDER_REVIEW','PENDING_APPROVAL','APPROVED','REJECTED','COMPLETED').optional(),
  items: Joi.array().items(rfqItemSchema).min(1).required(),
  vendor_ids: Joi.array().items(Joi.string().uuid()).optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
});

export const rfqUpdateSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow('', null),
  deadline: Joi.date().iso().optional(),
  status: Joi.string().valid('DRAFT','OPEN','UNDER_REVIEW','PENDING_APPROVAL','APPROVED','REJECTED','COMPLETED').optional(),
  items: Joi.array().items(rfqItemSchema).min(1).optional(),
  vendor_ids: Joi.array().items(Joi.string().uuid()).optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
});

export const vendorAssignSchema = Joi.object({
  vendor_ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
});
