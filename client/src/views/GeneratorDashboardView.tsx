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
  Clock
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

  const totalTonnes = myBatches.reduce((acc, b) => acc + (b.quantityTonnes || 0), 0);
  const activeBatches = myBatches.filter(b => b.status !== 'converted');
  const completedBatches = myBatches.filter(b => b.status === 'converted');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-brand-500/30 bg-gradient-to-r from-brand-950/30 via-slate-900 to-slate-950 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              WASTE GENERATOR PORTAL
            </span>
            <span className="text-xs text-slate-400">
              Producer: <strong className="text-slate-200">{user?.name || 'Gujarat Agro Producer Cooperative'}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
            Feedstock Traceability & Value Chain Dashboard
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Declare organic waste batches, discover optimal biochar and biogas facilities in Gujarat, and monitor real-time carbon offset realization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onNavigateToCreateBatch}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-bold text-xs tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Create Waste Batch</span>
          </button>
        </div>
      </div>

      {/* Generator KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-brand-400" />
            My Registered Volume
          </span>
          <div className="text-2xl font-mono font-black text-emerald-300">
            {totalTonnes.toFixed(1)} <span className="text-xs font-normal text-slate-400">Tonnes</span>
          </div>
          <div className="text-[11px] text-slate-500">Across all declared batches</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Active Journeys
          </span>
          <div className="text-2xl font-mono font-black text-cyan-300">
            {activeBatches.length} <span className="text-xs font-normal text-slate-400">In Transit/Process</span>
          </div>
          <div className="text-[11px] text-cyan-400/80">Matched & en route</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Total Net Carbon Impact
          </span>
          <div className="text-2xl font-mono font-black text-emerald-300">
            +32.4 <span className="text-xs font-normal text-slate-400">tCO₂e</span>
          </div>
          <div className="text-[11px] text-emerald-400">Diverted from landfill</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1 bg-gradient-to-br from-slate-900 to-emerald-950/30 border-emerald-500/30">
          <span className="text-xs text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verifiable Passports
          </span>
          <div className="text-2xl font-mono font-black text-emerald-300">
            {completedBatches.length || 1} <span className="text-xs font-normal text-slate-400">Issued</span>
          </div>
          <div className="text-[11px] text-emerald-400">QR certificates generated</div>
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
              Demo Fast-Track: 10 Tonnes Rice Husk (Ahmedabad APMC)
            </h4>
            <p className="text-xs text-slate-400">
              Ranked with 92% match to BioChar Plant A in Sanand with ~8.4 tCO₂e net carbon benefit.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToSmartMatch}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
        >
          <span>Run Smart Matcher</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* My Batches Table */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-brand-400" />
            My Waste Batch Traceability Ledger
          </h3>
          <button
            type="button"
            onClick={onNavigateToCreateBatch}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Batch</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase">
                <th className="py-3 px-4">Batch ID</th>
                <th className="py-3 px-4">Feedstock</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Pickup Origin</th>
                <th className="py-3 px-4">Assigned Facility</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
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
                    {batch.quantityTonnes} Tonnes
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
                    <span className="text-xs text-brand-400 font-semibold flex items-center justify-end gap-1">
                      <span>View Trace</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
