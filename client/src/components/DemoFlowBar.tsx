import React from 'react';
import { Zap, Play, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface DemoFlowBarProps {
  currentStage: number; // 1 to 6
  onSelectStage: (stage: number) => void;
  onLoadDemoScenario: () => void;
  onResetDemo: () => void;
}

const STAGES = [
  { step: 1, label: '1. Create Batch', tab: 'waste-batches', desc: '10t Rice Husk' },
  { step: 2, label: '2. Smart Match', tab: 'smart-path', desc: 'BioChar Plant A' },
  { step: 3, label: '3. GIS Logistics', tab: 'map-logistics', desc: '26.4 km • ₹2,140' },
  { step: 4, label: '4. Intake & Conv.', tab: 'waste-batches', desc: 'Pyrolysis' },
  { step: 5, label: '5. Carbon Impact', tab: 'carbon-impact', desc: '+8.4 tCO₂e' },
  { step: 6, label: '6. QR Passport', tab: 'carbon-passports', desc: 'Public Verify' },
];

export const DemoFlowBar: React.FC<DemoFlowBarProps> = ({
  currentStage,
  onSelectStage,
  onLoadDemoScenario,
  onResetDemo
}) => {
  return (
    <div className="bg-slate-900/95 border-b border-brand-500/30 px-4 py-2 text-xs backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Demo Scenario Badge & Load Button */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-brand-300 uppercase tracking-wider text-[11px] bg-brand-500/10 px-2.5 py-1 rounded-md border border-brand-500/25">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Judge Demonstration Mode
          </span>

          <button
            type="button"
            onClick={onLoadDemoScenario}
            className="px-3 py-1 rounded-md bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-400 hover:to-emerald-400 text-slate-950 font-black text-[11px] tracking-wide uppercase shadow-sm transition-all flex items-center gap-1 cursor-pointer"
            title="Loads 10 tonnes Rice Husk (Ahmedabad → BioChar Plant A, 26.4 km, +8.4 tCO₂e)"
          >
            <Sparkles className="w-3 h-3 fill-current" />
            <span>Load Demo Scenario</span>
          </button>
        </div>

        {/* Center: Stage Progression Selector */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
          {STAGES.map((s) => {
            const isActive = currentStage === s.step;
            const isCompleted = currentStage > s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => onSelectStage(s.step)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-brand-500 text-slate-950 shadow-sm font-bold ring-2 ring-brand-400/40'
                    : isCompleted
                    ? 'bg-slate-800 text-emerald-300 hover:bg-slate-750'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-mono">{s.step}</span>
                )}
                <span>{s.label}</span>
              </button>
            );
          })}

          {/* Reset Demo Button */}
          <button
            type="button"
            onClick={onResetDemo}
            title="Reset Demo to Initial State"
            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-[11px] font-semibold flex items-center gap-1 ml-1 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
