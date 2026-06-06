// src/features/vendors/VendorList.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import VendorForm from "./VendorForm";
import { MOCK_VENDORS } from "../../utils/mockData";

const tabs = ["All", "Active", "Pending", "Blocked"];

export default function VendorList() {
  const [vendors, setVendors] = useState(MOCK_VENDORS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const filtered = vendors.filter((v) => {
    const matchesSearch = v.companyName.toLowerCase().includes(search.toLowerCase()) ||
      v.gstNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || v.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabCounts = {
    All: vendors.length,
    Active: vendors.filter(v => v.status === "Active").length,
    Pending: vendors.filter(v => v.status === "Pending").length,
    Blocked: vendors.filter(v => v.status === "Blocked").length,
  };

  const handleAddVendor = (data) => {
    const newVendor = { ...data, _id: `v${Date.now()}`, rating: 0, totalOrders: 0, createdAt: new Date().toISOString().split("T")[0] };
    setVendors([newVendor, ...vendors]);
    setShowForm(false);
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
            {tab} ({tabCounts[tab]})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
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
              {filtered.length === 0 ? (
                <tr><td colSpan="6"><EmptyState title="No vendors found" description="Try adjusting your search or filters" /></td></tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v._id} className="border-b border-border/50 hover:bg-surfaceHighlight/50 transition-colors">
                    <td className="table-cell-primary">{v.companyName}</td>
                    <td className="table-cell">{v.category}</td>
                    <td className="table-cell font-mono text-xs">{v.gstNumber}</td>
                    <td className="table-cell">{v.phone}</td>
                    <td className="table-cell"><StatusBadge status={v.status} /></td>
                    <td className="table-cell text-right">
                      <Link to={`/vendors/${v._id}`} className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
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
