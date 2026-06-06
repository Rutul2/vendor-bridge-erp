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

export const createNewVendor = async (data, user) => {
  if (!data.vendor_code) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    data.vendor_code = `VND-${randomSuffix}`;
  }
  const vendor = await createVendor(data);
  await logActivity({ user_id: user?.id, entity_type: 'Vendor', entity_id: vendor.id, action: 'CREATED', new_data: vendor });
  return vendor;
};

export const updateExistingVendor = async (id, data, user) => {
  const oldVendor = await findVendorById(id);
  const vendor = await updateVendor(id, data);
  await logActivity({ user_id: user?.id, entity_type: 'Vendor', entity_id: vendor.id, action: 'UPDATED', old_data: oldVendor, new_data: vendor });
  return vendor;
};

export const removeVendor = async (id, user) => {
  const vendor = await softDeleteVendor(id);
  await logActivity({ user_id: user?.id, entity_type: 'Vendor', entity_id: id, action: 'DELETED', old_data: vendor });
  return vendor;
};
