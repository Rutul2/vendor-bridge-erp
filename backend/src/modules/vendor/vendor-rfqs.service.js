import * as repo from './vendor-rfqs.repository.js';

export const listVendorRfqs = async ({ vendor_id, page, limit }) => {
  const skip = (Number(page || 1) - 1) * Number(limit || 20);
  const take = Number(limit || 20);
  const items = await repo.findRfqsAssignedToVendor({ vendor_id, skip, take });
  const total = items.length; // lightweight; could be optimized
  return { items: items.map((v) => v.rfq), total, page: Number(page || 1), limit: take };
};

export const getVendorRfq = async ({ vendor_id, rfq_id }) => {
  const record = await repo.findRfqAssignedToVendorById({ vendor_id, rfq_id });
  if (!record) throw { statusCode: 404, message: 'RFQ not found for this vendor' };
  return record.rfq;
};
