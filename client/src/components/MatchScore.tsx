import React from 'react';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MatchScore: React.FC<MatchScoreProps> = ({ 
  score, 
  size = 'md',
  showLabel = true 
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-brand-400 border-brand-500/40 bg-brand-500/10';
    if (val >= 70) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    if (val >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const sizeClasses = {
    sm: 'text-lg px-2.5 py-1',
    md: 'text-2xl px-3.5 py-1.5',
    lg: 'text-4xl px-5 py-2.5'
  };

  return (
    <div className="flex flex-col items-end">
      <div
        className={`font-mono font-black rounded-xl border flex items-baseline gap-0.5 ${getScoreColor(
          score
        )} ${sizeClasses[size]}`}
      >
        <span>{score}</span>
        <span className="text-xs opacity-70 font-sans font-bold">%</span>
      </div>
      {showLabel && (
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">
          Match Score
        </span>
      )}
    </div>
  );
};
