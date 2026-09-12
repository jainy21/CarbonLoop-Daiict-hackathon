import React from 'react';
import { Zap, Play, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import { NavTab } from './Navigation.js';

interface DemoFlowBarProps {
  currentStage: number; // 1 to 6
  onSelectStage: (stage: number) => void;
  onResetDemo: () => void;
}

const STAGES = [
  { step: 1, label: '1. Create Batch', tab: 'waste-batches', desc: '10t Rice Husk (Ahmedabad)' },
  { step: 2, label: '2. Smart Match', tab: 'smart-path', desc: 'BioChar Plant A (92%)' },
  { step: 3, label: '3. GIS Logistics', tab: 'map-logistics', desc: '26.4 km • ₹2,140' },
  { step: 4, label: '4. Intake & Conv.', tab: 'waste-batches', desc: 'Pyrolysis Sequestration' },
  { step: 5, label: '5. Carbon Impact', tab: 'carbon-impact', desc: '+8.4 tCO₂e Net' },
  { step: 6, label: '6. QR Passport', tab: 'carbon-passports', desc: 'Public Verification' },
];

export const DemoFlowBar: React.FC<DemoFlowBarProps> = ({
  currentStage,
  onSelectStage,
  onResetDemo
}) => {
  return (
    <div className="bg-slate-900/90 border-b border-brand-500/30 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-brand-300 uppercase tracking-wider text-[11px] bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            Hackathon Judge Walkthrough
          </span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Follow the 10t Rice Husk Ahmedabad flagship scenario:
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
          {STAGES.map((s) => {
            const isActive = currentStage === s.step;
            const isCompleted = currentStage > s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => onSelectStage(s.step)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-500 text-slate-950 shadow-sm font-bold ring-2 ring-brand-400/40'
                    : isCompleted
                    ? 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
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

          <button
            type="button"
            onClick={onResetDemo}
            title="Reset demo scenario"
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 ml-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
