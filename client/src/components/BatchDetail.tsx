import React, { useState } from 'react';
import { WasteBatch, BatchStatus } from '../types/index.js';
import { BatchStatusBadge, STATUS_CONFIG } from './BatchStatusBadge.js';
import { BatchTimeline } from './BatchTimeline.js';
import { 
  Scale, 
  MapPin, 
  Building2, 
  Calendar, 
  Droplet, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Compass, 
  ShieldCheck, 
  Play,
  RotateCcw,
  Zap,
  ExternalLink,
  Truck
} from 'lucide-react';

interface BatchDetailProps {
  batch: WasteBatch;
  onStatusChange: (batchId: string, nextStatus: BatchStatus) => Promise<void>;
  onNavigateToModule?: (moduleKey: string) => void;
}

const LIFECYCLE_STEPS: BatchStatus[] = [
  'generated',
  'matched',
  'collection_scheduled',
  'in_transit',
  'received',
  'converting',
  'converted'
];

export const BatchDetail: React.FC<BatchDetailProps> = ({
  batch,
  onStatusChange,
  onNavigateToModule
}) => {
  const [isAdvancing, setIsAdvancing] = useState(false);
  const currentIndex = LIFECYCLE_STEPS.indexOf(batch.status);
  const nextStatus =
    currentIndex < LIFECYCLE_STEPS.length - 1
      ? LIFECYCLE_STEPS[currentIndex + 1]
      : null;

  const handleAdvance = async () => {
    if (!nextStatus || isAdvancing) return;
    try {
      setIsAdvancing(true);
      await onStatusChange(batch.id, nextStatus);
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleResetToGenerated = async () => {
    if (isAdvancing) return;
    try {
      setIsAdvancing(true);
      await onStatusChange(batch.id, 'generated');
    } finally {
      setIsAdvancing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Batch Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/30">
                {batch.trackingNumber || batch.id}
              </span>
              <span className="text-xs text-slate-400">
                Registered by <strong className="text-slate-200">{batch.generatorName}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
              <span>{batch.wasteType}</span>
              <span className="text-slate-500 font-normal text-lg">/</span>
              <span className="text-emerald-400 font-mono text-xl">{batch.quantityTonnes} Tonnes</span>
            </h2>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Current State</span>
            <BatchStatusBadge status={batch.status} size="lg" />
          </div>
        </div>

        {/* Quick Lifecycle Progress Bar */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span>Lifecycle Progress</span>
            <span className="font-mono text-brand-400 font-semibold">
              Step {currentIndex + 1} of 7 ({STATUS_CONFIG[batch.status].label})
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {LIFECYCLE_STEPS.map((step, idx) => {
              const isPassed = idx <= currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all ${
                    isCurrent
                      ? 'bg-brand-400 ring-2 ring-brand-400/40'
                      : isPassed
                      ? 'bg-emerald-500'
                      : 'bg-slate-800'
                  }`}
                  title={STATUS_CONFIG[step].label}
                />
              );
            })}
          </div>
        </div>

        {/* Controlled Demo Advancer Toolbar */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-amber-300">Controlled Hackathon Demo Advancer:</span>
            <span className="text-slate-400 hidden sm:inline">Simulate batch progression across value chain</span>
          </div>

          <div className="flex items-center gap-2">
            {nextStatus ? (
              <button
                type="button"
                onClick={handleAdvance}
                disabled={isAdvancing}
                className="px-3.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/10 disabled:opacity-50 cursor-pointer"
              >
                {isAdvancing ? (
                  <>
                    <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Advancing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Advance to: {STATUS_CONFIG[nextStatus].label}</span>
                  </>
                )}
              </button>
            ) : (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Batch Fully Converted & Verified
              </span>
            )}

            <button
              type="button"
              onClick={handleResetToGenerated}
              disabled={isAdvancing}
              title="Reset state to generated"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Key Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Origin */}
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 uppercase font-semibold">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            Origin Hub
          </div>
          <div className="text-sm font-bold text-slate-100">{batch.origin.city}, {batch.origin.state}</div>
          <div className="text-[11px] text-slate-400 truncate">{batch.origin.address}</div>
          <div className="text-[10px] font-mono text-slate-500">
            {batch.origin.lat.toFixed(4)}°N, {batch.origin.lng.toFixed(4)}°E
          </div>
        </div>

        {/* Assigned Facility */}
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 uppercase font-semibold">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Assigned Facility
          </div>
          <div className="text-sm font-bold text-slate-100 truncate">
            {batch.facilityName || 'Matching Engine Pending'}
          </div>
          <div className="text-[11px] text-slate-400">
            Target Pathway: <span className="text-brand-300 font-semibold">{batch.preferredConversion}</span>
          </div>
          <div className="text-[10px] text-indigo-300 font-mono">
            {batch.facilityId ? 'Verified Partner ID: ' + batch.facilityId : 'Run Smart Matcher'}
          </div>
        </div>

        {/* Material Quality */}
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 uppercase font-semibold">
            <Droplet className="w-3.5 h-3.5 text-amber-400" />
            Quality & Moisture
          </div>
          <div className="text-sm font-bold text-slate-100">
            {batch.moistureContentPercent !== undefined ? `${batch.moistureContentPercent}% Moisture` : 'Standard Grade'}
          </div>
          <div className="text-[11px] text-slate-400">
            Category: <span className="text-slate-300">{batch.category}</span>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            Created {new Date(batch.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Carbon Impact Realized */}
        <div className="glass-panel p-4 rounded-xl space-y-1 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-500/20">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 uppercase font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Est. Carbon Impact
          </div>
          <div className="text-xl font-mono font-black text-emerald-300">
            {batch.estimatedCarbonImpactTonnesCO2e
              ? `+${batch.estimatedCarbonImpactTonnesCO2e.toFixed(1)} tCO₂e`
              : '+10.9 tCO₂e'}
          </div>
          <div className="text-[11px] text-emerald-400/80">
            Diverted from Landfill
          </div>
          <div className="text-[10px] text-slate-500">
            Carbon Passport Ready
          </div>
        </div>
      </div>

      {/* Active In-Transit Journey Tracking Banner (Spec Section 17) */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Active Value-Chain Transit Tracker
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                  {batch.status === 'in_transit' ? '🚛 IN TRANSIT' : batch.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {batch.origin.city} → {batch.facilityName || 'BioChar Plant A (Sanand)'} • 26.4 km Total Corridor
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">Estimated Arrival</span>
            <span className="text-sm font-mono font-bold text-cyan-300">ETA: 24 minutes</span>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{batch.origin.city} APMC</span>
            </span>
            <span className="text-cyan-300 font-bold">18.7 / 26.4 km completed (70.8%)</span>
            <span className="text-slate-300 flex items-center gap-1.5">
              <span>Sanand GIDC</span>
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 relative overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400 transition-all duration-500 relative"
              style={{ width: '70.8%' }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white animate-ping" />
            </div>
          </div>
        </div>

        {/* Dispatch & Transit Milestones */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-sans border-t border-slate-800/80">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-slate-500 font-mono block">09:30 AM</span>
            <span className="text-emerald-400 font-semibold">✓ Pickup Confirmed</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-slate-500 font-mono block">09:42 AM</span>
            <span className="text-emerald-400 font-semibold">✓ Vehicle Departed</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-cyan-500/30">
            <span className="text-cyan-400 font-mono block">10:05 AM</span>
            <span className="text-cyan-300 font-bold">● En Route (Expressway)</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-slate-500 font-mono block">10:29 AM</span>
            <span className="text-slate-400">○ Expected Intake Check-in</span>
          </div>
        </div>
      </div>

      {/* Cross-Module Navigation Callout (for Dev 2, 3, 4 handoffs) */}
      {onNavigateToModule && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-brand-400" />
              Connected Platform Modules
            </div>
            <p className="text-[11px] text-slate-400">
              Pass this batch payload to downstream matching, routing, carbon accounting, or passport generation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToModule('matching')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-brand-300 border border-slate-700 transition-colors flex items-center gap-1"
            >
              <span>Smart Matcher</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateToModule('logistics')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-cyan-300 border border-slate-700 transition-colors flex items-center gap-1"
            >
              <span>GIS Logistics</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateToModule('passport')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-emerald-300 border border-slate-700 transition-colors flex items-center gap-1"
            >
              <span>Carbon Passport</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Traceability Timeline */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800">
        <BatchTimeline
          batchId={batch.id}
          currentStatus={batch.status}
        />
      </div>
    </div>
  );
};
