import { logActivity } from '../../utils/activityLogger.js';
import prisma from '../../config/database.js';
import { countApprovals, createApproval, findApprovals, findApprovalById, findQuotationById, updateQuotationStatus } from './approvals.repository.js';

export const listApprovals = async ({ page, limit, status, quotation_id }) => {
  const skip = (Number(page || 1) - 1) * Number(limit || 20);
  const take = Number(limit || 20);
  const items = await findApprovals({ skip, take, status, quotation_id });
  const total = await countApprovals({ status, quotation_id });
  return { items, total, page: Number(page || 1), limit: take };
};

export const getApproval = async (id) => {
  const approval = await findApprovalById(id);
  if (!approval) throw { statusCode: 404, message: 'Approval not found' };
  return approval;
};

export const createNewApproval = async (payload, user) => {
  const quotation = await findQuotationById(payload.quotation_id);
  if (!quotation) throw { statusCode: 404, message: 'Quotation not found' };
  
  await prisma.rfq.update({ where: { id: quotation.rfq_id }, data: { status: 'PENDING_APPROVAL' } });

  const approval = await createApproval({ 
    quotation_id: payload.quotation_id, 
    approved_by: payload.manager_id, 
    status: 'PENDING', 
    remarks: payload.remarks || 'Please review this quotation.' 
  });
  
  await logActivity({ user_id: user.id, entity_type: 'APPROVAL', entity_id: approval.id, action: 'REQUEST_APPROVAL', new_data: approval });
  return approval;
};

export const approveQuotation = async (quotationId, user, remarks) => {
  const quotation = await findQuotationById(quotationId);
  if (!quotation) throw { statusCode: 404, message: 'Quotation not found' };
  if (quotation.status === 'APPROVED') throw { statusCode: 400, message: 'Quotation has already been approved.' };
  if (quotation.status === 'REJECTED') throw { statusCode: 400, message: 'Cannot approve a quotation that has already been rejected.' };
  await updateQuotationStatus(quotationId, 'APPROVED');
  const approval = await createApproval({ quotation_id: quotationId, approved_by: user.id, status: 'APPROVED', remarks });
  await logActivity({ user_id: user.id, entity_type: 'APPROVAL', entity_id: approval.id, action: 'APPROVE', old_data: quotation, new_data: approval });
  return approval;
};

export const rejectQuotation = async (quotationId, user, remarks) => {
  const quotation = await findQuotationById(quotationId);
  if (!quotation) throw { statusCode: 404, message: 'Quotation not found' };
  if (quotation.status === 'REJECTED') throw { statusCode: 400, message: 'Quotation has already been rejected.' };
  if (quotation.status === 'APPROVED') throw { statusCode: 400, message: 'Cannot reject a quotation that has already been approved.' };
  await updateQuotationStatus(quotationId, 'REJECTED');
  const approval = await createApproval({ quotation_id: quotationId, approved_by: user.id, status: 'REJECTED', remarks });
  await logActivity({ user_id: user.id, entity_type: 'APPROVAL', entity_id: approval.id, action: 'REJECT', old_data: quotation, new_data: approval });
  return approval;
};
