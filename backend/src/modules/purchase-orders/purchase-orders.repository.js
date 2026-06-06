import prisma from '../../config/database.js';

export const findPurchaseOrders = async ({ skip, take, search, status, vendor_id }) => {
  const where = {
    AND: [
      search ? { OR: [{ po_number: { contains: search, mode: 'insensitive' } }, { id: { contains: search, mode: 'insensitive' } }] } : {},
      status ? { status } : {},
      vendor_id ? { vendor_id } : {},
    ],
  };
  return prisma.purchaseOrder.findMany({
    where,
    skip,
    take,
    orderBy: { created_at: 'desc' },
    include: { items: true, vendor: true, quotation: true, generatedBy: true },
  });
};

export const countPurchaseOrders = async ({ search, status, vendor_id }) => prisma.purchaseOrder.count({ where: {
  AND: [
    search ? { OR: [{ po_number: { contains: search, mode: 'insensitive' } }, { id: { contains: search, mode: 'insensitive' } }] } : {},
    status ? { status } : {},
    vendor_id ? { vendor_id } : {},
  ],
}});

export const findPurchaseOrderById = async (id) => prisma.purchaseOrder.findUnique({ 
  where: { id },
  include: { items: true, vendor: true, quotation: true, generatedBy: true }
});

export const createPurchaseOrder = async (data) => prisma.purchaseOrder.create({ data });
export const updatePurchaseOrder = async (id, data) => prisma.purchaseOrder.update({ where: { id }, data });
