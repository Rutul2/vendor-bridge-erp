import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Send } from "lucide-react";
import { rfqService } from "../rfqs/rfqService";
import { quotationService } from "./quotationService";
import { useAuthStore } from "../../store/authStore";

export default function QuotationSubmit() {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [rfq, setRfq] = useState(null);
  const [items, setItems] = useState([]);
  const [gstPercent, setGstPercent] = useState(18);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchRfq = async () => {
      try {
        setLoading(true);
        const res = await rfqService.getById(rfqId);
        setRfq(res.data);
        setItems(
          (res.data?.items || []).map((li) => ({
            rfq_item_id: li.id,
            product_name: li.product_name,
            quantity: li.quantity,
            unitPrice: 0,
            total: 0,
            deliveryDays: 7
          }))
        );
      } catch (err) {
        setError("Failed to fetch RFQ details");
      } finally {
        setLoading(false);
      }
    };
    if (rfqId) fetchRfq();
  }, [rfqId]);

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const gstAmount = Math.round((subtotal * gstPercent) / 100);
  const grandTotal = subtotal + gstAmount;

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: Number(value) || 0 };
    updated[index].total = updated[index].quantity * updated[index].unitPrice;
    setItems(updated);
  };

  const handleSubmit = async () => {
    // Client-side validation
    if (!user?.vendor_id) {
      setSubmitError("Your user account is not linked to a Vendor record. Please ask the Admin to link your email to a Vendor profile.");
      return;
    }
    if (items.some(i => i.unitPrice <= 0)) {
      setSubmitError("Please enter a valid unit price (> 0) for all items.");
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError("");
      const payload = {
        rfq_id: rfqId,
        vendor_id: user?.vendor_id,
        total_amount: grandTotal || 1,
        delivery_days: items[0]?.deliveryDays || 7,
        notes: notes,
        items: items.map(i => ({
          product_name: i.product_name || 'Item',
          quantity: i.quantity,
          unit_price: i.unitPrice || 0.01,
          subtotal: Math.max(i.quantity * i.unitPrice, 0.01)
        }))
      };
      await quotationService.create(payload);
      navigate("/quotations");
    } catch (err) {
      console.error("Submit failed", err);
      setSubmitError(err.response?.data?.message || "Failed to submit quotation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-container py-16 text-center text-textMuted">Loading...</div>;
  if (error || !rfq) return <div className="page-container"><p className="text-danger-400">{error || "RFQ not found"}</p></div>;

  const isDeadlinePassed = rfq.deadline && new Date() > new Date(rfq.deadline);

  return (
    <div className="page-container max-w-4xl mx-auto">
      <Link to="/quotations" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm mb-4">
        <ArrowLeft size={16} /> Back
      </Link>

      <div>
        <h1 className="page-title">Submit Quotation</h1>
        <p className="page-subtitle">RFQ: {rfq.title} — Deadline: {new Date(rfq.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>

      {/* Deadline Warning */}
      {isDeadlinePassed && (
        <div className="p-3 bg-warning-500/10 border border-warning-500/20 text-warning-400 text-sm rounded-lg mt-4">
          ⚠ The deadline for this RFQ has passed. Submission may be rejected.
        </div>
      )}

      {/* Submit Error */}
      {submitError && (
        <div className="p-3 bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm rounded-lg mt-4">{submitError}</div>
      )}

      {/* RFQ Summary */}
      <div className="bg-surfaceHighlight border border-border rounded-lg p-4 mt-6">
        <h3 className="text-sm font-semibold text-textDim uppercase mb-2">RFQ Summary</h3>
        <p className="text-sm text-textMuted">{rfq.items?.map(li => `${li.product_name} × ${li.quantity}`).join(', ')}</p>
      </div>

      {/* Quotation Table */}
      <div className="card mt-6">
        <h3 className="text-base font-semibold text-white mb-4">Your Quotation</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="table-header">Item</th>
                <th className="table-header w-20">Qty</th>
                <th className="table-header w-32">Unit Price (₹)</th>
                <th className="table-header w-28 text-right">Total</th>
                <th className="table-header w-28">Delivery (days)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="table-cell-primary">{item.product_name}</td>
                  <td className="table-cell">{item.quantity}</td>
                  <td className="py-2 px-3">
                    <input type="number" value={item.unitPrice || ""} onChange={(e) => updateItem(i, "unitPrice", e.target.value)} className="input-field w-full" placeholder="0" />
                  </td>
                  <td className="table-cell font-medium text-right">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
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
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary inline-flex items-center gap-2">
            <Send size={16} /> {submitting ? "Submitting..." : "Submit Quotation"}
          </button>
        </div>
      </div>
    </div>
  );
}
