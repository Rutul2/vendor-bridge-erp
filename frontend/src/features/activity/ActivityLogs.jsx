// src/features/activity/ActivityLogs.jsx
import { useState, useEffect } from "react";
import {
  FileText,
  MessageSquareQuote,
  CheckCircle,
  ShoppingCart,
  Receipt,
  Users,
  Filter,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { activityService } from "./activityService";

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
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const types = [
    "all",
    "rfq",
    "quotation",
    "approval",
    "po",
    "invoice",
    "vendor",
  ];

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await activityService.getAll();
        setLogs(response.data || []);
      } catch (err) {
        console.error("Failed to fetch activity logs:", err);
        setError("Failed to load activity logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const mapEntityType = (entityType) => {
    const map = {
      Rfq: "rfq",
      Quotation: "quotation",
      Approval: "approval",
      PurchaseOrder: "po",
      Invoice: "invoice",
      Vendor: "vendor",
      User: "vendor",
    };
    return map[entityType] || "rfq";
  };

  const filtered =
    typeFilter === "all"
      ? logs
      : logs.filter((log) => {
          const logType = mapEntityType(log.entity_type);
          return logType === typeFilter;
        });

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="page-container">
        <p className="text-danger-400">{error}</p>
      </div>
    );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Activity & Logs</h1>
          <p className="page-subtitle">
            Track all procurement activities and notifications
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <Filter size={16} className="text-textDim" />
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border capitalize transition-all ${
              typeFilter === t
                ? "bg-primary-500/10 text-primary-400 border-primary-500/20"
                : "text-textMuted border-border hover:bg-surfaceHighlight"
            }`}
          >
            {t === "all" ? "All" : t === "po" ? "PO" : t}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        {filtered.map((log) => {
          const logType = mapEntityType(log.entity_type);
          const Icon = typeIcons[logType] || FileText;
          const color = typeColors[logType] || typeColors.vendor;
          return (
            <div
              key={log.id}
              className="flex gap-4 items-start p-4 rounded-lg hover:bg-surface transition-colors group"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${color}`}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-textMain">
                  {log.action} - {log.entity_type}
                </p>
                <p className="text-sm text-textMuted mt-0.5">
                  {log.description || `ID: ${log.entity_id}`}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-textDim">
                  <span>{log.user_id || "System"}</span>
                  <span>•</span>
                  <span>
                    {new Date(log.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    at{" "}
                    {new Date(log.created_at).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
