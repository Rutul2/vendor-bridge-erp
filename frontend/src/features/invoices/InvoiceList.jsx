// src/features/invoices/InvoiceList.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Receipt } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { MOCK_INVOICES } from "../../utils/mockData";

export default function InvoiceList() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_INVOICES.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.vendorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="page-subtitle">Manage and track procurement invoices</p>
        </div>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by invoice number or vendor..." />

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="table-header">Invoice #</th>
              <th className="table-header">PO #</th>
              <th className="table-header">Vendor</th>
              <th className="table-header">Amount</th>
              <th className="table-header">Due Date</th>
              <th className="table-header">Status</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7"><EmptyState icon={Receipt} title="No invoices found" /></td></tr>
            ) : (
              filtered.map((inv) => (
                <tr key={inv._id} className="border-b border-border/50 hover:bg-surfaceHighlight/50 transition-colors">
                  <td className="table-cell-primary font-mono">{inv.invoiceNumber}</td>
                  <td className="table-cell font-mono text-xs">{inv.poNumber}</td>
                  <td className="table-cell">{inv.vendorName}</td>
                  <td className="table-cell font-medium">₹{inv.grandTotal.toLocaleString('en-IN')}</td>
                  <td className="table-cell">{new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="table-cell"><StatusBadge status={inv.status} /></td>
                  <td className="table-cell text-right">
                    <Link to={`/invoices/${inv._id}`} className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium">
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
