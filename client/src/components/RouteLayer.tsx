import React from 'react';
import { RouteDetail } from '../types/index.js';
import { Truck, Navigation, CheckCircle2 } from 'lucide-react';

interface RouteLayerProps {
  route: RouteDetail;
  isActive: boolean;
  onSelect?: () => void;
}

export const RouteLayer: React.FC<RouteLayerProps> = ({
  route,
  isActive,
  onSelect
}) => {
  return (
    <div
      onClick={onSelect}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
        isActive
          ? 'border-brand-500 bg-brand-950/20 shadow-md ring-1 ring-brand-500/30'
          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-brand-400" />
          {route.name}
        </span>
        <span className="text-xs font-mono font-bold text-emerald-400">
          {route.distanceKm} km
        </span>
      </div>
      <p className="text-[11px] text-slate-400 truncate">{route.corridorName}</p>
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 mt-2">
        <span>{route.durationMinutes} mins transit</span>
        <span>₹{route.estimatedCost.toLocaleString()}</span>
        <span className="text-rose-400 font-semibold">{route.transportEmissionsKgCO2e} kgCO₂e</span>
      </div>
    </div>
  );
};
