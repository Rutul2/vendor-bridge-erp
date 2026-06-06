import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Receipt, Calendar, Hash } from "lucide-react";
import { useState, useEffect } from "react";
import StatusBadge from "../../components/StatusBadge";
import { poService } from "./poService";

export default function PurchaseOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPo = async () => {
      try {
        setLoading(true);
        const res = await poService.getById(id);
        setPo(res.data);
      } catch (err) {
        setError("Purchase Order not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPo();
  }, [id]);

  if (loading) {
    return <div className="page-container py-16 text-center text-textMuted">Loading...</div>;
  }

  if (!po) {
    return (
      <div className="page-container">
        <Link to="/purchase-orders" className="inline-flex items-center gap-2 text-primary-400 text-sm"><ArrowLeft size={16} /> Back</Link>
        <div className="card text-center py-16"><p className="text-textMuted">{error}</p></div>
      </div>
    );
  }

  const items = po.quotation?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  const gstPercent = 18;
  const gstAmount = (subtotal * gstPercent) / 100;
  const grandTotal = po.quotation?.grand_total || (subtotal + gstAmount);

  return (
    <div className="page-container max-w-4xl mx-auto">
      <Link to="/purchase-orders" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm mb-4">
        <ArrowLeft size={16} /> Back to Purchase Orders
      </Link>

      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white font-mono">{po.po_number}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-textMuted">
              <span className="flex items-center gap-1.5"><Hash size={14} /> {po.vendor?.company_name}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(po.created_at).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
          <StatusBadge status={po.status} />
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider mb-3">Line Items</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header text-left">Item</th>
                <th className="table-header text-left">Qty</th>
                <th className="table-header text-left">Unit Price</th>
                <th className="table-header text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="table-cell-primary">{item.rfq_item?.item_name || "Item"}</td>
                  <td className="table-cell">{item.quantity}</td>
                  <td className="table-cell">₹{item.unit_price?.toLocaleString('en-IN') || 0}</td>
                  <td className="table-cell text-right font-medium">₹{(item.quantity * item.unit_price).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-64 space-y-2 bg-surfaceHighlight rounded-lg p-4 border border-border">
            <div className="flex justify-between text-sm"><span className="text-textMuted">Subtotal</span><span className="text-textMain">₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-sm"><span className="text-textMuted">GST ({gstPercent}%)</span><span className="text-textMain">₹{gstAmount.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-base font-bold border-t border-border pt-2"><span className="text-white">Grand Total</span><span className="text-primary-400">₹{grandTotal.toLocaleString('en-IN')}</span></div>
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
