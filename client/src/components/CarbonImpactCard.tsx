import React from 'react';
import { CarbonCalculation } from '../types/index.js';
import { TrendingUp, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CarbonBreakdown } from './CarbonBreakdown.js';

interface CarbonImpactCardProps {
  calculation: CarbonCalculation;
  onProceed?: () => void;
  ctaLabel?: string;
}

export const CarbonImpactCard: React.FC<CarbonImpactCardProps> = ({
  calculation,
  onProceed,
  ctaLabel = "Issue Carbon Passport Certificate"
}) => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>DETERMINISTIC CARBON ENGINE</span>
          </div>
          <h3 className="text-xl font-black text-slate-100 mt-1">
            Carbon Sequestration & Avoidance Ledger
          </h3>
          <p className="text-xs text-slate-400">
            Evaluating {calculation.wasteQuantityTonnes || calculation.quantityTonnes} tonnes of {calculation.wasteType} feedstock
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/40 px-3.5 py-1.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-mono text-emerald-200 font-bold">
            {calculation.methodologyVersion || 'CarbonLoop-v2.0-Prototype'}
          </span>
        </div>
      </div>

      {/* Prototype Methodology Notice */}
      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/90 leading-relaxed">
          <strong>Prototype Methodology Notice:</strong> Net carbon impact estimates are modeled based on scientific literature factors (avoided baseline landfill methane, pyrolysis C-fixation retention, and carrier transit fuel). This represents an educational and operational prototype estimate, not certified registry offset credits.
        </p>
      </div>

      {/* Carbon Breakdown Visualizer */}
      <CarbonBreakdown calculation={calculation} />

      {/* CTA */}
      {onProceed && (
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onProceed}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xl shadow-brand-500/20"
          >
            <span>{ctaLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};
