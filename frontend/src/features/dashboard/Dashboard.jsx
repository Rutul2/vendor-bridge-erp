// src/features/dashboard/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  ShoppingCart,
  Receipt,
  Plus,
  Users,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import StatsCard from "../../components/StatsCard";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { dashboardService } from "./dashboardService";
import { useAuthStore } from "../../store/authStore";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-surface border border-border rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-textMuted">{label}</p>
        <p className="text-sm font-semibold text-primary-400">
          ₹{(payload[0].value / 1000).toFixed(0)}K
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Only ADMIN and PROCUREMENT_OFFICER can fetch monthly trends
        const canSeeTrends = user?.role === 'ADMIN' || user?.role === 'PROCUREMENT_OFFICER';

        const [summaryData, trendsData] = await Promise.all([
          dashboardService.getSummary(),
          canSeeTrends ? dashboardService.getMonthlyTrends() : Promise.resolve({ data: [] }),
        ]);

        setStats({
          activeRfqs:            summaryData.data?.activeRfqs ?? 0,
          activeRfqsTrend:       summaryData.data?.activeRfqsTrend ?? 0,
          pendingApprovals:      summaryData.data?.pendingApprovals ?? 0,
          pendingApprovalsTrend: summaryData.data?.pendingApprovalsTrend ?? 0,
          posThisMonth:          summaryData.data?.posThisMonth ?? 0,
          posThisMonthTrend:     summaryData.data?.posThisMonthTrend ?? 0,
          monthlyInvoices:       summaryData.data?.monthlyInvoices ?? 0,
          monthlyInvoicesTrend:  summaryData.data?.monthlyInvoicesTrend ?? 0,
        });

        setTrends(trendsData.data || []);
        setPurchaseOrders(summaryData.data?.recentPurchaseOrders || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.role]);


  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="page-container">
        <p className="text-danger-400">{error}</p>
      </div>
    );
  if (!stats) return null;

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back, {user?.name || "User"} — Today's Overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={FileText}
          label="Active RFQs"
          value={stats.activeRfqs}
          trend={stats.activeRfqsTrend}
        />
        <StatsCard
          icon={Clock}
          label="Pending Approvals"
          value={stats.pendingApprovals}
          trend={stats.pendingApprovalsTrend}
        />
        <StatsCard
          icon={ShoppingCart}
          label="POs This Month"
          value={stats.posThisMonth}
          prefix="₹"
          suffix="L"
          trend={stats.posThisMonthTrend}
        />
        <StatsCard
          icon={Receipt}
          label="Monthly Invoices"
          value={stats.monthlyInvoices}
          trend={stats.monthlyInvoicesTrend}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Purchase Orders */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Recent Purchase Orders
            </h2>
            <Link
              to="/purchase-orders"
              className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">PO#</th>
                  <th className="table-header">Vendor</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po) => (
                  <tr
                    key={po.id}
                    className="border-b border-border/50 hover:bg-surfaceHighlight/50 transition-colors"
                  >
                    <td className="table-cell-primary">
                      {po.po_number || `PO-${po.id.slice(0, 8)}`}
                    </td>
                    <td className="table-cell">
                      {po.vendor?.company_name || "Unknown Vendor"}
                    </td>
                    <td className="table-cell">
                      ₹{(po.quotation?.grand_total || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={po.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Spending Trends Chart */}
        {user?.role !== 'VENDOR' && (
          <div className="lg:col-span-2 card">
            <h2 className="text-lg font-semibold text-white mb-4">
            Spending Trends (6 months)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trends} barSize={24}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#71717a", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v / 1000}K`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(99,102,241,0.05)" }}
              />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {user?.role === 'PROCUREMENT_OFFICER' && (
          <Link
            to="/rfqs/create"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} /> New RFQ
          </Link>
        )}
        {user?.role === "ADMIN" && (
          <Link
            to="/vendors"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Users size={16} /> Add Vendor
          </Link>
        )}
        {(user?.role === 'PROCUREMENT_OFFICER' || user?.role === 'ADMIN') && (
          <Link
            to="/invoices"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Receipt size={16} /> View Invoices
          </Link>
        )}
      </div>
    </div>
  );
}
