import Joi from 'joi';

export const rfqItemSchema = Joi.object({
  product_name: Joi.string().trim().min(2).required(),
  description: Joi.string().trim().optional().allow('', null),
  quantity: Joi.number().integer().positive().min(1).required(),
  unit: Joi.string().trim().required(),
  estimated_price: Joi.number().positive().min(0).required(),
});

export const rfqCreateSchema = Joi.object({
  title: Joi.string().trim().min(5).required(),
  description: Joi.string().trim().optional().allow('', null),
  deadline: Joi.date().iso().min('now').required().messages({
    'date.min': 'Deadline cannot be in the past'
  }),
  status: Joi.string().valid('DRAFT','OPEN','UNDER_REVIEW','PENDING_APPROVAL','APPROVED','REJECTED','COMPLETED').optional(),
  items: Joi.array().items(rfqItemSchema).min(1).required(),
  vendor_ids: Joi.array().items(Joi.string().uuid()).optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
});

export const rfqUpdateSchema = Joi.object({
  title: Joi.string().trim().min(5).optional(),
  description: Joi.string().trim().optional().allow('', null),
  deadline: Joi.date().iso().min('now').optional().messages({
    'date.min': 'Deadline cannot be in the past'
  }),
  status: Joi.string().valid('DRAFT','OPEN','UNDER_REVIEW','PENDING_APPROVAL','APPROVED','REJECTED','COMPLETED').optional(),
  items: Joi.array().items(rfqItemSchema).min(1).optional(),
  vendor_ids: Joi.array().items(Joi.string().uuid()).optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
});

export const vendorAssignSchema = Joi.object({
  vendor_ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
});
