// src/features/rfqs/RFQList.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, FileText } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { MOCK_RFQS } from "../../utils/mockData";

export default function RFQList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const statuses = ["All", "Open", "Draft", "Closed"];

  const filtered = MOCK_RFQS.filter((rfq) => {
    const matchesSearch = rfq.title.toLowerCase().includes(search.toLowerCase()) || rfq.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || rfq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Request for Quotations</h1>
          <p className="page-subtitle">Manage and track procurement RFQs</p>
        </div>
        <Link to="/rfqs/create" className="btn-primary inline-flex items-center gap-2">
          <Plus size={16} /> Create RFQ
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar value={search} onChange={setSearch} placeholder="Search RFQs..." />
        <div className="flex gap-2">
          {statuses.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${statusFilter === s ? "bg-primary-500/10 text-primary-400 border-primary-500/20" : "text-textMuted border-border hover:bg-surfaceHighlight"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="table-header">Title</th>
              <th className="table-header">Category</th>
              <th className="table-header">Deadline</th>
              <th className="table-header">Quotations</th>
              <th className="table-header">Status</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6"><EmptyState icon={FileText} title="No RFQs found" /></td></tr>
            ) : (
              filtered.map((rfq) => (
                <tr key={rfq._id} className="border-b border-border/50 hover:bg-surfaceHighlight/50 transition-colors">
                  <td className="table-cell-primary">{rfq.title}</td>
                  <td className="table-cell">{rfq.category}</td>
                  <td className="table-cell">{new Date(rfq.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="table-cell">{rfq.quotationsReceived} received</td>
                  <td className="table-cell"><StatusBadge status={rfq.status} /></td>
                  <td className="table-cell text-right">
                    <Link to={`/rfqs/${rfq._id}`} className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium">
                      <Eye size={14} /> View
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
