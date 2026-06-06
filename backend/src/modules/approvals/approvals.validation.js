import Joi from 'joi';

export const approvalSchema = Joi.object({
  remarks: Joi.string().optional().allow('', null),
});
