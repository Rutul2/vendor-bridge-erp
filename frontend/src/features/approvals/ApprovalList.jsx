// src/features/approvals/ApprovalList.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, CheckCircle2 } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { MOCK_APPROVALS } from "../../utils/mockData";

export default function ApprovalList() {
  const [filter, setFilter] = useState("All");
  const tabs = ["All", "Pending", "Approved"];

  const filtered = MOCK_APPROVALS.filter((a) => filter === "All" || a.status === filter);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Approvals</h1>
          <p className="page-subtitle">Review and manage procurement approvals</p>
        </div>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${filter === t ? "bg-primary-500/10 text-primary-400 border-primary-500/20" : "text-textMuted border-border hover:bg-surfaceHighlight"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="table-header">RFQ</th>
              <th className="table-header">Vendor</th>
              <th className="table-header">Amount</th>
              <th className="table-header">Step</th>
              <th className="table-header">Status</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6"><EmptyState icon={CheckCircle2} title="No approvals found" /></td></tr>
            ) : (
              filtered.map((a) => (
                <tr key={a._id} className="border-b border-border/50 hover:bg-surfaceHighlight/50 transition-colors">
                  <td className="table-cell-primary">{a.rfqTitle}</td>
                  <td className="table-cell">{a.vendorName}</td>
                  <td className="table-cell font-medium">₹{a.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="table-cell">{a.steps[a.currentStep - 1]?.label}</td>
                  <td className="table-cell"><StatusBadge status={a.status} /></td>
                  <td className="table-cell text-right">
                    <Link to={`/approvals/${a._id}`} className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium">
                      <Eye size={14} /> Review
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
