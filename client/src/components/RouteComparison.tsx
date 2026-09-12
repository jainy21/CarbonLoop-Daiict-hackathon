import React from 'react';
import { RouteDetail, RouteComparison as IRouteComparison } from '../types/index.js';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  TrendingDown, 
  Clock, 
  IndianRupee, 
  Gauge, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';
import { RouteScore } from './RouteScore.js';

interface RouteComparisonProps {
  comparison?: IRouteComparison;
  activeRouteType: 'recommended' | 'alternative';
  onSelectRouteType: (type: 'recommended' | 'alternative') => void;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  comparison,
  activeRouteType,
  onSelectRouteType
}) => {
  if (!comparison) return null;

  const { recommended, alternative, distanceDeltaKm, timeDeltaMinutes, costDeltaINR, emissionsDeltaKgCO2e, recommendationReason } = comparison;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Multi-Route Corridor Analysis & Comparison
          </h3>
        </div>
        <span className="text-xs text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          Delta: -{distanceDeltaKm} km • -₹{costDeltaINR.toLocaleString()} • -{emissionsDeltaKgCO2e.toFixed(1)} kgCO₂e
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Route Card */}
        <div
          onClick={() => onSelectRouteType('recommended')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all relative ${
            activeRouteType === 'recommended'
              ? 'border-brand-500 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/30 shadow-xl shadow-brand-500/10 ring-2 ring-brand-500/40'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 opacity-80'
          }`}
        >
          {/* Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500 text-slate-950 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Recommended Route
            </span>
            <RouteScore score={recommended.routeScore || 92} size="sm" showLabel={false} />
          </div>

          <h4 className="text-base font-bold text-slate-100 mb-1">
            {recommended.name}
          </h4>
          <p className="text-xs text-brand-300/90 font-mono mb-3">
            {recommended.corridorName}
          </p>

          <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Distance</span>
              <strong className="text-xs font-mono text-cyan-300">{recommended.distanceKm} km</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Duration</span>
              <strong className="text-xs font-mono text-indigo-300">{recommended.durationMinutes}m</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Cost</span>
              <strong className="text-xs font-mono text-emerald-300">₹{recommended.estimatedCost.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Emissions</span>
              <strong className="text-xs font-mono text-rose-300">{recommended.transportEmissionsKgCO2e} kg</strong>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {recommended.summary}
          </p>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Traffic: {recommended.trafficStatus || 'Free-Flow'}
            </span>
            <span className="font-mono text-brand-400 font-bold">
              {activeRouteType === 'recommended' ? '● Active on Map' : 'Click to View'}
            </span>
          </div>
        </div>

        {/* Alternative Route Card */}
        <div
          onClick={() => onSelectRouteType('alternative')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all relative ${
            activeRouteType === 'alternative'
              ? 'border-cyan-500 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-500/40'
              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 opacity-70'
          }`}
        >
          {/* Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-700">
              Alternative Route
            </span>
            <RouteScore score={alternative.routeScore || 74} size="sm" showLabel={false} />
          </div>

          <h4 className="text-base font-bold text-slate-200 mb-1">
            {alternative.name}
          </h4>
          <p className="text-xs text-slate-400 font-mono mb-3">
            {alternative.corridorName}
          </p>

          <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Distance</span>
              <strong className="text-xs font-mono text-slate-300">{alternative.distanceKm} km</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Duration</span>
              <strong className="text-xs font-mono text-slate-300">{alternative.durationMinutes}m</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Cost</span>
              <strong className="text-xs font-mono text-slate-300">₹{alternative.estimatedCost.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Emissions</span>
              <strong className="text-xs font-mono text-slate-300">{alternative.transportEmissionsKgCO2e} kg</strong>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            {alternative.summary}
          </p>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              Traffic: {alternative.trafficStatus || 'Moderate'}
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              {activeRouteType === 'alternative' ? '● Active on Map' : 'Click to View'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
