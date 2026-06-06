// src/features/approvals/ApprovalDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, CheckCircle, Clock, Star } from "lucide-react";
import StepIndicator from "../../components/StepIndicator";
import { MOCK_APPROVALS } from "../../utils/mockData";

export default function ApprovalDetail() {
  const { id } = useParams();
  const approval = MOCK_APPROVALS.find((a) => a._id === id);
  const [remarks, setRemarks] = useState("");

  if (!approval) {
    return (
      <div className="page-container">
        <Link to="/approvals" className="inline-flex items-center gap-2 text-primary-400 text-sm"><ArrowLeft size={16} /> Back</Link>
        <div className="card text-center py-16"><p className="text-textMuted">Approval not found</p></div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-4xl mx-auto">
      <Link to="/approvals" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm">
        <ArrowLeft size={16} /> Back to Approvals
      </Link>

      <div>
        <h1 className="page-title">Approval Workflow</h1>
        <p className="page-subtitle">RFQ: {approval.rfqTitle} — Vendor: {approval.vendorName} — ₹{approval.totalAmount.toLocaleString('en-IN')}</p>
      </div>

      {/* Step Indicator */}
      <div className="card">
        <StepIndicator steps={approval.steps} currentStep={approval.currentStep} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Chain */}
        <div className="card">
          <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider mb-4">Approval Chain</h3>
          <div className="space-y-4">
            {approval.approvalChain.map((approver, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  approver.status === 'Approved' ? 'bg-success-500/10 border border-success-500/20' : 'bg-warning-500/10 border border-warning-500/20'
                }`}>
                  {approver.status === 'Approved' ? <CheckCircle size={16} className="text-success-400" /> : <Clock size={16} className="text-warning-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-textMain">{approver.name} <span className="text-textDim font-normal">({approver.role})</span></p>
                  <p className={`text-xs mt-0.5 ${approver.status === 'Approved' ? 'text-success-400' : 'text-warning-400'}`}>
                    {approver.status === 'Approved'
                      ? `Approved on ${new Date(approver.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${new Date(approver.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
                      : `Awaiting — Assigned ${new Date(approver.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quotation Summary */}
        <div className="card">
          <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider mb-4">Quotation Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-textMuted">Vendor:</span><span className="text-textMain font-medium">{approval.vendorName}</span></div>
            <div className="flex justify-between text-sm"><span className="text-textMuted">Total:</span><span className="text-textMain font-medium">₹{approval.totalAmount.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-sm"><span className="text-textMuted">Delivery:</span><span className="text-textMain">{approval.deliveryDays} days</span></div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-textMuted">Rating:</span>
              <div className="flex items-center gap-1">
                <span className="text-textMain">{approval.vendorRating}/5</span>
                <Star size={14} className="text-warning-400 fill-warning-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Action */}
      {approval.status === 'Pending' && (
        <div className="card">
          <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider mb-3">Approval Remarks</h3>
          <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows="3" className="input-field mb-4" placeholder="Add your comments or conditions..." />
          <div className="flex gap-3">
            <button className="btn-success inline-flex items-center gap-2 px-8">
              <CheckCircle size={16} /> Approve
            </button>
            <button className="btn-danger inline-flex items-center gap-2 px-8">
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
