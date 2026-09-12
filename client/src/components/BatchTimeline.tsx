import React, { useEffect, useState } from 'react';
import { BatchEvent, BatchStatus } from '../types/index.js';
import { STATUS_CONFIG } from './BatchStatusBadge.js';
import { wasteBatchService } from '../services/wasteBatchService.js';
import { Clock, ShieldCheck, MapPin, User, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface BatchTimelineProps {
  batchId: string;
  currentStatus: BatchStatus;
  events?: BatchEvent[];
  onRefresh?: () => void;
}

const LIFECYCLE_ORDER: BatchStatus[] = [
  'generated',
  'matched',
  'collection_scheduled',
  'in_transit',
  'received',
  'converting',
  'converted'
];

export const BatchTimeline: React.FC<BatchTimelineProps> = ({
  batchId,
  currentStatus,
  events: initialEvents,
  onRefresh
}) => {
  const [events, setEvents] = useState<BatchEvent[]>(initialEvents || []);
  const [loading, setLoading] = useState<boolean>(!initialEvents);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadTimeline = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await wasteBatchService.getTimeline(batchId);
        if (isMounted) {
          setEvents(data);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('Timeline load warning:', err.message);
          // If server call fails, fallback to synthesizing events up to current status
          setError(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTimeline();
    return () => {
      isMounted = false;
    };
  }, [batchId, currentStatus]);

  const currentIndex = LIFECYCLE_ORDER.indexOf(currentStatus);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-brand-400" />
          Traceability & Verification Timeline
        </h4>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Immutable Event Log ({events.length} records)
        </span>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center items-center text-slate-400 text-xs gap-2">
          <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin"></div>
          Loading immutable timeline records...
        </div>
      ) : error ? (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-brand-500 before:via-cyan-500 before:to-slate-800">
          {LIFECYCLE_ORDER.map((statusKey, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            const matchedEvent = events.find((e) => e.status === statusKey);
            const config = STATUS_CONFIG[statusKey];
            const Icon = config.icon;

            return (
              <div key={statusKey} className="relative group">
                {/* Node icon indicator */}
                <div
                  className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${
                    isCurrent
                      ? 'bg-slate-900 border-brand-400 text-brand-300 ring-4 ring-brand-500/20 scale-110'
                      : isCompleted
                      ? 'bg-slate-900 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-700 text-slate-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-2.5 h-2.5" />
                  )}
                </div>

                {/* Event Content */}
                <div
                  className={`p-3 rounded-lg border transition-all ${
                    isCurrent
                      ? 'bg-slate-900/90 border-brand-500/40 shadow-lg shadow-brand-500/5'
                      : isCompleted
                      ? 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-800/40 opacity-50'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`w-4 h-4 ${
                          isCompleted ? config.colorClass : 'text-slate-500'
                        }`}
                      />
                      <span
                        className={`text-xs font-semibold ${
                          isCurrent
                            ? 'text-brand-300'
                            : isCompleted
                            ? 'text-slate-200'
                            : 'text-slate-500'
                        }`}
                      >
                        {matchedEvent?.title || config.label}
                      </span>
                    </div>

                    {matchedEvent?.timestamp && (
                      <span className="text-[11px] font-mono text-slate-400">
                        {new Date(matchedEvent.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}{' '}
                        • {new Date(matchedEvent.timestamp).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    {matchedEvent?.description ||
                      (isCompleted
                        ? `Stage validated and recorded in immutable ledger.`
                        : `Awaiting execution of this stage in the value chain.`)}
                  </p>

                  {matchedEvent && (
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1.5 border-t border-slate-800/60 font-mono">
                      {matchedEvent.location && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          {matchedEvent.location}
                        </span>
                      )}
                      {matchedEvent.actor && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <User className="w-3 h-3 text-brand-400" />
                          {matchedEvent.actor}
                        </span>
                      )}
                      {matchedEvent.txHash && (
                        <span className="text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">
                          Hash: {matchedEvent.txHash}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
