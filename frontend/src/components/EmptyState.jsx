// src/components/EmptyState.jsx
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'No data found', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-surfaceHighlight rounded-2xl mb-4">
        <Icon size={32} className="text-textDim" />
      </div>
      <h3 className="text-lg font-semibold text-textMuted">{title}</h3>
      {description && <p className="text-sm text-textDim mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
