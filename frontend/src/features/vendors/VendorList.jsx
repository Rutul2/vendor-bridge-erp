import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import VendorForm from "./VendorForm";
import { vendorService } from "./vendorService";

const tabs = ["All", "ACTIVE", "PENDING", "BLOCKED"];

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await vendorService.getAll({ 
        search, 
        status: activeTab !== "All" ? activeTab : undefined 
      });
      setVendors(data.data?.items || []);
    } catch (error) {
      console.error("Failed to fetch vendors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [search, activeTab]);

  const tabCounts = {
    All: vendors.length,
    ACTIVE: vendors.filter(v => v.status === "ACTIVE").length,
    PENDING: vendors.filter(v => v.status === "PENDING").length,
    BLOCKED: vendors.filter(v => v.status === "BLOCKED").length,
  };

  const handleAddVendor = async (data) => {
    try {
      await vendorService.create(data);
      setShowForm(false);
      fetchVendors();
    } catch (error) {
      console.error("Failed to add vendor", error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Vendors</h1>
          <p className="page-subtitle">Manage supplier profiles and registrations</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus size={16} /> Add Vendor
        </button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by name, GST number, category..." />

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${
              activeTab === tab
                ? "bg-primary-500/10 text-primary-400 border-primary-500/20"
                : "text-textMuted border-border hover:bg-surfaceHighlight"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="table-header">Vendor Name</th>
                <th className="table-header">Category</th>
                <th className="table-header">GST No.</th>
                <th className="table-header">Contact No.</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-textMuted">Loading...</td></tr>
              ) : vendors.length === 0 ? (
                <tr><td colSpan="6"><EmptyState title="No vendors found" description="Try adjusting your search or filters" /></td></tr>
              ) : (
                vendors.map((v) => (
                  <tr key={v.id} className="border-b border-border/50 hover:bg-surfaceHighlight/50 transition-colors">
                    <td className="table-cell-primary">{v.company_name}</td>
                    <td className="table-cell">{v.category}</td>
                    <td className="table-cell font-mono text-xs">{v.gst_number}</td>
                    <td className="table-cell">{v.phone}</td>
                    <td className="table-cell"><StatusBadge status={v.status} /></td>
                    <td className="table-cell text-right">
                      <Link to={`/vendors/${v.id}`} className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
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

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add New Vendor" size="lg">
        <VendorForm onSubmit={handleAddVendor} onCancel={() => setShowForm(false)} />
      </Modal>
    </div>
  );
}
