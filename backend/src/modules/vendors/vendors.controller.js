import { successResponse } from '../../utils/response.js';
import { createNewVendor, getVendor, listVendors, removeVendor, updateExistingVendor } from './vendors.service.js';

export const listVendorsHandler = async (req, res) => {
  const data = await listVendors(req.query);
  return successResponse(res, 'Vendors retrieved successfully', data);
};

export const getVendorHandler = async (req, res) => {
  const data = await getVendor(req.params.id);
  return successResponse(res, 'Vendor retrieved successfully', data);
};

export const createVendorHandler = async (req, res) => {
  const data = await createNewVendor(req.body);
  return successResponse(res, 'Vendor created successfully', data);
};

export const updateVendorHandler = async (req, res) => {
  const data = await updateExistingVendor(req.params.id, req.body);
  return successResponse(res, 'Vendor updated successfully', data);
};

export const deleteVendorHandler = async (req, res) => {
  await removeVendor(req.params.id);
  return successResponse(res, 'Vendor deleted successfully');
};
