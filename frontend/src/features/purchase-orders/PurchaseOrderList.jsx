// src/features/purchase-orders/PurchaseOrderList.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, ShoppingCart } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { MOCK_PURCHASE_ORDERS } from "../../utils/mockData";

export default function PurchaseOrderList() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_PURCHASE_ORDERS.filter((po) =>
    po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
    po.vendorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchase Orders</h1>
          <p className="page-subtitle">Track and manage purchase orders</p>
        </div>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by PO number or vendor..." />

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="table-header">PO Number</th>
              <th className="table-header">Vendor</th>
              <th className="table-header">Amount</th>
              <th className="table-header">Delivery Date</th>
              <th className="table-header">Status</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6"><EmptyState icon={ShoppingCart} title="No purchase orders found" /></td></tr>
            ) : (
              filtered.map((po) => (
                <tr key={po._id} className="border-b border-border/50 hover:bg-surfaceHighlight/50 transition-colors">
                  <td className="table-cell-primary font-mono">{po.poNumber}</td>
                  <td className="table-cell">{po.vendorName}</td>
                  <td className="table-cell font-medium">₹{po.grandTotal.toLocaleString('en-IN')}</td>
                  <td className="table-cell">{new Date(po.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="table-cell"><StatusBadge status={po.status} /></td>
                  <td className="table-cell text-right">
                    <Link to={`/purchase-orders/${po._id}`} className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium">
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
