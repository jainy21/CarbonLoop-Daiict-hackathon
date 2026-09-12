import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  colorClass?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  colorClass = 'text-brand-400 bg-brand-500/10 border-brand-500/30',
  isLoading = false,
  onClick
}) => {
  if (isLoading) {
    return (
      <div className="glass-panel p-5 rounded-2xl border-slate-800 animate-pulse space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-800 rounded" />
          <div className="w-8 h-8 rounded-xl bg-slate-800" />
        </div>
        <div className="h-8 w-32 bg-slate-800 rounded" />
        <div className="h-3 w-20 bg-slate-800 rounded" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-5 rounded-2xl border-slate-800/80 hover:border-brand-500/40 transition-all duration-300 relative overflow-hidden group ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:shadow-brand-500/5' : ''
      }`}
    >
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-500/10 transition-all" />

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-100 group-hover:text-white transition-colors">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold font-sans text-slate-400">
            {unit}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-xs">
        {subtitle && (
          <span className="text-slate-400 truncate text-[11px]">
            {subtitle}
          </span>
        )}
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              isPositive
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>
    </div>
  );
};
