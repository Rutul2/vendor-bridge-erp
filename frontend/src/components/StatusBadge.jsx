// src/components/StatusBadge.jsx
const variants = {
  Active: 'bg-success-500/10 text-success-400 border-success-500/20',
  Approved: 'bg-success-500/10 text-success-400 border-success-500/20',
  Confirmed: 'bg-success-500/10 text-success-400 border-success-500/20',
  Completed: 'bg-success-500/10 text-success-400 border-success-500/20',
  Paid: 'bg-success-500/10 text-success-400 border-success-500/20',
  Open: 'bg-info-500/10 text-info-400 border-info-500/20',
  Submitted: 'bg-info-500/10 text-info-400 border-info-500/20',
  Pending: 'bg-warning-500/10 text-warning-400 border-warning-500/20',
  Awaiting: 'bg-warning-500/10 text-warning-400 border-warning-500/20',
  Draft: 'bg-surfaceHighlight text-textMuted border-border',
  Blocked: 'bg-danger-500/10 text-danger-400 border-danger-500/20',
  Rejected: 'bg-danger-500/10 text-danger-400 border-danger-500/20',
  Overdue: 'bg-danger-500/10 text-danger-400 border-danger-500/20',
  Closed: 'bg-surfaceHighlight text-textDim border-border',
};

export default function StatusBadge({ status, className = '' }) {
  const style = variants[status] || variants.Draft;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} ${className}`}>
      {status}
    </span>
  );
}
