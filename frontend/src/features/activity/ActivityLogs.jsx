// src/features/activity/ActivityLogs.jsx
import { useState } from "react";
import { FileText, MessageSquareQuote, CheckCircle, ShoppingCart, Receipt, Users, Filter } from "lucide-react";
import { MOCK_ACTIVITY_LOGS } from "../../utils/mockData";

const typeIcons = {
  rfq: FileText,
  quotation: MessageSquareQuote,
  approval: CheckCircle,
  po: ShoppingCart,
  invoice: Receipt,
  vendor: Users,
};

const typeColors = {
  rfq: "text-info-400 bg-info-500/10 border-info-500/20",
  quotation: "text-primary-400 bg-primary-500/10 border-primary-500/20",
  approval: "text-success-400 bg-success-500/10 border-success-500/20",
  po: "text-warning-400 bg-warning-500/10 border-warning-500/20",
  invoice: "text-danger-400 bg-danger-500/10 border-danger-500/20",
  vendor: "text-textMuted bg-surfaceHighlight border-border",
};

export default function ActivityLogs() {
  const [typeFilter, setTypeFilter] = useState("all");
  const types = ["all", "rfq", "quotation", "approval", "po", "invoice", "vendor"];

  const filtered = MOCK_ACTIVITY_LOGS.filter((log) => typeFilter === "all" || log.type === typeFilter);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Activity & Logs</h1>
          <p className="page-subtitle">Track all procurement activities and notifications</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <Filter size={16} className="text-textDim" />
        {types.map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border capitalize transition-all ${
              typeFilter === t ? "bg-primary-500/10 text-primary-400 border-primary-500/20" : "text-textMuted border-border hover:bg-surfaceHighlight"
            }`}>
            {t === "all" ? "All" : t === "po" ? "PO" : t}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        {filtered.map((log) => {
          const Icon = typeIcons[log.type] || FileText;
          const color = typeColors[log.type] || typeColors.vendor;
          return (
            <div key={log._id} className="flex gap-4 items-start p-4 rounded-lg hover:bg-surface transition-colors group">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-textMain">{log.action}</p>
                <p className="text-sm text-textMuted mt-0.5">{log.description}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-textDim">
                  <span>{log.user}</span>
                  <span>•</span>
                  <span>{new Date(log.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
