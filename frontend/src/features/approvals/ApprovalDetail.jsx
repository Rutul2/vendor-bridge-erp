import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Clock, Star } from "lucide-react";
import StepIndicator from "../../components/StepIndicator";
import { approvalService } from "./approvalService";
import { useAuthStore } from "../../store/authStore";
import { poService } from "../purchase-orders/poService";

export default function ApprovalDetail() {
  const { user } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [approval, setApproval] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchApproval = async () => {
      try {
        setLoading(true);
        const res = await approvalService.getById(id);
        setApproval(res.data);
      } catch (err) {
        setError("Approval not found");
      } finally {
        setLoading(false);
      }
    };
    fetchApproval();
  }, [id]);

  const handleAction = async (action) => {
    try {
      setUpdating(true);
      if (action === 'APPROVED') {
        await approvalService.approve(id, { remarks });
      } else {
        await approvalService.reject(id, { remarks });
      }
      navigate("/approvals");
    } catch (err) {
      console.error("Action failed", err);
      alert("Failed to update approval");
    } finally {
      setUpdating(false);
    }
  };

  const handleGeneratePO = async () => {
    try {
      setUpdating(true);
      const res = await poService.create({
        quotation_id: approval.quotation_id,
        vendor_id: approval.quotation.vendor_id,
        items: approval.quotation.items.map(i => ({
          rfq_item_id: i.rfq_item_id,
          quantity: i.quantity,
          unit_price: i.unit_price,
        }))
      });
      navigate(`/purchase-orders/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate Purchase Order");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="page-container py-16 text-center text-textMuted">Loading...</div>;
  }

  if (error || !approval) {
    return (
      <div className="page-container">
        <Link to="/approvals" className="inline-flex items-center gap-2 text-primary-400 text-sm"><ArrowLeft size={16} /> Back</Link>
        <div className="card text-center py-16"><p className="text-textMuted">{error || "Approval not found"}</p></div>
      </div>
    );
  }

  // Fallback map if backend doesn't provide these arrays
  const steps = approval.steps || ["Vendor Quoted", "Manager Review", "Admin Approval", "PO Issued"];
  const currentStep = approval.status === 'APPROVED' ? 2 : (approval.status === 'PENDING' ? 1 : 0);
  const chain = approval.approvalChain || [
    { name: "Manager", role: "Procurement Manager", status: approval.status === 'APPROVED' ? "Approved" : "Pending", date: approval.created_at }
  ];

  return (
    <div className="page-container max-w-4xl mx-auto">
      <Link to="/approvals" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm">
        <ArrowLeft size={16} /> Back to Approvals
      </Link>

      <div>
        <h1 className="page-title">Approval Workflow</h1>
        <p className="page-subtitle">RFQ: {approval.quotation?.rfq?.title} — Vendor: {approval.quotation?.vendor?.company_name} — ₹{Number(approval.quotation?.total_amount || 0).toLocaleString('en-IN')}</p>
      </div>

      {/* Step Indicator */}
      <div className="card">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Chain */}
        <div className="card">
          <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider mb-4">Approval Chain</h3>
          <div className="space-y-4">
            {chain.map((approver, i) => (
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
            <div className="flex justify-between text-sm"><span className="text-textMuted">Vendor:</span><span className="text-textMain font-medium">{approval.quotation?.vendor?.company_name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-textMuted">Total:</span><span className="text-textMain font-medium">₹{Number(approval.quotation?.total_amount || 0).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-sm"><span className="text-textMuted">Delivery:</span><span className="text-textMain">{approval.quotation?.items?.[0]?.delivery_time || "N/A"}</span></div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-textMuted">Rating:</span>
              <div className="flex items-center gap-1">
                <span className="text-textMain">{approval.quotation?.vendor?.rating || 0}/5</span>
                <Star size={14} className="text-warning-400 fill-warning-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Action */}
      {approval.status === 'PENDING' && user?.role === 'MANAGER' && (
        <div className="card">
          <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider mb-3">Approval Remarks</h3>
          <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows="3" className="input-field mb-4" placeholder="Add your comments or conditions..." />
          <div className="flex gap-3">
            <button onClick={() => handleAction('APPROVED')} disabled={updating} className="btn-success inline-flex items-center gap-2 px-8">
              <CheckCircle size={16} /> Approve
            </button>
            <button onClick={() => handleAction('REJECTED')} disabled={updating} className="btn-danger inline-flex items-center gap-2 px-8">
              Reject
            </button>
          </div>
        </div>
      )}

      {/* PO Generation Action for Procurement Officer */}
      {approval.status === 'APPROVED' && user?.role === 'PROCUREMENT_OFFICER' && (
        <div className="card mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Purchase Order</h3>
              <p className="text-xs text-textMuted mt-1">This quotation is approved. You can now generate a Purchase Order.</p>
            </div>
            <button onClick={handleGeneratePO} disabled={updating} className="btn-primary whitespace-nowrap">
              {updating ? "Generating..." : "Generate Purchase Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
