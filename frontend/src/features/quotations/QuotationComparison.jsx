import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, CheckCircle } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { quotationService } from "./quotationService";
import { rfqService } from "../rfqs/rfqService";
import { userService } from "../users/userService";
import { approvalService } from "../approvals/approvalService";

export default function QuotationComparison() {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const [rfq, setRfq] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const rfqData = await rfqService.getById(rfqId);
        setRfq(rfqData.data);

        const quotationsData = await quotationService.getAll({ rfq_id: rfqId });
        setQuotations(quotationsData.data || []);

        const usersData = await userService.getAll({ role: 'MANAGER' });
        setManagers(usersData.data || []);
        if (usersData.data?.length > 0) {
          setSelectedManager(usersData.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load quotation comparison");
      } finally {
        setLoading(false);
      }
    };

    if (rfqId) {
      fetchData();
    }
  }, [rfqId]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="page-container">
        <p className="text-danger-400">{error}</p>
      </div>
    );
  if (!rfq) return null;

  const lowestIdx = quotations.reduce(
    (minI, q, i, arr) => (q.total_amount < arr[minI].total_amount ? i : minI),
    0,
  );

  const handleApprove = async (quotationId) => {
    if (!selectedManager) return alert("Please select a manager for approval");
    try {
      setSubmitting(true);
      await approvalService.create({
        quotation_id: quotationId,
        manager_id: selectedManager,
      });
      navigate("/rfqs");
    } catch (err) {
      console.error(err);
      alert("Failed to send for approval");
    } finally {
      setSubmitting(false);
    }
  };

  const criteria = [
    {
      label: "Grand Total",
      key: "total_amount",
      format: (v) => `₹${v.toLocaleString("en-IN")}`,
    },
    { label: "Delivery (days)", key: "delivery_days", format: (v) => v },
    {
      label: "Vendor Rating",
      key: "vendor.rating",
      format: (v) => `${v || 0}/5`,
    },
  ];

  return (
    <div className="page-container">
      <Link
        to="/quotations"
        className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      <div>
        <h1 className="page-title">Quotation Comparison</h1>
        <p className="page-subtitle">
          RFQ: {rfq.title} — {quotations.length} quotations received
        </p>
      </div>

      <div className="card mb-6">
        <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider mb-3">Approval Workflow Settings</h3>
        <label className="input-label">Select Manager for Approval</label>
        <select value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)} className="input-field max-w-md">
          {managers.map(m => (
            <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
          ))}
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="table-header min-w-[140px]">Criteria</th>
                {quotations.map((q, i) => (
                  <th
                    key={q.id}
                    className={`table-header min-w-[160px] text-center ${i === lowestIdx ? "bg-success-500/10" : ""}`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`font-semibold ${i === lowestIdx ? "text-success-400" : "text-textMain"}`}
                      >
                        {q.vendor?.company_name}
                      </span>
                      {i === lowestIdx && (
                        <span className="text-[10px] text-success-400 font-medium">
                          (Lowest)
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => (
                <tr key={c.key} className="border-b border-border/50">
                  <td className="table-cell font-medium text-textMain">
                    {c.label}
                  </td>
                  {quotations.map((q, i) => (
                    <td
                      key={q.id}
                      className={`table-cell text-center ${i === lowestIdx ? "bg-success-500/5" : ""}`}
                    >
                      <span
                        className={
                          i === lowestIdx && c.key === "total_amount"
                            ? "text-success-400 font-bold"
                            : ""
                        }
                      >
                        {c.format(q[c.key])}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
              {/* Rating row with stars */}
              <tr className="border-b border-border/50">
                <td className="table-cell font-medium text-textMain">
                  Rating Visual
                </td>
                {quotations.map((q, i) => (
                  <td
                    key={q.id}
                    className={`table-cell text-center ${i === lowestIdx ? "bg-success-500/5" : ""}`}
                  >
                    <div className="flex items-center justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={
                            s <= Math.floor(q.vendor?.rating || 0)
                              ? "text-warning-400 fill-warning-400"
                              : "text-textDim"
                          }
                        />
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
            <div
              key={q.id}
              className={`flex-1 p-4 text-center ${i === lowestIdx ? "bg-success-500/5" : ""}`}
            >
              <button
                disabled={submitting}
                onClick={() => handleApprove(q.id)}
                className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                  i === lowestIdx ? "btn-success" : "btn-secondary"
                }`}
              >
                <CheckCircle size={14} />
                {submitting ? "Sending..." : (i === lowestIdx ? "Select & Approve" : "Select")}
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-textDim italic text-center">
        Green = lowest price. Selecting a vendor initiates the approval
        workflow.
      </p>
    </div>
  );
}
