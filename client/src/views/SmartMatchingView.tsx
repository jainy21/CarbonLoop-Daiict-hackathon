import React, { useState, useEffect } from 'react';
import { WasteBatch, Facility, FacilityMatchScore, MatchingRecommendationResponse } from '../types/index.js';
import { 
  Sparkles, 
  MapPin, 
  Scale, 
  Building2, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck,
  Zap,
  RotateCcw,
  SlidersHorizontal,
  Filter
} from 'lucide-react';
import { FacilityCard } from '../components/FacilityCard.js';

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
  const [recommendationData, setRecommendationData] = useState<MatchingRecommendationResponse | null>(null);
  const [candidates, setCandidates] = useState<FacilityMatchScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('all');

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const payload: any = {};
      
      if (activeBatch?.id) {
        payload.batchId = activeBatch.id;
      }
      
      payload.wasteType = activeBatch?.wasteType || 'Rice Husk';
      payload.quantityTonnes = activeBatch?.quantityTonnes || 10;
      payload.origin = activeBatch?.origin || {
        lat: 23.0225,
        lng: 72.5714,
        address: 'APMC Market Yard, Vasna Road',
        city: 'Ahmedabad',
        state: 'Gujarat'
      };
      payload.preferredConversion = activeBatch?.preferredConversion || 'Biochar';

      const res = await fetch('/api/matching/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.candidates && Array.isArray(data.candidates)) {
          setRecommendationData(data);
          setCandidates(data.candidates);
        } else if (Array.isArray(data)) {
          setCandidates(data);
        }
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

  const filteredCandidates = candidates.filter(c => {
    if (filterType === 'all') return true;
    return c.facility.conversionType.toLowerCase() === filterType.toLowerCase();
  });

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
            Explainable weighted multi-criteria ranking (Compatibility 30%, Capacity 20%, Distance 15%, Efficiency 15%, Carbon Benefit 15%, Logistics Cost 5%).
          </p>
        </div>

        {activeBatch && (
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Batch:</span>
            <strong className="text-brand-300 font-mono">{activeBatch.trackingNumber || activeBatch.id}</strong>
            <span className="text-slate-500">({activeBatch.wasteType}, {activeBatch.quantityTonnes}t)</span>
          </div>
        )}
      </div>

      {/* Flagship Highlight & Controls Banner */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-cyan-200">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>
            Active Evaluation: <strong>{activeBatch?.quantityTonnes || 10} tonnes {activeBatch?.wasteType || 'Rice Husk'}</strong> in {activeBatch?.origin?.city || 'Ahmedabad'} → Target: <strong>{activeBatch?.preferredConversion || 'Biochar'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Conversion filter */}
          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:ring-cyan-500"
            >
              <option value="all">All Pathways</option>
              <option value="Biochar">Biochar</option>
              <option value="Biogas">Biogas</option>
              <option value="Carbon-negative material">Carbon Materials</option>
            </select>
          </div>

          <button
            type="button"
            onClick={fetchRecommendations}
            className="text-xs font-semibold text-cyan-300 hover:text-cyan-100 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            Re-evaluate
          </button>
        </div>
      </div>

      {/* Candidates List */}
      {loading ? (
        <div className="py-16 flex flex-col justify-center items-center text-slate-400 text-xs gap-3">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Evaluating 10+ Gujarat conversion facilities through weighted algorithm matrix...</span>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm glass-panel rounded-2xl border-slate-800">
          No matching facilities found for this pathway filter. Try selecting 'All Pathways'.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map((candidate, index) => (
            <FacilityCard
              key={candidate.facility.id}
              candidate={candidate}
              isTopRank={index === 0}
              onSelect={(fac, cand) => onSelectFacilityForLogistics(fac, cand)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

