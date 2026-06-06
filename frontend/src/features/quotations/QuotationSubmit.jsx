// src/features/quotations/QuotationSubmit.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Send } from "lucide-react";
import { MOCK_RFQS } from "../../utils/mockData";

export default function QuotationSubmit() {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const rfq = MOCK_RFQS.find((r) => r._id === rfqId) || MOCK_RFQS[0];

  const [items, setItems] = useState(
    rfq.lineItems.map((li) => ({ ...li, unitPrice: 0, total: 0, deliveryDays: 7 }))
  );
  const [gstPercent, setGstPercent] = useState(18);
  const [notes, setNotes] = useState("");

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const gstAmount = Math.round(subtotal * gstPercent / 100);
  const grandTotal = subtotal + gstAmount;

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: Number(value) || 0 };
    updated[index].total = updated[index].quantity * updated[index].unitPrice;
    setItems(updated);
  };

  const handleSubmit = () => {
    console.log("Quotation submitted:", { rfqId, items, gstPercent, subtotal, gstAmount, grandTotal, notes });
    navigate("/quotations");
  };

  return (
    <div className="page-container max-w-4xl mx-auto">
      <Link to="/quotations" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm">
        <ArrowLeft size={16} /> Back
      </Link>

      <div>
        <h1 className="page-title">Submit Quotation</h1>
        <p className="page-subtitle">RFQ: {rfq.title} — Deadline: {new Date(rfq.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>

      {/* RFQ Summary */}
      <div className="bg-surfaceHighlight border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-textDim uppercase mb-2">RFQ Summary</h3>
        <p className="text-sm text-textMuted">{rfq.lineItems.map(li => `${li.item} × ${li.quantity}`).join(', ')} — Category: {rfq.category}</p>
      </div>

      {/* Quotation Table */}
      <div className="card">
        <h3 className="text-base font-semibold text-white mb-4">Your Quotation</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header">Item</th>
                <th className="table-header w-20">Qty</th>
                <th className="table-header w-32">Unit Price (₹)</th>
                <th className="table-header w-28">Total</th>
                <th className="table-header w-28">Delivery (days)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="table-cell-primary">{item.item}</td>
                  <td className="table-cell">{item.quantity}</td>
                  <td className="py-2 px-3">
                    <input type="number" value={item.unitPrice || ""} onChange={(e) => updateItem(i, "unitPrice", e.target.value)} className="input-field w-full" placeholder="0" />
                  </td>
                  <td className="table-cell font-medium">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3">
                    <input type="number" value={item.deliveryDays} onChange={(e) => updateItem(i, "deliveryDays", e.target.value)} className="input-field w-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tax & Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div>
              <label className="input-label">Tax / GST %</label>
              <input type="number" value={gstPercent} onChange={(e) => setGstPercent(Number(e.target.value))} className="input-field w-32" />
            </div>
            <div>
              <label className="input-label">Notes / Terms</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" className="input-field" placeholder="Payment terms: 30 days net..." />
            </div>
          </div>
          <div className="space-y-3 bg-surfaceHighlight rounded-lg p-4 border border-border self-start">
            <div className="flex justify-between text-sm">
              <span className="text-textMuted">Subtotal</span>
              <span className="text-textMain font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-textMuted">GST ({gstPercent}%)</span>
              <span className="text-textMain">₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-border pt-3">
              <span className="text-white">Grand Total</span>
              <span className="text-primary-400">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6 mt-6 border-t border-border">
          <button onClick={handleSubmit} className="btn-primary inline-flex items-center gap-2"><Send size={16} /> Submit Quotation</button>
          <button className="btn-secondary inline-flex items-center gap-2"><Save size={16} /> Save Draft</button>
        </div>
      </div>
    </div>
  );
}
