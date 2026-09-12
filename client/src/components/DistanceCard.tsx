import React from 'react';
import { Navigation, Clock, IndianRupee, Gauge } from 'lucide-react';

interface DistanceCardProps {
  distanceKm: number;
  durationMinutes: number;
  estimatedCostINR: number;
  transportEmissionsKgCO2e: number;
  originCity?: string;
  destinationCity?: string;
}

export const DistanceCard: React.FC<DistanceCardProps> = ({
  distanceKm,
  durationMinutes,
  estimatedCostINR,
  transportEmissionsKgCO2e,
  originCity = 'Ahmedabad',
  destinationCity = 'Sanand'
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Distance */}
      <div className="glass-panel p-4 rounded-xl space-y-1 border border-cyan-500/20 bg-cyan-950/10">
        <span className="text-xs text-cyan-300 uppercase font-bold flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          Haulage Distance
        </span>
        <div className="text-2xl font-mono font-black text-cyan-200">
          {distanceKm} <span className="text-xs font-normal text-slate-400">km</span>
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          {originCity} ➔ {destinationCity}
        </div>
      </div>

      {/* Duration */}
      <div className="glass-panel p-4 rounded-xl space-y-1 border border-indigo-500/20 bg-indigo-950/10">
        <span className="text-xs text-indigo-300 uppercase font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          Transit Duration
        </span>
        <div className="text-2xl font-mono font-black text-indigo-200">
          {durationMinutes} <span className="text-xs font-normal text-slate-400">mins</span>
        </div>
        <div className="text-[11px] text-slate-400">Includes weighment & gate queue</div>
      </div>

      {/* Logistics Cost */}
      <div className="glass-panel p-4 rounded-xl space-y-1 border border-emerald-500/20 bg-emerald-950/10">
        <span className="text-xs text-emerald-300 uppercase font-bold flex items-center gap-1.5">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
          Logistics Cost
        </span>
        <div className="text-2xl font-mono font-black text-emerald-200">
          ₹{estimatedCostINR.toLocaleString()}
        </div>
        <div className="text-[11px] text-emerald-400/80">Base + Mileage + Loading</div>
      </div>

      {/* Transport Emissions */}
      <div className="glass-panel p-4 rounded-xl space-y-1 border border-rose-500/20 bg-rose-950/10">
        <span className="text-xs text-rose-300 uppercase font-bold flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-rose-400" />
          Transport Emissions
        </span>
        <div className="text-2xl font-mono font-black text-rose-200">
          {transportEmissionsKgCO2e} <span className="text-xs font-normal text-slate-400">kgCO₂e</span>
        </div>
        <div className="text-[11px] text-rose-400/80">Tailpipe fuel penalty</div>
      </div>
    </div>
  );
};
