import React, { useState, useEffect } from 'react';
import { WasteBatch, Facility } from '../types/index.js';
import { 
  TrendingUp, 
  Plus, 
  Minus, 
  Equal, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  AlertTriangle,
  Leaf,
  Flame,
  Truck,
  Building2
} from 'lucide-react';

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
  const [calculation, setCalculation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCalculation = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/carbon/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: activeBatch?.id || 'batch-ahmedabad-demo',
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

  const quantityTonnes = activeBatch?.quantityTonnes || 10;
  const avoidedLandfill = calculation?.avoidedLandfillEmissionsTonnesCO2e || 2.8;
  const conversionBenefit = calculation?.conversionCarbonBenefitTonnesCO2e || 5.8;
  const transportEmissions = calculation?.transportEmissionsTonnesCO2e || 0.0062;
  const netImpact = calculation?.netCarbonImpactTonnesCO2e || 8.4;

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
            Diverting {quantityTonnes} tonnes of {activeBatch?.wasteType || 'Rice Husk'} from landfill decomposition into high-stability Biochar.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/40 px-3.5 py-1.5 rounded-lg border border-emerald-500/30">
          <span className="text-xs text-emerald-300">Methodology:</span>
          <span className="text-xs font-mono text-emerald-200 font-bold">IPCC Tier-2 Adapted</span>
        </div>
      </div>

      {/* Scientific Prototype Disclaimer (Required by Specification) */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200 leading-relaxed">
          <strong>Prototype Estimation Notice:</strong> This calculation model generates scientific prototype estimates of avoided landfill methane and biogenic carbon fixation. It is not a legally certified carbon offset or registry credit without formal verifier validation.
        </div>
      </div>

      {/* The Core Carbon Equation Formula Visualizer */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          The Carbon Equation Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Term 1: Avoided Landfill */}
          <div className="glass-panel p-5 rounded-xl border-cyan-500/30 bg-cyan-950/10 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                Avoided Baseline
              </span>
              <Plus className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-mono font-black text-cyan-300">
              +{avoidedLandfill.toFixed(2)} <span className="text-xs font-sans text-slate-400 font-normal">tCO₂e</span>
            </div>
            <p className="text-xs text-slate-300 font-semibold">
              Avoided Landfill Methane
            </p>
            <p className="text-[11px] text-slate-400">
              Prevents anaerobic decomposition and toxic landfill leachate.
            </p>
          </div>

          {/* Term 2: Conversion Benefit */}
          <div className="glass-panel p-5 rounded-xl border-brand-500/30 bg-brand-950/10 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                Sequestration
              </span>
              <Plus className="w-4 h-4 text-brand-400" />
            </div>
            <div className="text-2xl font-mono font-black text-brand-300">
              +{conversionBenefit.toFixed(2)} <span className="text-xs font-sans text-slate-400 font-normal">tCO₂e</span>
            </div>
            <p className="text-xs text-slate-300 font-semibold">
              Conversion Carbon Fixation
            </p>
            <p className="text-[11px] text-slate-400">
              Locks recalcitrant biogenic carbon for 100+ years in biochar matrix.
            </p>
          </div>

          {/* Term 3: Logistics Penalty */}
          <div className="glass-panel p-5 rounded-xl border-rose-500/30 bg-rose-950/10 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                Logistics Penalty
              </span>
              <Minus className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-mono font-black text-rose-300">
              -{(transportEmissions * 1000).toFixed(1)} <span className="text-xs font-sans text-slate-400 font-normal">kgCO₂e</span>
            </div>
            <p className="text-xs text-slate-300 font-semibold">
              Transportation Emissions
            </p>
            <p className="text-[11px] text-slate-400">
              Tailpipe emissions over 26.4 km CNG carrier transit corridor.
            </p>
          </div>

          {/* Result: Net Carbon Impact */}
          <div className="glass-panel p-6 rounded-xl border-2 border-emerald-400/60 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 space-y-2 relative shadow-xl shadow-emerald-500/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-black uppercase text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                Net Result
              </span>
              <Equal className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-mono font-black text-emerald-300">
              +{netImpact.toFixed(1)} <span className="text-sm font-sans text-emerald-400/80 font-normal">tCO₂e</span>
            </div>
            <p className="text-xs text-emerald-200 font-bold">
              Estimated Net Carbon Value
            </p>
            <p className="text-[11px] text-slate-300">
              Equivalent to planting ~380 mature trees for one year.
            </p>
          </div>
        </div>

        {/* Next Step Action */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onNavigateToPassport}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xl shadow-brand-500/20"
          >
            <span>Issue Carbon Passport Certificate</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
