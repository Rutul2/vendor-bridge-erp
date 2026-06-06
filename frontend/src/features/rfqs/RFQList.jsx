import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, FileText } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { rfqService } from "./rfqService";
import { useAuthStore } from "../../store/authStore";

export default function RFQList() {
  const { user } = useAuthStore();
  const [rfqs, setRfqs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  
  const statuses = ["All", "OPEN", "DRAFT", "CLOSED"];

  useEffect(() => {
    const fetchRfqs = async () => {
      try {
        setLoading(true);
        const res = await rfqService.getAll({ 
          search, 
          status: statusFilter !== "All" ? statusFilter : undefined 
        });
        setRfqs(res.data?.items || []);
      } catch (error) {
        console.error("Failed to fetch RFQs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRfqs();
  }, [search, statusFilter]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Request for Quotations</h1>
          <p className="page-subtitle">Manage and track procurement RFQs</p>
        </div>
        {user?.role === 'PROCUREMENT_OFFICER' && (
          <Link to="/rfqs/create" className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Create RFQ
          </Link>
        )}
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

      <div className="card p-0 overflow-hidden mt-6">
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
            {loading ? (
              <tr><td colSpan="6" className="text-center py-8 text-textMuted">Loading...</td></tr>
            ) : rfqs.length === 0 ? (
              <tr><td colSpan="6"><EmptyState icon={FileText} title="No RFQs found" /></td></tr>
            ) : (
              rfqs.map((rfq) => (
                <tr key={rfq.id} className="border-b border-border/50 hover:bg-surfaceHighlight/50 transition-colors">
                  <td className="table-cell-primary">{rfq.title}</td>
                  <td className="table-cell">{rfq.category}</td>
                  <td className="table-cell">{new Date(rfq.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="table-cell">{rfq.quotations?.length || 0} received</td>
                  <td className="table-cell"><StatusBadge status={rfq.status} /></td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link to={`/rfqs/${rfq.id}`} className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium">
                        <Eye size={14} /> View
                      </Link>
                      {user?.role === 'VENDOR' && rfq.status !== 'CLOSED' && (
                        <Link to={`/quotations/submit/${rfq.id}`} className="inline-flex items-center gap-1.5 text-success-400 hover:text-success-300 text-sm font-medium">
                          <FileText size={14} /> Submit
                        </Link>
                      )}
                    </div>
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
