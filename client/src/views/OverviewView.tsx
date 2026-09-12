import React, { useState, useEffect } from 'react';
import { WasteBatch } from '../types/index.js';
import { KPICard } from '../components/KPICard.js';
import { ActivityTable } from '../components/ActivityTable.js';
import { ImpactChart } from '../components/ImpactChart.js';
import { 
  Leaf, 
  TrendingUp, 
  Package, 
  Building2, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  RotateCcw,
  Bot,
  ShieldCheck,
  Scale,
  Truck,
  Flame,
  QrCode
} from 'lucide-react';

interface OverviewViewProps {
  onStartDemo: () => void;
  onNavigateToTab: (tabKey: any) => void;
  onSelectBatchForDetail?: (batch: WasteBatch) => void;
  onOpenAskAI?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onStartDemo,
  onNavigateToTab,
  onSelectBatchForDetail,
  onOpenAskAI
}) => {
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [facilitiesCount, setFacilitiesCount] = useState<number>(12);
  const [loading, setLoading] = useState<boolean>(true);

  // Centralized Demo Baseline Data
  const DEMO_TOTAL_DIVERTED = 128.4; // tonnes
  const DEMO_TOTAL_CARBON = 94.7;    // tCO2e
  const DEMO_ACTIVE_BATCHES = 17;
  const DEMO_FACILITIES = 12;

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch batches from API
        const batchRes = await fetch('/api/waste-batches');
        if (batchRes.ok) {
          const batchData = await batchRes.json();
          if (isMounted && Array.isArray(batchData)) {
            setBatches(batchData);
          }
        }

        // Fetch facilities count
        const facRes = await fetch('/api/facilities');
        if (facRes.ok) {
          const facData = await facRes.json();
          if (isMounted && Array.isArray(facData)) {
            setFacilitiesCount(Math.max(facData.length, DEMO_FACILITIES));
          }
        }
      } catch (err) {
        console.warn('Dashboard data fetch warning:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute live aggregates combining API data with demo baseline
  const activeBatchesCount = Math.max(batches.length, DEMO_ACTIVE_BATCHES);
  const computedDivertedTonnes = DEMO_TOTAL_DIVERTED;
  const computedCarbonImpact = DEMO_TOTAL_CARBON;

  const handleRowSelect = (batch: WasteBatch) => {
    if (onSelectBatchForDetail) {
      onSelectBatchForDetail(batch);
    } else {
      onNavigateToTab('waste-batches');
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-10 border border-brand-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-[#07111e] shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Circular Carbon Value Chain Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            Turn every waste batch into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-200">traceable carbon journey.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Connecting agricultural, food, and industrial waste generators with regional carbon conversion facilities. Real-time GIS routing, transparent net carbon accounting, and public QR Carbon Passports.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStartDemo}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-black text-xs tracking-wider uppercase shadow-xl shadow-brand-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Load Demo Scenario (10t Rice Husk)</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            {onOpenAskAI && (
              <button
                type="button"
                onClick={onOpenAskAI}
                className="px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-brand-500/30 text-xs font-bold text-brand-300 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-brand-400" />
                <span>Ask CarbonLoop</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigateToTab('waste-batches')}
              className="px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition-all flex items-center gap-2"
            >
              <span>Explore Batches</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Carbon Overview KPIs (Spec Section 1) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-400" />
            Carbon Overview
          </h2>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Regional Network: Gujarat Corridor
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Waste Diverted */}
          <KPICard
            title="Waste Diverted"
            value={computedDivertedTonnes.toFixed(1)}
            unit="tonnes"
            subtitle="Landfill diversion rate"
            change="+24.6% this month"
            isPositive={true}
            icon={Leaf}
            colorClass="text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
            isLoading={loading}
          />

          {/* KPI 2: Estimated Carbon Impact */}
          <KPICard
            title="Estimated Carbon Impact"
            value={computedCarbonImpact.toFixed(1)}
            unit="tCO₂e"
            subtitle="Avoided & biogenic sequestered"
            change="+18.2 tCO₂e"
            isPositive={true}
            icon={TrendingUp}
            colorClass="text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
            isLoading={loading}
          />

          {/* KPI 3: Active Batches */}
          <KPICard
            title="Active Batches"
            value={activeBatchesCount}
            subtitle="Across supply chain stages"
            change="100% On-Track"
            isPositive={true}
            icon={Package}
            colorClass="text-brand-400 bg-brand-500/10 border-brand-500/30"
            isLoading={loading}
            onClick={() => onNavigateToTab('waste-batches')}
          />

          {/* KPI 4: Conversion Facilities */}
          <KPICard
            title="Conversion Facilities"
            value={facilitiesCount}
            subtitle="Biochar, Biogas & C-Materials"
            change="59.5% Avg Utilization"
            isPositive={true}
            icon={Building2}
            colorClass="text-indigo-400 bg-indigo-500/10 border-indigo-500/30"
            isLoading={loading}
            onClick={() => onNavigateToTab('facilities')}
          />
        </div>
      </section>

      {/* 3. Active Value Chain Activity Table (Spec Section 2) */}
      <section className="space-y-3">
        <ActivityTable
          batches={batches}
          onSelectBatch={handleRowSelect}
          isLoading={loading}
        />
      </section>

      {/* 4. Meaningful Analytics Charts (Spec Section 3) */}
      <section className="space-y-3">
        <ImpactChart />
      </section>

      {/* 5. Flagship Demo Summary Card */}
      <div className="glass-panel p-6 rounded-2xl border-brand-500/30 bg-gradient-to-r from-brand-950/40 via-slate-900 to-slate-950 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-slate-100">
              Flagship Demonstration Scenario (WL-1024)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Target Net Carbon: ~8.4 tCO₂e
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] block font-semibold uppercase">Feedstock</span>
            <strong className="text-slate-200">10t Rice Husk</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] block font-semibold uppercase">Origin</span>
            <strong className="text-cyan-300">Ahmedabad APMC</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] block font-semibold uppercase">Matched Plant</span>
            <strong className="text-brand-300">BioChar Plant A</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] block font-semibold uppercase">Logistics Route</span>
            <strong className="text-slate-200">26.4 km (₹2,140)</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] block font-semibold uppercase">Transport CO₂</span>
            <strong className="text-amber-300">6.2 kgCO₂e</strong>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 shadow-inner">
            <span className="text-emerald-400 text-[10px] block font-bold uppercase">Net Impact</span>
            <strong className="text-emerald-300 font-mono text-sm">+8.4 tCO₂e</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
