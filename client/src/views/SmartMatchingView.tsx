import React, { useState, useEffect } from 'react';
import { WasteBatch, Facility } from '../types/index.js';
import { 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Scale, 
  Building2, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';

interface SmartMatchingViewProps {
  activeBatch?: WasteBatch | null;
  onSelectFacilityForLogistics: (facility: Facility, matchScore: any) => void;
  onNavigateToBatches: () => void;
}

export const SmartMatchingView: React.FC<SmartMatchingViewProps> = ({
  activeBatch,
  onSelectFacilityForLogistics,
  onNavigateToBatches
}) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const payload = {
        wasteType: activeBatch?.wasteType || 'Rice Husk',
        quantityTonnes: activeBatch?.quantityTonnes || 10,
        origin: activeBatch?.origin || {
          lat: 23.0225,
          lng: 72.5714,
          address: 'APMC Market Yard, Vasna Road',
          city: 'Ahmedabad',
          state: 'Gujarat'
        },
        preferredConversion: activeBatch?.preferredConversion || 'Biochar'
      };

      const res = await fetch('/api/matching/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
      }
    } catch (err) {
      console.warn('Matching recommend error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [activeBatch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STEP 2 • INTELLIGENT MATCHING ENGINE</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100">
            Smart Waste-to-Facility Matching
          </h2>
          <p className="text-xs text-slate-400">
            Multi-criteria weighted ranking balancing compatibility, daily capacity, logistics distance, efficiency, and net carbon benefit.
          </p>
        </div>

        {activeBatch && (
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Evaluating Batch:</span>
            <strong className="text-brand-300 font-mono">{activeBatch.trackingNumber || activeBatch.id}</strong>
            <span className="text-slate-500">({activeBatch.wasteType}, {activeBatch.quantityTonnes}t)</span>
          </div>
        )}
      </div>

      {/* Flagship Highlight Banner */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-cyan-200">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Demo Match Criteria: <strong>10 tonnes Rice Husk</strong> in Ahmedabad APMC → Target: <strong>Biochar</strong></span>
        </div>
        <button
          type="button"
          onClick={fetchRecommendations}
          className="text-xs font-semibold text-cyan-300 hover:text-cyan-100 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Re-evaluate Matches
        </button>
      </div>

      {/* Recommendations List */}
      {loading ? (
        <div className="py-12 flex justify-center items-center text-slate-400 text-xs gap-2">
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          Running multi-criteria compatibility matrix...
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const isTop = index === 0;
            const fac = rec.facility;

            return (
              <div
                key={fac.id}
                className={`glass-panel p-6 rounded-2xl border transition-all ${
                  isTop
                    ? 'border-brand-500/80 bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/20 shadow-xl shadow-brand-500/5'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {isTop && (
                        <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500 text-slate-950 flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3" />
                          Recommended Best Match
                        </span>
                      )}
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {fac.conversionType}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      <span>{fac.name}</span>
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{fac.location.address}, {fac.location.city}</span>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="text-right">
                    <div className="text-3xl font-black font-mono text-brand-300">
                      {rec.matchScorePercent}%
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Compatibility Score
                    </span>
                  </div>
                </div>

                {/* Reasons List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80 mb-4">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                      Algorithm Match Justification
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {rec.reasons.map((reason: string, rIdx: number) => (
                        <li key={rIdx} className="flex items-center gap-1.5 text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Est. Distance</span>
                      <strong className="text-xs font-mono text-slate-200">
                        {rec.estimatedDistanceKm} km
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Logistics Cost</span>
                      <strong className="text-xs font-mono text-slate-200">
                        ₹{rec.estimatedLogisticsCostINR?.toLocaleString()}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                      <span className="text-[10px] text-emerald-400 block font-semibold">Net Carbon Impact</span>
                      <strong className="text-xs font-mono text-emerald-300">
                        +{rec.estimatedNetCarbonImpactTonnesCO2e} tCO₂e
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="flex items-center justify-end pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => onSelectFacilityForLogistics(fac, rec)}
                    className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-md"
                  >
                    <span>Select Facility & Optimize Route</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
