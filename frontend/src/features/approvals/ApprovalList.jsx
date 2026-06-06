// src/features/approvals/ApprovalList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, CheckCircle2 } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import { approvalService } from "./approvalService";

export default function ApprovalList() {
  const [filter, setFilter] = useState("All");
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tabs = ["All", "APPROVED", "REJECTED"];

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        setLoading(true);
        const response = await approvalService.getAll();
        setApprovals(response.data || []);
      } catch (err) {
        console.error("Failed to fetch approvals:", err);
        setError("Failed to load approvals");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const filtered =
    filter === "All" ? approvals : approvals.filter((a) => a.status === filter);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="page-container">
        <p className="text-danger-400">{error}</p>
      </div>
    );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Approvals</h1>
          <p className="page-subtitle">
            Review and manage procurement approvals
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${filter === t ? "bg-primary-500/10 text-primary-400 border-primary-500/20" : "text-textMuted border-border hover:bg-surfaceHighlight"}`}
          >
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
              <tr>
                <td colSpan="6">
                  <EmptyState icon={CheckCircle2} title="No approvals found" />
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-border/50 hover:bg-surfaceHighlight/50 transition-colors"
                >
                  <td className="table-cell-primary">
                    {a.quotation?.rfq?.title || "N/A"}
                  </td>
                  <td className="table-cell">
                    {a.quotation?.vendor?.company_name || "N/A"}
                  </td>
                  <td className="table-cell font-medium">
                    ₹{(a.quotation?.total_amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="table-cell">{a.status}</td>
                  <td className="table-cell">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="table-cell text-right">
                    <Link
                      to={`/approvals/${a.id}`}
                      className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium"
                    >
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
