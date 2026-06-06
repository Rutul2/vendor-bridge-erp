import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Users } from "lucide-react";
import { useState, useEffect } from "react";
import StatusBadge from "../../components/StatusBadge";
import { rfqService } from "./rfqService";

export default function RFQDetail() {
  const { id } = useParams();
  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRfq = async () => {
      try {
        setLoading(true);
        const res = await rfqService.getById(id);
        setRfq(res.data);
      } catch (err) {
        setError("RFQ not found");
      } finally {
        setLoading(false);
      }
    };
    fetchRfq();
  }, [id]);

  if (loading) {
    return <div className="page-container py-16 text-center text-textMuted">Loading...</div>;
  }

  if (!rfq) {
    return (
      <div className="page-container">
        <Link to="/rfqs" className="inline-flex items-center gap-2 text-primary-400 text-sm"><ArrowLeft size={16} /> Back</Link>
        <div className="card text-center py-16"><p className="text-textMuted">{error}</p></div>
      </div>
    );
  }

  const vendors = rfq.vendors || [];

  return (
    <div className="page-container max-w-4xl mx-auto">
      <Link to="/rfqs" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm mb-4">
        <ArrowLeft size={16} /> Back to RFQs
      </Link>

      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">{rfq.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-textMuted">
              <span className="flex items-center gap-1.5"><Tag size={14} /> {rfq.category}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> Due: {new Date(rfq.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
          <StatusBadge status={rfq.status} />
        </div>

        {rfq.description && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-textMuted">{rfq.description}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider mb-3">Line Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header text-left">Item</th>
                  <th className="table-header text-left">Quantity</th>
                  <th className="table-header text-left">Unit</th>
                </tr>
              </thead>
              <tbody>
                {rfq.items?.map((item, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="table-cell-primary">{item.item_name}</td>
                    <td className="table-cell">{item.quantity}</td>
                    <td className="table-cell">{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users size={14} /> Assigned Vendors ({vendors.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vendors.map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-3 bg-surfaceHighlight rounded-lg border border-border">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 text-xs font-bold">{v.vendor.company_name?.[0]}</div>
                <div>
                  <p className="text-sm font-medium text-textMain">{v.vendor.company_name}</p>
                  <p className="text-xs text-textDim">{v.vendor.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
