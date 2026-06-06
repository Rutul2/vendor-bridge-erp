// src/features/quotations/QuotationComparison.jsx
import { Link } from "react-router-dom";
import { ArrowLeft, Star, CheckCircle } from "lucide-react";
import { MOCK_QUOTATIONS, MOCK_RFQS } from "../../utils/mockData";

export default function QuotationComparison() {
  // Compare quotations for rfq1 (Office Furniture)
  const rfq = MOCK_RFQS[0];
  const quotations = MOCK_QUOTATIONS.filter((q) => q.rfqId === "rfq1");
  const lowestIdx = quotations.reduce((minI, q, i, arr) => q.grandTotal < arr[minI].grandTotal ? i : minI, 0);

  const criteria = [
    { label: "Grand Total", key: "grandTotal", format: (v) => `₹${v.toLocaleString('en-IN')}` },
    { label: "GST %", key: "gstPercent", format: (v) => `${v}%` },
    { label: "Delivery (days)", key: "deliveryDays", format: (v) => v },
    { label: "Vendor Rating", key: "rating", format: (v) => `${v}/5` },
    { label: "Payment Terms", key: "paymentTerms", format: (v) => v },
  ];

  return (
    <div className="page-container">
      <Link to="/quotations" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm">
        <ArrowLeft size={16} /> Back
      </Link>

      <div>
        <h1 className="page-title">Quotation Comparison</h1>
        <p className="page-subtitle">RFQ: {rfq.title} — {quotations.length} quotations received</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="table-header min-w-[140px]">Criteria</th>
                {quotations.map((q, i) => (
                  <th key={q._id} className={`table-header min-w-[160px] text-center ${i === lowestIdx ? 'bg-success-500/10' : ''}`}>
                    <div className="flex flex-col items-center gap-1">
                      <span className={`font-semibold ${i === lowestIdx ? 'text-success-400' : 'text-textMain'}`}>
                        {q.vendorName}
                      </span>
                      {i === lowestIdx && <span className="text-[10px] text-success-400 font-medium">(Lowest)</span>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => (
                <tr key={c.key} className="border-b border-border/50">
                  <td className="table-cell font-medium text-textMain">{c.label}</td>
                  {quotations.map((q, i) => (
                    <td key={q._id} className={`table-cell text-center ${i === lowestIdx ? 'bg-success-500/5' : ''}`}>
                      <span className={i === lowestIdx && c.key === 'grandTotal' ? 'text-success-400 font-bold' : ''}>
                        {c.format(q[c.key])}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
              {/* Rating row with stars */}
              <tr className="border-b border-border/50">
                <td className="table-cell font-medium text-textMain">Rating Visual</td>
                {quotations.map((q, i) => (
                  <td key={q._id} className={`table-cell text-center ${i === lowestIdx ? 'bg-success-500/5' : ''}`}>
                    <div className="flex items-center justify-center gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={14} className={s <= Math.floor(q.rating) ? 'text-warning-400 fill-warning-400' : 'text-textDim'} />
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action row */}
        <div className="flex border-t border-border">
          <div className="table-cell min-w-[140px]" />
          {quotations.map((q, i) => (
            <div key={q._id} className={`flex-1 p-4 text-center ${i === lowestIdx ? 'bg-success-500/5' : ''}`}>
              <button className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                i === lowestIdx ? 'btn-success' : 'btn-secondary'
              }`}>
                <CheckCircle size={14} />
                {i === lowestIdx ? 'Select & Approve' : 'Select'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-textDim italic text-center">
        Green = lowest price. Selecting a vendor initiates the approval workflow.
      </p>
    </div>
  );
}
