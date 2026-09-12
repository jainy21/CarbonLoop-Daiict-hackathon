import React, { useState } from 'react';
import { Facility, FacilityMatchScore } from '../types/index.js';
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  Leaf, 
  Scale, 
  ShieldCheck 
} from 'lucide-react';
import { MatchScore } from './MatchScore.js';
import { MatchReason } from './MatchReason.js';
import { MatchBreakdown } from './MatchBreakdown.js';

interface FacilityCardProps {
  candidate: FacilityMatchScore;
  isTopRank?: boolean;
  onSelect?: (facility: Facility, candidate: FacilityMatchScore) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  candidate,
  isTopRank = false,
  onSelect
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(isTopRank);
  const { facility, matchScore, reasons, componentScores, breakdown, estimatedDistanceKm, estimatedLogisticsCostINR, estimatedNetCarbonImpactTonnesCO2e } = candidate;

  return (
    <div
      className={`glass-panel p-6 rounded-2xl border transition-all ${
        isTopRank
          ? 'border-brand-500/80 bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/20 shadow-xl shadow-brand-500/5 ring-1 ring-brand-500/30'
          : 'border-slate-800/80 hover:border-slate-700 bg-slate-900/60'
      }`}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="space-y-1.5 flex-1 min-w-[240px]">
          <div className="flex flex-wrap items-center gap-2">
            {isTopRank && (
              <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500 text-slate-950 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" />
                Rank #1 Recommended
              </span>
            )}
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {facility.conversionType}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {facility.operationalStatus || facility.status || 'Active'}
            </span>
          </div>

          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-400 shrink-0" />
            <span>{facility.name}</span>
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{facility.location.address}, {facility.location.city}, {facility.location.state}</span>
          </div>
        </div>

        {/* Match Score Display */}
        <MatchScore score={matchScore || candidate.matchScorePercent} size={isTopRank ? 'lg' : 'md'} />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 mb-4 text-center">
        <div>
          <span className="text-[10px] text-slate-500 block uppercase font-medium">Distance</span>
          <strong className="text-xs font-mono text-slate-200">{estimatedDistanceKm} km</strong>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block uppercase font-medium">Capacity</span>
          <strong className="text-xs font-mono text-slate-200">
            {facility.availableCapacityTonnesPerDay} t/d
          </strong>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block uppercase font-medium">Est. Logistics</span>
          <strong className="text-xs font-mono text-slate-200">
            ₹{estimatedLogisticsCostINR?.toLocaleString()}
          </strong>
        </div>
        <div>
          <span className="text-[10px] text-emerald-400 block uppercase font-semibold">Net Carbon</span>
          <strong className="text-xs font-mono text-emerald-300">
            +{estimatedNetCarbonImpactTonnesCO2e} tCO₂e
          </strong>
        </div>
      </div>

      {/* Accepted Waste Types Tag Cloud */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold mr-1">Feeds:</span>
        {facility.acceptedWasteTypes.map((type, tIdx) => (
          <span
            key={tIdx}
            className="text-[11px] px-2 py-0.5 rounded bg-slate-800/60 text-slate-300 border border-slate-700/50"
          >
            {type}
          </span>
        ))}
      </div>

      {/* Match Reasons Section */}
      <div className="pt-3 border-t border-slate-800/80 mb-4">
        <MatchReason reasons={reasons} />
      </div>

      {/* Expandable Weighted Breakdown */}
      {showDetails && (
        <div className="pt-2 mb-4">
          <MatchBreakdown scores={componentScores || breakdown} />
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-medium text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
        >
          {showDetails ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Hide Factor Scores
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              View Multi-Criteria Weights
            </>
          )}
        </button>

        {onSelect && (
          <button
            type="button"
            onClick={() => onSelect(facility, candidate)}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-md shadow-brand-500/10"
          >
            <span>Select Facility & Optimize Route</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};
