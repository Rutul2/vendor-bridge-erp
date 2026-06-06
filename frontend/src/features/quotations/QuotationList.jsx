import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, MessageSquareQuote } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { quotationService } from "./quotationService";

export default function QuotationList() {
  const [search, setSearch] = useState("");
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setLoading(true);
        const res = await quotationService.getAll({ search });
        setQuotations(res.data?.items || []);
      } catch (error) {
        console.error("Failed to fetch quotations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, [search]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quotations</h1>
          <p className="page-subtitle">View and manage vendor quotations</p>
        </div>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by vendor or RFQ..." />

      <div className="card p-0 overflow-hidden mt-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="table-header">Vendor</th>
              <th className="table-header">RFQ</th>
              <th className="table-header">Grand Total</th>
              <th className="table-header">Delivery</th>
              <th className="table-header">Status</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-8 text-textMuted">Loading...</td></tr>
            ) : quotations.length === 0 ? (
              <tr><td colSpan="6"><EmptyState icon={MessageSquareQuote} title="No quotations found" /></td></tr>
            ) : (
              quotations.map((q) => (
                <tr key={q.id} className="border-b border-border/50 hover:bg-surfaceHighlight/50 transition-colors">
                  <td className="table-cell-primary">{q.vendor?.company_name}</td>
                  <td className="table-cell">{q.rfq?.title}</td>
                  <td className="table-cell font-medium">₹{q.grand_total?.toLocaleString('en-IN') || 0}</td>
                  <td className="table-cell">{q.delivery_days} days</td>
                  <td className="table-cell"><StatusBadge status={q.status} /></td>
                  <td className="table-cell text-right">
                    <Link to={`/quotations/${q.id}`} className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium">
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
