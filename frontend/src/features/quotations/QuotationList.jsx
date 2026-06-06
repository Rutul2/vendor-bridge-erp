// src/features/quotations/QuotationList.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, MessageSquareQuote } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { MOCK_QUOTATIONS } from "../../utils/mockData";

export default function QuotationList() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_QUOTATIONS.filter((q) =>
    q.vendorName.toLowerCase().includes(search.toLowerCase()) ||
    q.rfqTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quotations</h1>
          <p className="page-subtitle">View and manage vendor quotations</p>
        </div>
        <Link to="/quotations/compare/rfq1" className="btn-secondary inline-flex items-center gap-2">
          Compare Quotations
        </Link>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by vendor or RFQ..." />

      <div className="card p-0 overflow-hidden">
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
            {filtered.length === 0 ? (
              <tr><td colSpan="6"><EmptyState icon={MessageSquareQuote} title="No quotations found" /></td></tr>
            ) : (
              filtered.map((q) => (
                <tr key={q._id} className="border-b border-border/50 hover:bg-surfaceHighlight/50 transition-colors">
                  <td className="table-cell-primary">{q.vendorName}</td>
                  <td className="table-cell">{q.rfqTitle}</td>
                  <td className="table-cell font-medium">₹{q.grandTotal.toLocaleString('en-IN')}</td>
                  <td className="table-cell">{q.deliveryDays} days</td>
                  <td className="table-cell"><StatusBadge status={q.status} /></td>
                  <td className="table-cell text-right">
                    <Link to={`/quotations/${q._id}`} className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium">
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
