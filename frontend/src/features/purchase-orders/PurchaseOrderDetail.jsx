// src/features/purchase-orders/PurchaseOrderDetail.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Receipt, Calendar, Hash } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import { MOCK_PURCHASE_ORDERS } from "../../utils/mockData";

export default function PurchaseOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const po = MOCK_PURCHASE_ORDERS.find((p) => p._id === id);

  if (!po) {
    return (
      <div className="page-container">
        <Link to="/purchase-orders" className="inline-flex items-center gap-2 text-primary-400 text-sm"><ArrowLeft size={16} /> Back</Link>
        <div className="card text-center py-16"><p className="text-textMuted">Purchase Order not found</p></div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-4xl mx-auto">
      <Link to="/purchase-orders" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm">
        <ArrowLeft size={16} /> Back to Purchase Orders
      </Link>

      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white font-mono">{po.poNumber}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-textMuted">
              <span className="flex items-center gap-1.5"><Hash size={14} /> {po.vendorName}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(po.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
          <StatusBadge status={po.status} />
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider mb-3">Line Items</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header">Item</th>
                <th className="table-header">Qty</th>
                <th className="table-header">Unit Price</th>
                <th className="table-header text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {po.items.map((item, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="table-cell-primary">{item.item}</td>
                  <td className="table-cell">{item.quantity}</td>
                  <td className="table-cell">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="table-cell text-right font-medium">₹{item.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-64 space-y-2 bg-surfaceHighlight rounded-lg p-4 border border-border">
            <div className="flex justify-between text-sm"><span className="text-textMuted">Subtotal</span><span className="text-textMain">₹{po.subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-sm"><span className="text-textMuted">GST ({po.gstPercent}%)</span><span className="text-textMain">₹{po.gstAmount.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-base font-bold border-t border-border pt-2"><span className="text-white">Grand Total</span><span className="text-primary-400">₹{po.grandTotal.toLocaleString('en-IN')}</span></div>
          </div>
        </div>

        <div className="flex gap-3 pt-6 mt-6 border-t border-border">
          <button onClick={() => navigate("/invoices")} className="btn-primary inline-flex items-center gap-2">
            <Receipt size={16} /> Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
