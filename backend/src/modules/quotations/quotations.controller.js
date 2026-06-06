import { successResponse } from '../../utils/response.js';
import { createNewQuotation, getQuotation, listQuotations, updateExistingQuotation } from './quotations.service.js';

export const listQuotationsHandler = async (req, res) => {
  const query = { ...req.query };
  if (req.user.role.name === 'VENDOR' && req.user.vendor_id) {
    query.vendor_id = req.user.vendor_id;
  }
  const data = await listQuotations(query);
  return successResponse(res, 'Quotations retrieved successfully', data);
};

export const getQuotationHandler = async (req, res) => {
  const data = await getQuotation(req.params.id);
  return successResponse(res, 'Quotation retrieved successfully', data);
};

export const createQuotationHandler = async (req, res) => {
  const data = await createNewQuotation(req.body, req.user);
  return successResponse(res, 'Quotation submitted successfully', data);
};

export const updateQuotationHandler = async (req, res) => {
  const data = await updateExistingQuotation(req.params.id, req.body);
  return successResponse(res, 'Quotation updated successfully', data);
};
