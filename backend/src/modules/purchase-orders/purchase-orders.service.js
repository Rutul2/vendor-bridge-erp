import { logActivity } from '../../utils/activityLogger.js';
import { generateIdCode } from '../../utils/generateNumber.js';
import { countPurchaseOrders, createPurchaseOrder, findPurchaseOrderById, findPurchaseOrders } from './purchase-orders.repository.js';
import prisma from '../../config/database.js';

export const listPurchaseOrders = async ({ page, limit, search, status, vendor_id }) => {
  const skip = (Number(page || 1) - 1) * Number(limit || 20);
  const take = Number(limit || 20);
  const items = await findPurchaseOrders({ skip, take, search, status, vendor_id });
  const total = await countPurchaseOrders({ search, status, vendor_id });
  return { items, total, page: Number(page || 1), limit: take };
};

export const getPurchaseOrder = async (id) => {
  const purchaseOrder = await findPurchaseOrderById(id);
  if (!purchaseOrder) throw { statusCode: 404, message: 'Purchase order not found' };
  return purchaseOrder;
};

export const createNewPurchaseOrder = async ({ quotation_id, vendor_id, items }, user) => {
  // Verify quotation exists and is APPROVED
  const quotation = await prisma.quotation.findUnique({ where: { id: quotation_id } });
  if (!quotation) throw { statusCode: 404, message: 'Quotation not found' };
  if (quotation.status !== 'APPROVED') {
    throw { statusCode: 400, message: 'Cannot create Purchase Order. The quotation must be approved first.' };
  }

  // Prevent duplicate POs for the same quotation
  const existingPO = await prisma.purchaseOrder.findFirst({ where: { quotation_id } });
  if (existingPO) {
    throw { statusCode: 400, message: 'A Purchase Order already exists for this quotation.' };
  }

  const po_number = generateIdCode('PO');
  const order = await createPurchaseOrder({
    po_number,
    quotation_id,
    vendor_id,
    generated_by: user.id,
    status: 'CREATED',
    items: { create: items },
  });
  await logActivity({ user_id: user.id, entity_type: 'PURCHASE_ORDER', entity_id: order.id, action: 'CREATE', new_data: order });
  return order;
};

export const updatePurchaseOrderStatus = async (id, status, user) => {
  const existing = await findPurchaseOrderById(id);
  if (!existing) throw { statusCode: 404, message: 'Purchase order not found' };
  
  const updated = await updatePurchaseOrder(id, { status });
  await logActivity({ user_id: user.id, entity_type: 'PURCHASE_ORDER', entity_id: id, action: `UPDATE_STATUS_${status}`, old_data: existing, new_data: updated });
  return updated;
};
