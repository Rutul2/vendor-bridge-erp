import { successResponse } from '../../utils/response.js';
import { createNewPurchaseOrder, getPurchaseOrder, listPurchaseOrders } from './purchase-orders.service.js';

export const listPurchaseOrdersHandler = async (req, res) => {
  const data = await listPurchaseOrders(req.query);
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
