import Joi from 'joi';

export const vendorCreateSchema = Joi.object({
  company_name: Joi.string().required(),
  vendor_code: Joi.string().required(),
  category: Joi.string().required(),
  gst_number: Joi.string().optional().allow('', null),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().allow('', null),
  address: Joi.string().optional().allow('', null),
  rating: Joi.number().min(0).max(5).optional(),
  status: Joi.string().optional(),
});

export const vendorUpdateSchema = Joi.object({
  company_name: Joi.string().optional(),
  vendor_code: Joi.string().optional(),
  category: Joi.string().optional(),
  gst_number: Joi.string().optional().allow('', null),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional().allow('', null),
  address: Joi.string().optional().allow('', null),
  rating: Joi.number().min(0).max(5).optional(),
  status: Joi.string().optional(),
});
