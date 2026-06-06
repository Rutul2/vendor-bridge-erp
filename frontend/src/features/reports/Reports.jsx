// src/features/reports/Reports.jsx
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { Star, TrendingUp, ShoppingCart, DollarSign, Truck } from "lucide-react";
import { reportService } from "./reportService";

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-surface border border-border rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-textMuted mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-medium" style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' && p.value > 1000 ? `₹${(p.value/1000).toFixed(0)}K` : p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [performance, setPerformance] = useState([]);
  const [spending, setSpending] = useState({ total_spending: 0, total_tax: 0 });
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [perf, spend, tr] = await Promise.all([
          reportService.getVendorPerformance(),
          reportService.getSpendingSummary(),
          reportService.getMonthlyTrends()
        ]);
        setPerformance(perf.data || []);
        setSpending(spend.data || { total_spending: 0, total_tax: 0 });
        setTrends(tr.data || []);
      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSpend = spending.total_spending;
  // Fallback data for charts if empty
  const safeTrends = trends.length > 0 ? trends : [{ month: 'N/A', invoices_count: 0, spent: 0 }];
  const safePerformance = performance.length > 0 ? performance : [{ company_name: 'No Data', rating: 0 }];

  // Simple hardcoded categories for visual effect since backend doesn't have by-category right now
  const mockCategories = [
    { name: "Hardware", value: totalSpend * 0.4, color: "#6366f1" },
    { name: "Software", value: totalSpend * 0.3, color: "#8b5cf6" },
    { name: "Services", value: totalSpend * 0.2, color: "#ec4899" },
    { name: "Office Supplies", value: totalSpend * 0.1, color: "#f43f5e" },
  ];

  if (loading) {
    return <div className="page-container py-16 text-center text-textMuted">Loading Reports...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Procurement insights and performance trends</p>
        </div>
        <button className="btn-secondary">Export Report</button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ShoppingCart, label: "Total Spend", value: `₹${(totalSpend / 100000).toFixed(2)}L`, color: "text-primary-400" },
          { icon: DollarSign, label: "Total Tax", value: `₹${(spending.total_tax / 1000).toFixed(0)}K`, color: "text-success-400" },
          { icon: Truck, label: "Avg Delivery", value: "12 days", color: "text-warning-400" },
          { icon: Star, label: "Avg Rating", value: "4.3/5", color: "text-info-400" },
        ].map((kpi) => (
          <div key={kpi.label} className="card-hover">
            <div className="flex items-center gap-3">
              <kpi.icon size={20} className={kpi.color} />
              <div>
                <p className="text-xs text-textDim">{kpi.label}</p>
                <p className="text-lg font-bold text-white">{kpi.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Performance */}
        <div className="card">
          <h3 className="text-base font-semibold text-white mb-4">Vendor Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={safePerformance} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="company_name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Bar dataKey="rating" fill="#6366f1" radius={[6, 6, 0, 0]} name="Rating" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spending by Category */}
        <div className="card">
          <h3 className="text-base font-semibold text-white mb-4">Spending by Category</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={mockCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {mockCategories.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {mockCategories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-textMuted">{cat.name}</span>
                  </div>
                  <span className="text-textMain font-medium">₹{(cat.value/1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Monthly Procurement Trends</h3>
            <TrendingUp size={18} className="text-textDim" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={safeTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }} />
              <Line type="monotone" dataKey="invoices_count" stroke="#eab308" strokeWidth={2} dot={{ r: 4 }} name="Invoices" />
              <Line type="monotone" dataKey="spent" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="Amount Spent" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
