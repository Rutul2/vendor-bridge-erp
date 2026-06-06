// src/features/reports/Reports.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { MOCK_VENDOR_PERFORMANCE, MOCK_SPENDING_BY_CATEGORY, MOCK_MONTHLY_TRENDS } from "../../utils/mockData";
import { Star, TrendingUp, ShoppingCart, DollarSign, Truck } from "lucide-react";

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
  const totalSpend = MOCK_SPENDING_BY_CATEGORY.reduce((s, c) => s + c.value, 0);

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
          { icon: ShoppingCart, label: "Total POs", value: "42", color: "text-primary-400" },
          { icon: DollarSign, label: "Total Spend", value: "₹13.2L", color: "text-success-400" },
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
            <BarChart data={MOCK_VENDOR_PERFORMANCE} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
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
                <Pie data={MOCK_SPENDING_BY_CATEGORY} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {MOCK_SPENDING_BY_CATEGORY.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {MOCK_SPENDING_BY_CATEGORY.map((cat) => (
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
            <LineChart data={MOCK_MONTHLY_TRENDS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }} />
              <Line type="monotone" dataKey="rfqs" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="RFQs" />
              <Line type="monotone" dataKey="pos" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="POs" />
              <Line type="monotone" dataKey="invoices" stroke="#eab308" strokeWidth={2} dot={{ r: 4 }} name="Invoices" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
