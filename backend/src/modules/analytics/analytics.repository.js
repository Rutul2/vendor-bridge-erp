import prisma from '../../config/database.js';

export const countVendors = async () => prisma.vendor.count({ where: { deleted_at: null } });
export const countActiveRfqs = async () => prisma.rfq.count({ where: { status: { not: 'COMPLETED' } } });
export const countPendingApprovals = async () => prisma.quotation.count({ where: { status: 'SUBMITTED', approvals: { none: {} } } });
export const countPurchaseOrders = async () => prisma.purchaseOrder.count();
export const countInvoices = async () => prisma.invoice.count();

export const recentPurchaseOrders = async (limit = 5) => prisma.purchaseOrder.findMany({
  orderBy: { created_at: 'desc' },
  take: Number(limit),
  include: { vendor: true, items: true },
});

export const recentInvoices = async (limit = 5) => prisma.invoice.findMany({
  orderBy: { created_at: 'desc' },
  take: Number(limit),
  include: { vendor: true, purchase_order: true },
});
