import React from 'react';
import { FacilityComponentScores } from '../types/index.js';

interface MatchBreakdownProps {
  scores?: FacilityComponentScores | {
    compatibilityScore?: number;
    capacityScore?: number;
    distanceScore?: number;
    efficiencyScore?: number;
    carbonBenefitScore?: number;
    logisticsCostScore?: number;
  };
}

export const MatchBreakdown: React.FC<MatchBreakdownProps> = ({ scores }) => {
  if (!scores) return null;

  // Normalize scores to 0-100%
  const getNorm = (val: any) => {
    if (val === undefined || val === null) return 80;
    if (val <= 1.0) return Math.round(val * 100);
    return Math.round(val);
  };

  const metrics = [
    {
      label: 'Waste Compatibility',
      weight: '30%',
      val: getNorm((scores as any).compatibility ?? (scores as any).compatibilityScore),
      color: 'bg-cyan-400'
    },
    {
      label: 'Capacity Availability',
      weight: '20%',
      val: getNorm((scores as any).capacity ?? (scores as any).capacityScore),
      color: 'bg-brand-400'
    },
    {
      label: 'Distance Proximity',
      weight: '15%',
      val: getNorm((scores as any).distance ?? (scores as any).distanceScore),
      color: 'bg-emerald-400'
    },
    {
      label: 'Conversion Efficiency',
      weight: '15%',
      val: getNorm((scores as any).efficiency ?? (scores as any).efficiencyScore),
      color: 'bg-indigo-400'
    },
    {
      label: 'Carbon Benefit',
      weight: '15%',
      val: getNorm((scores as any).carbonBenefit ?? (scores as any).carbonBenefitScore),
      color: 'bg-teal-400'
    },
    {
      label: 'Logistics Cost',
      weight: '5%',
      val: getNorm((scores as any).logisticsCost ?? (scores as any).logisticsCostScore),
      color: 'bg-amber-400'
    }
  ];

  return (
    <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Multi-Criteria Weighted Breakdown</span>
        <span className="font-mono text-slate-500">Algorithm v2.0</span>
      </div>

      <div className="space-y-2">
        {metrics.map((m, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span>{m.label}</span>
                <span className="text-[10px] font-mono text-slate-500 font-semibold">({m.weight})</span>
              </span>
              <span className="font-mono font-bold text-slate-200">{m.val}%</span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${m.color} transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(5, m.val))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
