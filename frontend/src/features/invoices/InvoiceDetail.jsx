import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Download, Printer, Mail, CheckCircle } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import { invoiceService } from "./invoiceService";

export default function InvoiceDetail() {
  const { id } = useParams();
  const [inv, setInv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await invoiceService.getById(id);
        setInv(res.data);
      } catch (err) {
        setError("Invoice not found");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  if (loading) {
    return <div className="page-container py-16 text-center text-textMuted">Loading...</div>;
  }

  if (!inv) {
    return (
      <div className="page-container">
        <Link to="/invoices" className="inline-flex items-center gap-2 text-primary-400 text-sm"><ArrowLeft size={16} /> Back</Link>
        <div className="card text-center py-16"><p className="text-textMuted">{error}</p></div>
      </div>
    );
  }

  const handlePrint = () => window.print();
  const handleEmail = () => { setEmailSent(true); setTimeout(() => { setEmailModal(false); setEmailSent(false); }, 2000); };

  const items = inv.po?.quotation?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  const gstPercent = 18;
  const gstAmount = (subtotal * gstPercent) / 100;
  const grandTotal = inv.po?.quotation?.grand_total || (subtotal + gstAmount);

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="no-print">
        <Link to="/invoices" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm">
          <ArrowLeft size={16} /> Back to Invoices
        </Link>
      </div>

      {/* Action buttons */}
      <div className="no-print flex gap-3 flex-wrap">
        <button onClick={handlePrint} className="btn-secondary inline-flex items-center gap-2"><Printer size={16} /> Print Invoice</button>
        <button className="btn-secondary inline-flex items-center gap-2"><Download size={16} /> Download PDF</button>
        <button onClick={() => setEmailModal(true)} className="btn-primary inline-flex items-center gap-2"><Mail size={16} /> Send via Email</button>
      </div>

      {/* Invoice Document */}
      <div className="bg-white text-gray-900 rounded-xl p-8 shadow-2xl print:shadow-none print:rounded-none">
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">VendorBridge</h1>
            <p className="text-sm text-gray-500 mt-1">Procurement & Vendor Management ERP</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900">INVOICE</h2>
            <p className="text-sm text-gray-500 mt-1 font-mono">{inv.invoice_number}</p>
            <StatusBadge status={inv.status} className="mt-2" />
          </div>
        </div>

        {/* Dates & Vendor Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
            <p className="text-sm font-semibold text-gray-900">{inv.vendor?.company_name}</p>
            <p className="text-sm text-gray-600 mt-1">{inv.vendor?.address}</p>
            <p className="text-sm text-gray-600 mt-1">GST: <span className="font-mono">{inv.vendor?.gst_number}</span></p>
          </div>
          <div className="text-right">
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Invoice Date:</span> <span className="font-medium">{new Date(inv.created_at).toLocaleDateString('en-IN')}</span></p>
              <p><span className="text-gray-500">Due Date:</span> <span className="font-medium">{new Date(inv.due_date).toLocaleDateString('en-IN')}</span></p>
              <p><span className="text-gray-500">PO Reference:</span> <span className="font-mono font-medium">{inv.po?.po_number}</span></p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">Item</th>
              <th className="text-center py-3 text-xs font-semibold text-gray-500 uppercase">Qty</th>
              <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase">Unit Price</th>
              <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 text-sm font-medium text-gray-900">{item.rfq_item?.item_name || "Item"}</td>
                <td className="py-3 text-sm text-gray-600 text-center">{item.quantity}</td>
                <td className="py-3 text-sm text-gray-600 text-right">₹{item.unit_price?.toLocaleString('en-IN') || 0}</td>
                <td className="py-3 text-sm font-medium text-gray-900 text-right">₹{(item.quantity * item.unit_price).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">GST ({gstPercent}%)</span><span className="text-gray-900">₹{gstAmount.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-lg font-bold border-t-2 border-gray-200 pt-2 mt-2">
              <span className="text-gray-900">Grand Total</span>
              <span className="text-indigo-600">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">Generated by VendorBridge ERP • This is a computer-generated invoice</p>
        </div>
      </div>

      {/* Email Modal */}
      <Modal isOpen={emailModal} onClose={() => setEmailModal(false)} title="Send Invoice via Email" size="sm">
        {emailSent ? (
          <div className="text-center py-6">
            <CheckCircle size={48} className="mx-auto text-success-400 mb-3" />
            <p className="text-lg font-semibold text-white">Email Sent!</p>
            <p className="text-sm text-textMuted mt-1">Invoice has been sent successfully.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="input-label">Recipient Email</label>
              <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="input-field" placeholder="vendor@company.com" />
            </div>
            <div className="bg-surfaceHighlight rounded-lg p-3 border border-border">
              <p className="text-sm text-textMuted">Sending: <span className="text-textMain font-medium">{inv.invoice_number}</span></p>
              <p className="text-sm text-textMuted">Amount: <span className="text-textMain">₹{grandTotal.toLocaleString('en-IN')}</span></p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEmailModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleEmail} className="btn-primary inline-flex items-center gap-2"><Mail size={16} /> Send</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
