import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Star, ShoppingCart, Hash } from "lucide-react";
import { useState, useEffect } from "react";
import StatusBadge from "../../components/StatusBadge";
import { vendorService } from "./vendorService";

export default function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        const res = await vendorService.getById(id);
        setVendor(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Vendor not found");
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container text-center py-16 text-textMuted">
        Loading...
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="page-container">
        <Link to="/vendors" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm mb-4">
          <ArrowLeft size={16} /> Back to Vendors
        </Link>
        <div className="card text-center py-16">
          <p className="text-textMuted">{error || "Vendor not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/vendors" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm mb-4">
        <ArrowLeft size={16} /> Back to Vendors
      </Link>

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              {vendor.company_name?.[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{vendor.company_name}</h1>
              <p className="text-textMuted text-sm">{vendor.category}</p>
            </div>
          </div>
          <StatusBadge status={vendor.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={15} className="text-textDim" />
                <span className="text-textMuted">{vendor.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={15} className="text-textDim" />
                <span className="text-textMuted">{vendor.phone}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={15} className="text-textDim mt-0.5" />
                <span className="text-textMuted">{vendor.address}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider">Business Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Hash size={15} className="text-textDim" />
                <span className="text-textMuted font-mono">{vendor.gst_number}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-textDim text-xs w-4">👤</span>
                <span className="text-textMuted">{vendor.contact_person}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-textDim uppercase tracking-wider">Performance</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Star size={15} className="text-warning-400" />
                <span className="text-textMuted">{vendor.rating > 0 ? `${vendor.rating} / 5` : "No ratings yet"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShoppingCart size={15} className="text-textDim" />
                <span className="text-textMuted">{vendor.total_orders} total orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
