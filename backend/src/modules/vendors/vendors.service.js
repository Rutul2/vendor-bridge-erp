import { logActivity } from '../../utils/activityLogger.js';
import { countVendors, createVendor, findVendorById, findVendors, softDeleteVendor, updateVendor } from './vendors.repository.js';

export const listVendors = async ({ page, limit, search, category, status }) => {
  const skip = (Number(page || 1) - 1) * Number(limit || 20);
  const take = Number(limit || 20);
  const items = await findVendors({ skip, take, search, category, status });
  const total = await countVendors({ search, category, status });
  return { items, total, page: Number(page || 1), limit: take };
};

export const getVendor = async (id) => {
  const vendor = await findVendorById(id);
  if (!vendor) throw { statusCode: 404, message: 'Vendor not found' };
  return vendor;
};

export const createNewVendor = async (payload) => {
  const vendor = await createVendor(payload);
  await logActivity({ user_id: null, entity_type: 'VENDOR', entity_id: vendor.id, action: 'CREATE', new_data: vendor });
  return vendor;
};

export const updateExistingVendor = async (id, payload) => {
  const existing = await getVendor(id);
  const updated = await updateVendor(id, payload);
  await logActivity({ user_id: null, entity_type: 'VENDOR', entity_id: updated.id, action: 'UPDATE', old_data: existing, new_data: updated });
  return updated;
};

export const removeVendor = async (id) => {
  const existing = await getVendor(id);
  const deleted = await softDeleteVendor(id);
  await logActivity({ user_id: null, entity_type: 'VENDOR', entity_id: deleted.id, action: 'DELETE', old_data: existing });
  return deleted;
};
