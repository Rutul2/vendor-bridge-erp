import * as repo from './analytics.repository.js';

export const getDashboardSummary = async () => {
  const totalVendors = await repo.countVendors();
  const activeRFQs = await repo.countActiveRfqs();
  const pendingApprovals = await repo.countPendingApprovals();
  const totalPurchaseOrders = await repo.countPurchaseOrders();
  const totalInvoices = await repo.countInvoices();
  const recentPurchaseOrders = await repo.recentPurchaseOrders(5);
  const recentInvoices = await repo.recentInvoices(5);

  return { totalVendors, activeRFQs, pendingApprovals, totalPurchaseOrders, totalInvoices, recentPurchaseOrders, recentInvoices };
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
  return { total_spending: result._sum.total_amount ?? 0, total_tax: result._sum.tax_amount ?? 0 };
};

export const getMonthlyTrends = async () => {
  return prisma.$queryRaw`
    SELECT TO_CHAR(created_at, 'YYYY-MM') AS month,
      COUNT(*) AS invoices_count,
      SUM(total_amount) AS spent
    FROM "Invoice"
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12;
  `;
};
