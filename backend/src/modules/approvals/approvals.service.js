import { logActivity } from '../../utils/activityLogger.js';
import { countApprovals, createApproval, findApprovals, findQuotationById, updateQuotationStatus } from './approvals.repository.js';

export const listApprovals = async ({ page, limit, status, quotation_id }) => {
  const skip = (Number(page || 1) - 1) * Number(limit || 20);
  const take = Number(limit || 20);
  const items = await findApprovals({ skip, take, status, quotation_id });
  const total = await countApprovals({ status, quotation_id });
  return { items, total, page: Number(page || 1), limit: take };
};

export const approveQuotation = async (quotationId, user, remarks) => {
  const quotation = await findQuotationById(quotationId);
  if (!quotation) throw { statusCode: 404, message: 'Quotation not found' };
  if (quotation.status === 'APPROVED') throw { statusCode: 400, message: 'Quotation already approved' };
  await updateQuotationStatus(quotationId, 'APPROVED');
  const approval = await createApproval({ quotation_id: quotationId, approved_by: user.id, status: 'APPROVED', remarks });
  await logActivity({ user_id: user.id, entity_type: 'APPROVAL', entity_id: approval.id, action: 'APPROVE', old_data: quotation, new_data: approval });
  return approval;
};

export const rejectQuotation = async (quotationId, user, remarks) => {
  const quotation = await findQuotationById(quotationId);
  if (!quotation) throw { statusCode: 404, message: 'Quotation not found' };
  if (quotation.status === 'REJECTED') throw { statusCode: 400, message: 'Quotation already rejected' };
  await updateQuotationStatus(quotationId, 'REJECTED');
  const approval = await createApproval({ quotation_id: quotationId, approved_by: user.id, status: 'REJECTED', remarks });
  await logActivity({ user_id: user.id, entity_type: 'APPROVAL', entity_id: approval.id, action: 'REJECT', old_data: quotation, new_data: approval });
  return approval;
};
