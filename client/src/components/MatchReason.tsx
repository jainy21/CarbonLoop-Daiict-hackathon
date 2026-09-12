import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface MatchReasonProps {
  reasons: string[];
  title?: string;
}

export const MatchReason: React.FC<MatchReasonProps> = ({ 
  reasons, 
  title = "Why was this facility recommended?" 
}) => {
  return (
    <div className="space-y-2">
      {title && (
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
          {title}
        </span>
      )}
      <ul className="space-y-1.5 text-xs text-slate-300">
        {reasons.map((reason, idx) => {
          const isWarning = reason.includes('⚠') || reason.toLowerCase().includes('secondary') || reason.toLowerCase().includes('constrained');
          const isInfo = reason.includes('ℹ') || reason.toLowerCase().includes('radius');
          
          return (
            <li key={idx} className="flex items-start gap-2">
              {isWarning ? (
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              ) : isInfo ? (
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <span className={isWarning ? 'text-amber-200' : isInfo ? 'text-cyan-200' : 'text-emerald-300'}>
                {reason.replace(/^[✓⚠ℹ]\s*/, '')}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
