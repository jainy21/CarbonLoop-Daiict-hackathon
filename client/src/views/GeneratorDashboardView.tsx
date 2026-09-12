import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { WasteBatch } from '../types/index.js';
import { BatchStatusBadge } from '../components/BatchStatusBadge.js';
import { 
  Leaf, 
  PlusCircle, 
  Scale, 
  TrendingUp, 
  Sparkles, 
  MapPin, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  CheckCircle2,
  Clock,
  Truck,
  Flame,
  QrCode
} from 'lucide-react';

interface GeneratorDashboardProps {
  onNavigateToCreateBatch: () => void;
  onNavigateToSmartMatch: () => void;
  onSelectBatch: (batch: WasteBatch) => void;
}

export const GeneratorDashboardView: React.FC<GeneratorDashboardProps> = ({
  onNavigateToCreateBatch,
  onNavigateToSmartMatch,
  onSelectBatch
}) => {
  const { user } = useAuth();
  const [myBatches, setMyBatches] = useState<WasteBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/waste-batches');
        if (res.ok) {
          const data = await res.json();
          setMyBatches(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const totalTonnes = myBatches.reduce((acc, b) => acc + (b.quantityTonnes || 0), 0) || 84.5;
  const activeBatches = myBatches.filter(b => b.status !== 'converted');
  const completedBatches = myBatches.filter(b => b.status === 'converted');
  const divertedTonnes = 61.2;
  const netCarbonImpact = 38.7;

  // Realistic recent activity events for the generator
  const recentActivities = [
    {
      id: 'act-1',
      title: 'Digital Carbon Passport Verified',
      batch: 'WL-1024',
      facility: 'BioChar Plant A (Sanand)',
      desc: 'Cryptographic certificate issued. Net CO₂e abatement verified: +8.40 tCO₂e.',
      time: '12 mins ago',
      icon: ShieldCheck,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'act-2',
      title: 'Conversion Pyrolysis Completed',
      batch: 'WL-1024',
      facility: 'BioChar Plant A',
      desc: '10 tonnes Rice Husk converted to 3.2 tonnes high-permanence Biochar.',
      time: '45 mins ago',
      icon: Flame,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 'act-3',
      title: 'Facility Intake Weighbridge Verified',
      batch: 'WL-1024',
      facility: 'Sanand Industrial Eco-Park',
      desc: 'Vehicle arrived at GIDC Gate 2. Tare weight: 6.2T, Gross: 16.2T verified.',
      time: '2 hours ago',
      icon: Building2,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    },
    {
      id: 'act-4',
      title: 'Route Planned & Dispatch Scheduled',
      batch: 'WL-1024',
      facility: 'Sanand Corridor',
      desc: '26.4 km lowest-emission route optimized (6.2 kgCO₂e transport footprint).',
      time: '4 hours ago',
      icon: Truck,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
    },
    {
      id: 'act-5',
      title: 'Smart Matching Evaluated',
      batch: 'WL-1024',
      facility: 'BioChar Plant A',
      desc: '92% weighted compatibility score assigned (feedstock compatibility: 100%).',
      time: '5 hours ago',
      icon: Sparkles,
      color: 'text-brand-400 bg-brand-500/10 border-brand-500/30'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-brand-500/30 bg-gradient-to-r from-brand-950/30 via-slate-900 to-slate-950 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              Waste Generator
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Ahmedabad, Gujarat
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
            Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-emerald-200 to-teal-300">{user?.organization || user?.name || 'Gujarat Agro Producer'}</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Register your organic & agricultural feedstock batches, connect to optimal biochar/biogas conversion facilities, and track verifiable carbon credits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onNavigateToCreateBatch}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 via-emerald-500 to-teal-400 hover:from-brand-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-brand-500/25 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>+ Create Waste Batch</span>
          </button>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-brand-400" />
            Total Waste Generated
          </span>
          <div className="text-2xl font-mono font-black text-emerald-300">
            {totalTonnes.toFixed(1)} <span className="text-xs font-normal text-slate-400">tonnes</span>
          </div>
          <div className="text-[11px] text-slate-500">Across declared batches</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            Diverted from Landfill
          </span>
          <div className="text-2xl font-mono font-black text-teal-300">
            {divertedTonnes.toFixed(1)} <span className="text-xs font-normal text-slate-400">tonnes</span>
          </div>
          <div className="text-[11px] text-teal-400/80">72.4% circular diversion rate</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Active Waste Batches
          </span>
          <div className="text-2xl font-mono font-black text-cyan-300">
            {activeBatches.length || 4} <span className="text-xs font-normal text-slate-400">batches</span>
          </div>
          <div className="text-[11px] text-cyan-400/80">Evaluating, matched & in transit</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-500/30">
          <span className="text-xs text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Estimated Carbon Impact
          </span>
          <div className="text-2xl font-mono font-black text-emerald-300">
            +{netCarbonImpact.toFixed(1)} <span className="text-xs font-normal text-slate-400">tCO₂e</span>
          </div>
          <div className="text-[11px] text-emerald-400">Net avoided greenhouse emissions</div>
        </div>
      </div>

      {/* Flagship Fast Action Card */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 fill-current text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">
              Active Demonstration Batch: WL-1024 (10 Tonnes Rice Husk)
            </h4>
            <p className="text-xs text-slate-400">
              Ahmedabad APMC → Matched 92% to BioChar Plant A (Sanand) • ₹2,138 logistics • +10.9 tCO₂e net carbon
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToSmartMatch}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <span>Run Smart Matcher</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Active Batches Table */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-brand-400" />
            Active Waste Batches
          </h3>
          <button
            type="button"
            onClick={onNavigateToCreateBatch}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Create Waste Batch</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase">
                <th className="py-3 px-4">Batch ID</th>
                <th className="py-3 px-4">Feedstock</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Primary Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {myBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-900/60 cursor-pointer" onClick={() => onSelectBatch(batch)}>
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-300">
                    {batch.trackingNumber || batch.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-200">
                    {batch.wasteType}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-emerald-300">
                    {batch.quantityTonnes} tonnes
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {batch.origin.city}
                  </td>
                  <td className="py-3.5 px-4 text-indigo-300 truncate max-w-[180px]">
                    {batch.facilityName || 'Matching Engine Pending'}
                  </td>
                  <td className="py-3.5 px-4">
                    <BatchStatusBadge status={batch.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-xs text-brand-400 font-semibold flex items-center justify-end gap-1 hover:text-brand-300">
                      <span>View Journey</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Timeline Section */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Recent Value-Chain Activity
          </h3>
          <span className="text-[11px] font-mono text-slate-500">Live Provenance Ledger</span>
        </div>

        <div className="space-y-3">
          {recentActivities.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-slate-200">{act.title}</h5>
                      <span className="text-[10px] font-mono font-bold text-brand-400 bg-brand-500/10 px-1.5 py-0.2 rounded border border-brand-500/30">
                        {act.batch}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{act.desc}</p>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500">
                  {act.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
