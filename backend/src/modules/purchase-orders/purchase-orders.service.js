import { logActivity } from '../../utils/activityLogger.js';
import { generateIdCode } from '../../utils/generateNumber.js';
import { countPurchaseOrders, createPurchaseOrder, findPurchaseOrderById, findPurchaseOrders } from './purchase-orders.repository.js';

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
