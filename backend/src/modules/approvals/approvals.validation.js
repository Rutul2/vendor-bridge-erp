import Joi from 'joi';

export const approvalSchema = Joi.object({
  remarks: Joi.string().optional().allow('', null),
});

export const approvalCreateSchema = Joi.object({
  quotation_id: Joi.string().uuid().required(),
  manager_id: Joi.string().uuid().required(),
  remarks: Joi.string().optional().allow('', null),
});
