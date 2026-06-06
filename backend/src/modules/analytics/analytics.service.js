import * as repo from './analytics.repository.js';
import prisma from '../../config/database.js';

export const getDashboardSummary = async (user) => {
  try {
    if (user && user.role.name === 'VENDOR' && user.vendor_id) {
      const activeRfqs    = await prisma.rfqVendor.count({ where: { vendor_id: user.vendor_id } });
      const pendingApprovals = await prisma.quotation.count({ where: { vendor_id: user.vendor_id, status: 'SUBMITTED' } });
      const posThisMonth  = await prisma.purchaseOrder.count({ where: { vendor_id: user.vendor_id } });
      const monthlyInvoices = await prisma.invoice.count({ where: { vendor_id: user.vendor_id } });
      const recentPurchaseOrders = await prisma.purchaseOrder.findMany({
        where: { vendor_id: user.vendor_id },
        take: 5,
        orderBy: { created_at: 'desc' },
        include: { vendor: true, items: true },
      });
      return { activeRfqs, pendingApprovals, posThisMonth, monthlyInvoices, recentPurchaseOrders };
    }

    if (user && user.role.name === 'MANAGER') {
      const activeRfqs      = await prisma.rfq.count({ where: { status: { not: 'COMPLETED' } } });
      const pendingApprovals = await prisma.approval.count({ where: { status: 'PENDING' } });
      const posThisMonth    = await prisma.purchaseOrder.count();
      const monthlyInvoices = await prisma.invoice.count();
      const recentPurchaseOrders = await repo.recentPurchaseOrders(5);
      return { activeRfqs, pendingApprovals, posThisMonth, monthlyInvoices, recentPurchaseOrders };
    }

    // ADMIN and PROCUREMENT_OFFICER
    const activeRfqs      = await repo.countActiveRfqs();
    const pendingApprovals = await repo.countPendingApprovals();
    const posThisMonth    = await repo.countPurchaseOrders();
    const monthlyInvoices = await repo.countInvoices();
    const totalVendors    = await repo.countVendors();
    const recentPurchaseOrders = await repo.recentPurchaseOrders(5);
    return { activeRfqs, pendingApprovals, posThisMonth, monthlyInvoices, totalVendors, recentPurchaseOrders };
  } catch (err) {
    console.error('getDashboardSummary error:', err);
    return { activeRfqs: 0, pendingApprovals: 0, posThisMonth: 0, monthlyInvoices: 0, recentPurchaseOrders: [] };
  }
};

export const getVendorPerformance = async () => {
  return prisma.vendor.findMany({
    where: { deleted_at: null },
    select: {
      id: true,
      company_name: true,
      rating: true,
      purchase_orders: { select: { id: true } },
      invoices: { select: { id: true, status: true, total_amount: true } },
    },
    orderBy: { rating: 'desc' },
    take: 20,
  });
};

export const getSpendingSummary = async () => {
  const result = await prisma.invoice.aggregate({
    _sum: { total_amount: true, tax_amount: true },
  });
  return {
    total_spending: Number(result._sum.total_amount ?? 0),
    total_tax: Number(result._sum.tax_amount ?? 0),
  };
};

export const getMonthlyTrends = async () => {
  // Use Prisma ORM groupBy to avoid BigInt serialization issues from raw SQL COUNT(*)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const invoices = await prisma.invoice.findMany({
    where: { created_at: { gte: sixMonthsAgo } },
    select: { created_at: true, total_amount: true },
    orderBy: { created_at: 'asc' },
  });

  // Group by month manually
  const monthMap = {};
  invoices.forEach((inv) => {
    const key = inv.created_at.toISOString().slice(0, 7); // "YYYY-MM"
    if (!monthMap[key]) monthMap[key] = { month: key, amount: 0, count: 0 };
    monthMap[key].amount += Number(inv.total_amount ?? 0);
    monthMap[key].count  += 1;
  });

  // If no real data, generate placeholder months so the chart renders
  if (Object.keys(monthMap).length === 0) {
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap[key] = { month: key, amount: 0, count: 0 };
    }
  }

  return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
};

