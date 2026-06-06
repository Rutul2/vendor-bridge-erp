import { successResponse } from '../../utils/response.js';
import { approveQuotation, listApprovals, rejectQuotation } from './approvals.service.js';

export const listApprovalsHandler = async (req, res) => {
  const data = await listApprovals(req.query);
  return successResponse(res, 'Approvals retrieved successfully', data);
};

export const approveHandler = async (req, res) => {
  const data = await approveQuotation(req.params.id, req.user, req.body.remarks);
  return successResponse(res, 'Quotation approved successfully', data);
};

export const rejectHandler = async (req, res) => {
  const data = await rejectQuotation(req.params.id, req.user, req.body.remarks);
  return successResponse(res, 'Quotation rejected successfully', data);
};
