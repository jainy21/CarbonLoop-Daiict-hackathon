import React from 'react';
import { BatchEvent, BatchStatus } from '../types/index.js';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  User, 
  Sparkles, 
  Target, 
  CalendarClock, 
  Truck, 
  Building2, 
  Flame, 
  TrendingUp,
  Hash
} from 'lucide-react';

interface PassportTimelineProps {
  events?: BatchEvent[];
  currentStatus?: BatchStatus | string;
  className?: string;
  isCompact?: boolean;
}

interface TimelineStageDefinition {
  key: string;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  defaultDescription: string;
}

const PASSPORT_STAGES: TimelineStageDefinition[] = [
  {
    key: 'generated',
    label: 'Waste Generated',
    icon: Sparkles,
    colorClass: 'text-amber-400',
    defaultDescription: 'Declared at generator origin hub with feedstock quality verification.'
  },
  {
    key: 'matched',
    label: 'Facility Matched',
    icon: Target,
    colorClass: 'text-cyan-400',
    defaultDescription: 'Ranked by Smart Matching Algorithm with compatibility & capacity scores.'
  },
  {
    key: 'collection_scheduled',
    label: 'Collection Scheduled',
    icon: CalendarClock,
    colorClass: 'text-indigo-400',
    defaultDescription: 'Optimized logistics dispatch scheduled with transport corridor.'
  },
  {
    key: 'in_transit',
    label: 'In Transit',
    icon: Truck,
    colorClass: 'text-blue-400',
    defaultDescription: 'Transport vehicle underway with live telemetry and GPS tracking.'
  },
  {
    key: 'received',
    label: 'Facility Received',
    icon: Building2,
    colorClass: 'text-purple-400',
    defaultDescription: 'Weighbridge check-in and automated feedstock moisture calibration.'
  },
  {
    key: 'converting',
    label: 'Conversion Completed',
    icon: Flame,
    colorClass: 'text-emerald-400',
    defaultDescription: 'Pyrolysis / biological conversion process executed with high carbon retention.'
  },
  {
    key: 'converted',
    label: 'Carbon Impact Calculated',
    icon: TrendingUp,
    colorClass: 'text-emerald-300',
    defaultDescription: 'Avoided methane + biochar C-fixation verified into immutable ledger.'
  },
];

export const PassportTimeline: React.FC<PassportTimelineProps> = ({
  events = [],
  currentStatus = 'converted',
  className = '',
  isCompact = false
}) => {
  // Map stage completion status
  const getStageStatus = (stageKey: string, index: number) => {
    // If status is 'converted' or 'VERIFIED', all 7 stages are completed
    if (currentStatus === 'converted' || currentStatus === 'VERIFIED') {
      return { isCompleted: true, isCurrent: index === PASSPORT_STAGES.length - 1 };
    }

    const statusKeys = PASSPORT_STAGES.map((s) => s.key);
    const currentIndex = statusKeys.indexOf(currentStatus as string);

    if (currentIndex === -1) {
      return { isCompleted: index === 0, isCurrent: index === 0 };
    }

    return {
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
    };
  };

  // Find matching event from actual BatchEvent data
  const findEventForStage = (stageKey: string, index: number): BatchEvent | undefined => {
    if (!events || events.length === 0) return undefined;

    // Direct status match
    const directMatch = events.find(
      (e) =>
        e.status?.toLowerCase() === stageKey.toLowerCase() ||
        (stageKey === 'converting' && e.status === 'converting') ||
        (stageKey === 'converted' && (e.status === 'converted' || e.title?.toLowerCase().includes('carbon')))
    );
    if (directMatch) return directMatch;

    // If events array has entries by order
    if (index < events.length) {
      return events[index];
    }

    return undefined;
  };

  if (isCompact) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
          {PASSPORT_STAGES.map((stage, idx) => {
            const { isCompleted, isCurrent } = getStageStatus(stage.key, idx);
            const Icon = stage.icon;
            return (
              <div
                key={stage.key}
                className={`p-2 rounded-xl border text-center transition-all ${
                  isCompleted
                    ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300'
                    : isCurrent
                    ? 'bg-slate-900 border-brand-500/50 text-brand-300 ring-1 ring-brand-500/30'
                    : 'bg-slate-950/40 border-slate-800/40 text-slate-600 opacity-60'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Circle className="w-3 h-3 text-slate-600" />
                  )}
                </div>
                <span className="text-[10px] font-bold block leading-tight truncate">
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-brand-400" />
          Passport Traceability Timeline
        </h4>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          7-Stage Verifiable Journey Log
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-brand-400 before:via-emerald-400 before:to-teal-500">
        {PASSPORT_STAGES.map((stage, idx) => {
          const { isCompleted, isCurrent } = getStageStatus(stage.key, idx);
          const matchedEvent = findEventForStage(stage.key, idx);
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="relative group">
              {/* Node indicator */}
              <div
                className={`absolute -left-[30px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${
                  isCompleted
                    ? 'bg-slate-900 border-emerald-400 text-emerald-300 shadow-emerald-500/20'
                    : isCurrent
                    ? 'bg-slate-900 border-brand-400 text-brand-300 ring-2 ring-brand-400/30'
                    : 'bg-slate-950 border-slate-700 text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-2 h-2" />
                )}
              </div>

              {/* Event Card */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/30'
                    : isCurrent
                    ? 'bg-slate-900/90 border-brand-500/40 shadow-md shadow-brand-500/5'
                    : 'bg-slate-950/40 border-slate-800/40 opacity-50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${isCompleted ? stage.colorClass : 'text-slate-500'}`} />
                    <span className={`text-xs font-bold ${isCompleted ? 'text-slate-100' : 'text-slate-500'}`}>
                      {stage.label}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {matchedEvent?.timestamp && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(matchedEvent.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      • {new Date(matchedEvent.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {matchedEvent?.description || stage.defaultDescription}
                </p>

                {matchedEvent && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400">
                    {matchedEvent.location && (
                      <span className="flex items-center gap-1 text-cyan-300/90">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {matchedEvent.location}
                      </span>
                    )}
                    {matchedEvent.actor && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <User className="w-3 h-3 text-brand-400" />
                        {matchedEvent.actor}
                      </span>
                    )}
                    {matchedEvent.txHash && (
                      <span className="flex items-center gap-1 text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        <Hash className="w-2.5 h-2.5 text-slate-500" />
                        {matchedEvent.txHash}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
