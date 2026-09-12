import React from 'react';
import { WasteBatch } from '../types/index.js';
import { BatchStatusBadge } from './BatchStatusBadge.js';
import { 
  Scale, 
  MapPin, 
  Building2, 
  Calendar, 
  Leaf, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

interface WasteBatchCardProps {
  batch: WasteBatch;
  onSelect: (batch: WasteBatch) => void;
  isSelected?: boolean;
}

export const WasteBatchCard: React.FC<WasteBatchCardProps> = ({
  batch,
  onSelect,
  isSelected = false
}) => {
  return (
    <div
      onClick={() => onSelect(batch)}
      className={`glass-panel p-4 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? 'border-brand-500 ring-2 ring-brand-500/20 bg-slate-900/90 shadow-lg'
          : 'glass-panel-hover'
      }`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
            {batch.trackingNumber || batch.id}
          </span>
          <span className="text-[11px] text-slate-400">
            {batch.category}
          </span>
        </div>
        <BatchStatusBadge status={batch.status} size="sm" />
      </div>

      <div className="flex items-baseline justify-between mb-3">
        <h4 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
          <Leaf className="w-4 h-4 text-brand-400" />
          {batch.wasteType}
        </h4>
        <div className="text-sm font-mono font-bold text-emerald-300 flex items-center gap-1">
          <Scale className="w-3.5 h-3.5 text-emerald-400" />
          {batch.quantityTonnes} tonnes
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-2.5 mb-3">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{batch.origin.address}, {batch.origin.city}</span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">
            {batch.facilityName ? batch.facilityName : 'Awaiting Match Engine'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px]">
          <span className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3 h-3 text-slate-400" />
            {new Date(batch.createdAt).toLocaleDateString()}
          </span>

          {batch.estimatedCarbonImpactTonnesCO2e && (
            <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold">
              <TrendingUp className="w-3 h-3" />
              +{batch.estimatedCarbonImpactTonnesCO2e.toFixed(1)} tCO₂e
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-brand-400 font-medium pt-1">
        <span>View full trace & lifecycle</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
