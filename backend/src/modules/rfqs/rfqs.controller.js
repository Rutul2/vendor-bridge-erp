import { successResponse } from '../../utils/response.js';
import { createNewRfq, getQuotationComparison, getRfq, listRfqAttachments, listRfqs, reassignRfqVendors, removeRfq, updateExistingRfq, uploadRfqAttachment } from './rfqs.service.js';

export const listRfqsHandler = async (req, res) => {
  const data = await listRfqs({ ...req.query, created_by: req.query.created_by });
  return successResponse(res, 'RFQs retrieved successfully', data);
};

export const getRfqHandler = async (req, res) => {
  const data = await getRfq(req.params.id);
  return successResponse(res, 'RFQ retrieved successfully', data);
};

export const createRfqHandler = async (req, res) => {
  const data = await createNewRfq(req.body, req.user);
  return successResponse(res, 'RFQ created successfully', data);
};

export const updateRfqHandler = async (req, res) => {
  const data = await updateExistingRfq(req.params.id, req.body);
  return successResponse(res, 'RFQ updated successfully', data);
};

export const deleteRfqHandler = async (req, res) => {
  await removeRfq(req.params.id);
  return successResponse(res, 'RFQ deleted successfully');
};

export const assignVendorsHandler = async (req, res) => {
  const data = await reassignRfqVendors(req.params.id, req.body.vendor_ids);
  return successResponse(res, 'RFQ vendors assigned successfully', data);
};

export const uploadAttachmentHandler = async (req, res) => {
  if (!req.file) return successResponse(res, 'No file uploaded', []);
  const data = await uploadRfqAttachment(req.params.id, req.file, req.user);
  return successResponse(res, 'Attachment uploaded', data);
};

export const listAttachmentsHandler = async (req, res) => {
  const data = await listRfqAttachments(req.params.id);
  return successResponse(res, 'Attachments fetched', data);
};

export const getComparisonHandler = async (req, res) => {
  const data = await getQuotationComparison(req.params.id);
  return successResponse(res, 'Quotation comparison', data);
};
