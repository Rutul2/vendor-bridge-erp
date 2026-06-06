import { successResponse } from '../../utils/response.js';
import { createNewPurchaseOrder, getPurchaseOrder, listPurchaseOrders, updatePurchaseOrderStatus } from './purchase-orders.service.js';

export const listPurchaseOrdersHandler = async (req, res) => {
  const query = { ...req.query };
  if (req.user.role.name === 'VENDOR' && req.user.vendor_id) {
    query.vendor_id = req.user.vendor_id;
  }
  const data = await listPurchaseOrders(query);
  return successResponse(res, 'Purchase orders retrieved successfully', data);
};

export const getPurchaseOrderHandler = async (req, res) => {
  const data = await getPurchaseOrder(req.params.id);
  return successResponse(res, 'Purchase order retrieved successfully', data);
};

export const createPurchaseOrderHandler = async (req, res) => {
  const data = await createNewPurchaseOrder(req.body, req.user);
  return successResponse(res, 'Purchase order created successfully', data);
};

export const updatePurchaseOrderStatusHandler = async (req, res) => {
  const data = await updatePurchaseOrderStatus(req.params.id, req.body.status, req.user);
  return successResponse(res, 'Purchase order status updated successfully', data);
};
