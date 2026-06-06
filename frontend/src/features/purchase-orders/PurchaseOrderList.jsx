import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, ShoppingCart } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { poService } from "./poService";

export default function PurchaseOrderList() {
  const [search, setSearch] = useState("");
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPos = async () => {
      try {
        setLoading(true);
        const res = await poService.getAll({ search });
        setPos(res.data?.items || []);
      } catch (error) {
        console.error("Failed to fetch purchase orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPos();
  }, [search]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchase Orders</h1>
          <p className="page-subtitle">Track and manage purchase orders</p>
        </div>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by PO number or vendor..." />

      <div className="card p-0 overflow-hidden mt-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="table-header">PO Number</th>
              <th className="table-header">Vendor</th>
              <th className="table-header">Amount</th>
              <th className="table-header">Date</th>
              <th className="table-header">Status</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-8 text-textMuted">Loading...</td></tr>
            ) : pos.length === 0 ? (
              <tr><td colSpan="6"><EmptyState icon={ShoppingCart} title="No purchase orders found" /></td></tr>
            ) : (
              pos.map((po) => (
                <tr key={po.id} className="border-b border-border/50 hover:bg-surfaceHighlight/50 transition-colors">
                  <td className="table-cell-primary font-mono">{po.po_number}</td>
                  <td className="table-cell">{po.vendor?.company_name}</td>
                  <td className="table-cell font-medium">₹{po.quotation?.grand_total?.toLocaleString('en-IN') || 0}</td>
                  <td className="table-cell">{new Date(po.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="table-cell"><StatusBadge status={po.status} /></td>
                  <td className="table-cell text-right">
                    <Link to={`/purchase-orders/${po.id}`} className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium">
                      <Eye size={14} /> View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
