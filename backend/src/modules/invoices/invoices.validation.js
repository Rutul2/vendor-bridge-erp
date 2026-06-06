import Joi from 'joi';

export const invoiceCreateSchema = Joi.object({
  purchase_order_id: Joi.string().uuid().required(),
  vendor_id: Joi.string().uuid().required(),
  tax_amount: Joi.number().min(0).required(),
  total_amount: Joi.number().positive().min(0).required(),
  status: Joi.string().valid('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED').optional(),
});

export const emailInvoiceSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  subject: Joi.string().trim().optional(),
  message: Joi.string().trim().optional(),
});
