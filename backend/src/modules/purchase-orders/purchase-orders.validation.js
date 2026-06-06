import Joi from 'joi';

export const purchaseOrderItemSchema = Joi.object({
  product_name: Joi.string().trim().min(2).required(),
  quantity: Joi.number().integer().positive().min(1).required(),
  unit_price: Joi.number().positive().min(0).required(),
  tax: Joi.number().min(0).required(),
  subtotal: Joi.number().positive().min(0).required(),
});

export const purchaseOrderCreateSchema = Joi.object({
  quotation_id: Joi.string().uuid().required(),
  vendor_id: Joi.string().uuid().required(),
  items: Joi.array().items(purchaseOrderItemSchema).min(1).required(),
});
