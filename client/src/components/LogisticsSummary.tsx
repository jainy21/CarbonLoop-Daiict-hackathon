import React from 'react';
import { RouteDetail } from '../types/index.js';
import { Truck, IndianRupee, ShieldCheck, Zap, Info } from 'lucide-react';

interface LogisticsSummaryProps {
  route: RouteDetail;
  vehicleType: 'Electric Heavy Truck' | 'CNG Medium Carrier' | 'Diesel 10T Lorry';
  onVehicleChange: (vehicle: 'Electric Heavy Truck' | 'CNG Medium Carrier' | 'Diesel 10T Lorry') => void;
}

export const LogisticsSummary: React.FC<LogisticsSummaryProps> = ({
  route,
  vehicleType,
  onVehicleChange
}) => {
  const cost = route.costBreakdown || {
    baseCost: 500,
    costPerKm: 55,
    distanceKm: route.distanceKm,
    mileageCost: Math.round(route.distanceKm * 55),
    loadingCost: 600,
    totalCostINR: route.estimatedCost
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Vehicle & Logistics Cost Model
          </h3>
        </div>

        {/* Vehicle Selection Chips */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => onVehicleChange('CNG Medium Carrier')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              vehicleType === 'CNG Medium Carrier'
                ? 'bg-brand-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CNG Carrier (0.235 kg/km)
          </button>
          <button
            type="button"
            onClick={() => onVehicleChange('Electric Heavy Truck')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              vehicleType === 'Electric Heavy Truck'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Electric Truck (0.04 kg/km)
          </button>
          <button
            type="button"
            onClick={() => onVehicleChange('Diesel 10T Lorry')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              vehicleType === 'Diesel 10T Lorry'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Diesel 10T (0.48 kg/km)
          </button>
        </div>
      </div>

      {/* Breakdown Equation */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Formula:</span>
          <span className="font-mono text-slate-300 font-semibold bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            Base Cost (₹{cost.baseCost}) + Mileage ({route.distanceKm} km × ₹{cost.costPerKm}) + Loading/Weighment (₹{cost.loadingCost})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Total Estimated Cost:</span>
          <strong className="text-lg font-mono font-black text-emerald-300">
            ₹{route.estimatedCost.toLocaleString()}
          </strong>
        </div>
      </div>
    </div>
  );
};
