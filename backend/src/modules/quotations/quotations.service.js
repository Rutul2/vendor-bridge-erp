import { logActivity } from '../../utils/activityLogger.js';
import { countQuotations, createQuotation, findQuotationById, findQuotations, updateQuotation } from './quotations.repository.js';

export const listQuotations = async ({ page, limit, search, status, vendor_id }) => {
  const skip = (Number(page || 1) - 1) * Number(limit || 20);
  const take = Number(limit || 20);
  const items = await findQuotations({ skip, take, search, status, vendor_id });
  const total = await countQuotations({ search, status, vendor_id });
  return { items, total, page: Number(page || 1), limit: take };
};

export const getQuotation = async (id) => {
  const quotation = await findQuotationById(id);
  if (!quotation) throw { statusCode: 404, message: 'Quotation not found' };
  return quotation;
};

export const createNewQuotation = async (payload) => {
  const quotation = await createQuotation({
    ...payload,
    status: payload.status || 'SUBMITTED',
    submitted_at: new Date(),
    items: { create: payload.items },
  });
  await logActivity({ user_id: payload.vendor_id, entity_type: 'QUOTATION', entity_id: quotation.id, action: 'CREATE', new_data: quotation });
  return quotation;
};

export const updateExistingQuotation = async (id, payload) => {
  const existing = await findQuotationById(id);
  if (!existing) throw { statusCode: 404, message: 'Quotation not found' };
  const { items, ...rest } = payload;
  const data = { ...rest };
  if (items) {
    data.items = { deleteMany: {}, create: items };
  }
  const updated = await updateQuotation(id, data);
  await logActivity({ user_id: existing.vendor_id, entity_type: 'QUOTATION', entity_id: updated.id, action: 'UPDATE', old_data: existing, new_data: updated });
  return updated;
};
