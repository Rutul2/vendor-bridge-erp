import { successResponse } from '../../utils/response.js';
import { approveQuotation, createNewApproval, getApproval, listApprovals, rejectQuotation } from './approvals.service.js';

export const listApprovalsHandler = async (req, res) => {
  const data = await listApprovals(req.query);
  return successResponse(res, 'Approvals retrieved successfully', data);
};

export const getApprovalHandler = async (req, res) => {
  const data = await getApproval(req.params.id);
  return successResponse(res, 'Approval retrieved successfully', data);
};

export const createApprovalHandler = async (req, res) => {
  const data = await createNewApproval(req.body, req.user);
  return successResponse(res, 'Approval request created successfully', data);
};

export const approveHandler = async (req, res) => {
  const data = await approveQuotation(req.params.id, req.user, req.body.remarks);
  return successResponse(res, 'Quotation approved successfully', data);
};

export const rejectHandler = async (req, res) => {
  const data = await rejectQuotation(req.params.id, req.user, req.body.remarks);
  return successResponse(res, 'Quotation rejected successfully', data);
};
