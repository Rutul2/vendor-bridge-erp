import { logActivity } from '../../utils/activityLogger.js';
import { findQuotationsByRfq } from '../quotations/quotations.repository.js';
import { assignVendors, countRfqs, createAttachment, createRfq, deleteRfq, findAttachmentsByRfq, findRfqById, findRfqs, updateRfq } from './rfqs.repository.js';

export const listRfqs = async ({ page, limit, search, status, created_by, vendorId }) => {
  const skip = (Number(page || 1) - 1) * Number(limit || 20);
  const take = Number(limit || 20);
  const items = await findRfqs({ skip, take, search, status, createdBy: created_by, vendorId });
  const total = await countRfqs({ search, status, createdBy: created_by, vendorId });
  return { items, total, page: Number(page || 1), limit: take };
};

export const getRfq = async (id) => {
  const rfq = await findRfqById(id);
  if (!rfq) throw { statusCode: 404, message: 'RFQ not found' };
  return rfq;
};

export const createNewRfq = async ({ vendor_ids, items, attachments, ...payload }, user) => {
  // If vendors are assigned AND user sends to vendors, mark as OPEN; otherwise DRAFT
  const status = (vendor_ids && vendor_ids.length > 0 && payload.status === 'OPEN') ? 'OPEN' : (payload.status || 'DRAFT');
  const rfq = await createRfq({
    ...payload,
    created_by: user.id,
    status,
    items: { create: items },
    vendors: vendor_ids ? { create: vendor_ids.map((vendor_id) => ({ vendor_id, invitation_status: 'PENDING' })) } : undefined,
    attachments: attachments && attachments.length > 0 ? { create: attachments.map(f => ({ file_name: f, file_url: f })) } : undefined,
  });
  await logActivity({ user_id: user.id, entity_type: 'RFQ', entity_id: rfq.id, action: 'CREATE', new_data: rfq });
  return rfq;
};

export const updateExistingRfq = async (id, payload) => {
  const existing = await getRfq(id);
  const { items, vendor_ids, ...rest } = payload;
  const data = { ...rest };
  if (items) {
    data.items = { deleteMany: {}, create: items };
  }
  if (vendor_ids) {
    data.vendors = { deleteMany: {}, create: vendor_ids.map((vendor_id) => ({ vendor_id, invitation_status: 'PENDING' })) };
  }
  const updated = await updateRfq(id, data);
  await logActivity({ user_id: existing.created_by, entity_type: 'RFQ', entity_id: updated.id, action: 'UPDATE', old_data: existing, new_data: updated });
  return updated;
};

export const removeRfq = async (id) => {
  const existing = await getRfq(id);
  const deleted = await deleteRfq(id);
  await logActivity({ user_id: existing.created_by, entity_type: 'RFQ', entity_id: deleted.id, action: 'DELETE', old_data: existing });
  return deleted;
};

export const reassignRfqVendors = async (rfqId, vendorIds) => assignVendors(rfqId, vendorIds);

export const uploadRfqAttachment = async (rfqId, file, user) => {
  const rfq = await getRfq(rfqId);
  if (!rfq) throw { statusCode: 404, message: 'RFQ not found' };
  const attachment = await createAttachment({ rfq_id: rfqId, file_name: file.originalname, file_url: file.path });
  await logActivity({ user_id: user.id, entity_type: 'RFQ_ATTACHMENT', entity_id: attachment.id, action: 'CREATE', new_data: attachment });
  return attachment;
};

export const listRfqAttachments = async (rfqId) => {
  const rfq = await getRfq(rfqId);
  if (!rfq) throw { statusCode: 404, message: 'RFQ not found' };
  return findAttachmentsByRfq(rfqId);
};

export const getQuotationComparison = async (rfqId) => {
  const quotations = await findQuotationsByRfq(rfqId);
  if (!quotations || quotations.length === 0) return [];
  // sort by total_amount ascending
  const sorted = quotations.map((q) => ({
    vendor_name: q.vendor.company_name,
    total_amount: q.total_amount,
    delivery_days: q.delivery_days,
    vendor_rating: q.vendor.rating ?? 0,
    quotation_id: q.id,
  })).sort((a, b) => Number(a.total_amount) - Number(b.total_amount));
  const lowest = sorted[0]?.total_amount;
  return sorted.map((s) => ({ ...s, is_lowest_price: Number(s.total_amount) === Number(lowest) }));
};
