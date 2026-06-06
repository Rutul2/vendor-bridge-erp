// src/components/StatsCard.jsx
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ icon: Icon, label, value, trend, prefix = '', suffix = '' }) {
  const isPositive = trend > 0;
  return (
    <div className="card-hover group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:bg-primary-500/10 transition-colors duration-500" />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-textMuted text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{prefix}{value}{suffix}</p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? 'text-success-400' : 'text-danger-400'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{isPositive ? '+' : ''}{trend}%</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary-500/10 rounded-xl border border-primary-500/20">
          <Icon size={22} className="text-primary-400" />
        </div>
      </div>
    </div>
  );
}
