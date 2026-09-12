import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { WasteBatch, Facility, BatchStatus } from '../types/index.js';
import { BatchStatusBadge } from '../components/BatchStatusBadge.js';
import { 
  Building2, 
  Flame, 
  Scale, 
  TrendingUp, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Play
} from 'lucide-react';

interface FacilityOperatorDashboardProps {
  onNavigateToTab: (tab: any) => void;
  onSelectBatchForDetail: (batch: WasteBatch) => void;
}

export const FacilityOperatorDashboardView: React.FC<FacilityOperatorDashboardProps> = ({
  onNavigateToTab,
  onSelectBatchForDetail
}) => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchIncomingBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/waste-batches');
      if (res.ok) {
        const data = await res.json();
        setBatches(data);
      }
    } catch (err) {
      console.warn('Facility batches error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomingBatches();
  }, []);

  const handleUpdateStatus = async (batchId: string, nextStatus: BatchStatus) => {
    try {
      setActionLoadingId(batchId);
      const res = await fetch(`/api/waste-batches/${batchId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          actor: user?.name || 'Sanand Plant Manager',
          location: 'Sanand Industrial Eco-Park, Gujarat',
          description: `Facility intake processed. Advanced to ${nextStatus}.`
        })
      });
      if (res.ok) {
        const result = await res.json();
        setBatches(prev => prev.map(b => b.id === batchId ? result.batch : b));
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const incomingBatches = batches.filter(b => b.status === 'matched' || b.status === 'in_transit' || b.status === 'collection_scheduled');
  const activeConverting = batches.filter(b => b.status === 'received' || b.status === 'converting');
  const convertedBatches = batches.filter(b => b.status === 'converted');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-950 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              FACILITY OPERATOR PORTAL
            </span>
            <span className="text-xs text-slate-400">
              Plant: <strong className="text-slate-200">{user?.organization || 'BioChar Plant A (Sanand Eco-Park)'}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
            Conversion Facility Intake & Pyrolysis Control
          </h1>
          <p className="text-xs text-slate-400">
            Manage incoming agricultural feedstock shipments, weighbridge intake logs, active carbonization, and verifiable passport generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchIncomingBatches}
            disabled={loading}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* Facility Operations KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-cyan-400" />
            Incoming Shipments
          </span>
          <div className="text-2xl font-mono font-black text-cyan-300">
            {incomingBatches.length} <span className="text-xs font-normal text-slate-400">Batches</span>
          </div>
          <div className="text-[11px] text-slate-500">In-transit & scheduled</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Active Pyrolysis
          </span>
          <div className="text-2xl font-mono font-black text-amber-300">
            {activeConverting.length} <span className="text-xs font-normal text-slate-400">In Process</span>
          </div>
          <div className="text-[11px] text-amber-400/80">Reactor temp: 650°C stable</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-brand-400" />
            Daily Available Capacity
          </span>
          <div className="text-2xl font-mono font-black text-brand-300">
            45 / 80 <span className="text-xs font-normal text-slate-400">t/day</span>
          </div>
          <div className="text-[11px] text-brand-400">56% capacity available</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1 bg-emerald-950/30 border-emerald-500/30">
          <span className="text-xs text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Carbon Fixed (Month)
          </span>
          <div className="text-2xl font-mono font-black text-emerald-300">
            +314.8 <span className="text-xs font-normal text-slate-400">tCO₂e</span>
          </div>
          <div className="text-[11px] text-emerald-400">Stable biogenic biochar</div>
        </div>
      </div>

      {/* Incoming Batches Action Table */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            Shipment Intake & Batch Conversion Pipeline
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {batches.length} total batches in system
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase">
                <th className="py-3 px-4">Batch ID</th>
                <th className="py-3 px-4">Material & Tonnage</th>
                <th className="py-3 px-4">Origin Hub</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-center">Quick Operator Action</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {batches.map((batch) => {
                const isProcessing = actionLoadingId === batch.id;
                return (
                  <tr key={batch.id} className="hover:bg-slate-900/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-300">
                      {batch.trackingNumber || batch.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-200">{batch.wasteType}</div>
                      <div className="text-[11px] text-emerald-400 font-mono font-semibold">
                        {batch.quantityTonnes} Tonnes
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-300">{batch.origin.city}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                        {batch.origin.address}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <BatchStatusBadge status={batch.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {batch.status === 'matched' && (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleUpdateStatus(batch.id, 'collection_scheduled')}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-colors"
                        >
                          Accept & Schedule Pickup
                        </button>
                      )}

                      {batch.status === 'collection_scheduled' && (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleUpdateStatus(batch.id, 'in_transit')}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-colors"
                        >
                          Mark Dispatched (In Transit)
                        </button>
                      )}

                      {batch.status === 'in_transit' && (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleUpdateStatus(batch.id, 'received')}
                          className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition-colors"
                        >
                          Log Weighbridge Intake (Received)
                        </button>
                      )}

                      {batch.status === 'received' && (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleUpdateStatus(batch.id, 'converting')}
                          className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[11px] transition-colors"
                        >
                          Load Reactor (Start Pyrolysis)
                        </button>
                      )}

                      {batch.status === 'converting' && (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleUpdateStatus(batch.id, 'converted')}
                          className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-colors"
                        >
                          Complete & Issue Passport
                        </button>
                      )}

                      {batch.status === 'converted' && (
                        <span className="text-[11px] text-emerald-400 font-mono flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Certified & Verified
                        </span>
                      )}

                      {batch.status === 'generated' && (
                        <span className="text-[11px] text-slate-500 italic">
                          Awaiting Match Engine
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectBatchForDetail(batch)}
                        className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
                      >
                        Inspect Trace →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
