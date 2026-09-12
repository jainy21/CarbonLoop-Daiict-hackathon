import React from 'react';
import { Gauge, Sparkles } from 'lucide-react';

interface RouteScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const RouteScore: React.FC<RouteScoreProps> = ({
  score,
  size = 'md',
  showLabel = true
}) => {
  const getBadgeStyle = (val: number) => {
    if (val >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (val >= 70) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (val >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1 font-bold',
    lg: 'text-lg px-4 py-1.5 font-black'
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`font-mono rounded-lg border flex items-center gap-1.5 ${getBadgeStyle(
          score
        )} ${sizeStyles[size]}`}
      >
        <Gauge className="w-3.5 h-3.5" />
        <span>Eco-Score: {score}/100</span>
      </div>
      {showLabel && (
        <span className="text-[10px] text-slate-400 font-mono">
          (Distance + Cost + Emissions index)
        </span>
      )}
    </div>
  );
};
