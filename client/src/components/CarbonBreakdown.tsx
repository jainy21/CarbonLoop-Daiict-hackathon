import React from 'react';
import { CarbonCalculation } from '../types/index.js';
import { Plus, Minus, Equal, Sparkles, ShieldCheck } from 'lucide-react';

interface CarbonBreakdownProps {
  calculation: CarbonCalculation;
}

export const CarbonBreakdown: React.FC<CarbonBreakdownProps> = ({ calculation }) => {
  const avoidedLandfill = calculation.avoidedLandfillEmissionsTonnesCO2e ?? calculation.avoidedLandfillEmissions ?? 0;
  const conversionBenefit = calculation.conversionCarbonBenefitTonnesCO2e ?? calculation.conversionCarbonBenefit ?? 0;
  const transportEmissions = calculation.transportEmissionsTonnesCO2e ?? calculation.transportEmissions ?? 0;
  const netImpact = calculation.netCarbonImpactTonnesCO2e ?? calculation.netCarbonImpact ?? 0;
  const transportKg = calculation.transportEmissionsKg ?? Math.round(transportEmissions * 1000);

  return (
    <div className="space-y-6">
      {/* Mathematical Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {/* 1. Avoided Landfill Emissions */}
        <div className="glass-panel p-5 rounded-2xl border-cyan-500/30 bg-cyan-950/10 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                1. Avoided Baseline
              </span>
              <Plus className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-mono font-black text-cyan-300">
              +{avoidedLandfill.toFixed(2)}{' '}
              <span className="text-xs font-sans text-slate-400 font-normal">tCO₂e</span>
            </div>
            <h4 className="text-xs text-slate-200 font-bold mt-1">
              Avoided Landfill Emissions
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
              Diverts biogenic mass from anaerobic decomposition and methane emissions.
            </p>
          </div>
          <div className="pt-3 border-t border-cyan-500/10 text-[10px] font-mono text-cyan-300/80">
            Factor: {calculation.formulaBreakdown?.landfillEmissionFactor || 0.28} tCO₂e/t
          </div>
        </div>

        {/* 2. Conversion Carbon Benefit */}
        <div className="glass-panel p-5 rounded-2xl border-brand-500/30 bg-brand-950/10 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                2. Sequestration
              </span>
              <Plus className="w-4 h-4 text-brand-400" />
            </div>
            <div className="text-2xl font-mono font-black text-brand-300">
              +{conversionBenefit.toFixed(2)}{' '}
              <span className="text-xs font-sans text-slate-400 font-normal">tCO₂e</span>
            </div>
            <h4 className="text-xs text-slate-200 font-bold mt-1">
              Conversion Carbon Benefit
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
              Stabilizes biogenic carbon into durable matrices with 100+ yr soil permanence.
            </p>
          </div>
          <div className="pt-3 border-t border-brand-500/10 text-[10px] font-mono text-brand-300/80">
            Fixation: {Math.round((calculation.formulaBreakdown?.conversionEfficiency || 0.88) * (calculation.formulaBreakdown?.carbonRetentionFactor || 0.92) * 100)}%
          </div>
        </div>

        {/* 3. Transportation Emissions */}
        <div className="glass-panel p-5 rounded-2xl border-rose-500/30 bg-rose-950/10 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                3. Transport Penalty
              </span>
              <Minus className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-mono font-black text-rose-300">
              -{transportKg > 0 ? transportKg.toFixed(1) : (transportEmissions * 1000).toFixed(1)}{' '}
              <span className="text-xs font-sans text-slate-400 font-normal">kgCO₂e</span>
            </div>
            <h4 className="text-xs text-slate-200 font-bold mt-1">
              Transportation Emissions
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
              Transit fuel emissions over optimized transit corridor.
            </p>
          </div>
          <div className="pt-3 border-t border-rose-500/10 text-[10px] font-mono text-rose-300/80">
            Penalty: -{transportEmissions.toFixed(4)} tCO₂e
          </div>
        </div>

        {/* 4. Net Carbon Impact Result */}
        <div className="glass-panel p-5 rounded-2xl border-2 border-emerald-400/60 bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-900 space-y-2 flex flex-col justify-between shadow-xl shadow-emerald-500/10">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-black uppercase text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                Net Result
              </span>
              <Equal className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-mono font-black text-emerald-300">
              +{netImpact.toFixed(1)}{' '}
              <span className="text-sm font-sans text-emerald-400/80 font-normal">tCO₂e</span>
            </div>
            <h4 className="text-xs text-emerald-200 font-bold mt-1">
              Estimated Net Impact
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
              Measurable circular climate value generated from waste transformation.
            </p>
          </div>
          <div className="pt-3 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            IPCC Tier-2 Adapted Model
          </div>
        </div>
      </div>
    </div>
  );
};
