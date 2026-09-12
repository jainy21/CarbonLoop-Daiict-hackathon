import React, { useState, useEffect } from 'react';
import { WasteBatch, Facility, CarbonCalculation } from '../types/index.js';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { CarbonImpactCard } from '../components/CarbonImpactCard.js';

interface CarbonImpactViewProps {
  activeBatch?: WasteBatch | null;
  selectedFacility?: Facility | null;
  onNavigateToPassport: () => void;
}

export const CarbonImpactView: React.FC<CarbonImpactViewProps> = ({
  activeBatch,
  selectedFacility,
  onNavigateToPassport
}) => {
  const [calculation, setCalculation] = useState<CarbonCalculation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCalculation = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/carbon/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: activeBatch?.id || 'batch-wl-1024',
          wasteType: activeBatch?.wasteType || 'Rice Husk',
          quantityTonnes: activeBatch?.quantityTonnes || 10,
          distanceKm: 26.4,
          conversionType: activeBatch?.preferredConversion || 'Biochar'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCalculation(data);
      }
    } catch (err) {
      console.warn('Carbon calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculation();
  }, [activeBatch, selectedFacility]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>STEP 4 • PROTOTYPE CARBON ACCOUNTING</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100">
            Estimated Net Carbon Impact Model
          </h2>
          <p className="text-xs text-slate-400">
            Diverting {activeBatch?.quantityTonnes || 10} tonnes of {activeBatch?.wasteType || 'Rice Husk'} from landfill decomposition into high-stability Biochar.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCalculation}
          className="text-xs font-semibold text-emerald-300 hover:text-emerald-100 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Re-calculate
        </button>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col justify-center items-center text-slate-400 text-xs gap-3">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Computing biogenic carbon retention and avoided landfill methane factors...</span>
        </div>
      ) : calculation ? (
        <CarbonImpactCard
          calculation={calculation}
          onProceed={onNavigateToPassport}
          ctaLabel="Issue Carbon Passport Certificate"
        />
      ) : (
        <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl border-slate-800">
          Unable to generate carbon calculation.
        </div>
      )}
    </div>
  );
};

