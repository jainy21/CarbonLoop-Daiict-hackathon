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
  Play,
  Check,
  X,
  Sparkles,
  MapPin,
  Droplet,
  Layers,
  FileCheck2,
  QrCode,
  ExternalLink,
  Cpu,
  User,
  Activity,
  Calendar
} from 'lucide-react';

interface FacilityOperatorDashboardProps {
  onNavigateToTab: (tab: any) => void;
  onSelectBatchForDetail: (batch: WasteBatch) => void;
}

type FacilitySubTab = 'overview' | 'incoming' | 'capacity' | 'processing' | 'carbon' | 'passports' | 'profile';
type IncomingFilter = 'all' | 'pending' | 'scheduled' | 'in_transit' | 'received' | 'processing' | 'completed';

export const FacilityOperatorDashboardView: React.FC<FacilityOperatorDashboardProps> = ({
  onNavigateToTab,
  onSelectBatchForDetail
}) => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<FacilitySubTab>('overview');
  const [incomingFilter, setIncomingFilter] = useState<IncomingFilter>('all');
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Weighbridge Intake Verification Modal State
  const [verifyingBatch, setVerifyingBatch] = useState<WasteBatch | null>(null);
  const [measuredWeight, setMeasuredWeight] = useState<number>(9.8);
  const [measuredMoisture, setMeasuredMoisture] = useState<number>(11);
  const [intakeNotes, setIntakeNotes] = useState<string>('Sanand GIDC Gate 2 Weighbridge Tare verified. Quality Grade A.');

  // Detail Drawer State for Intake Inspection
  const [inspectingBatch, setInspectingBatch] = useState<WasteBatch | null>(null);

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

  const handleUpdateStatus = async (
    batchId: string, 
    nextStatus: BatchStatus, 
    customDesc?: string,
    updatedQty?: number
  ) => {
    try {
      setActionLoadingId(batchId);
      const res = await fetch(`/api/waste-batches/${batchId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          actor: user?.name || 'Sanand Plant Manager',
          location: 'BioChar Plant A, GIDC Sanand Phase II, Gujarat',
          description: customDesc || `Facility operator updated status to ${nextStatus.replace('_', ' ').toUpperCase()}.`,
          facilityId: 'fac-biochar-a',
          facilityName: 'BioChar Plant A (Sanand Industrial Eco-Park)'
        })
      });
      if (res.ok) {
        const result = await res.json();
        setBatches(prev => prev.map(b => {
          if (b.id === batchId) {
            return {
              ...result.batch,
              quantityTonnes: updatedQty !== undefined ? updatedQty : result.batch.quantityTonnes
            };
          }
          return b;
        }));
        if (inspectingBatch?.id === batchId) {
          setInspectingBatch(result.batch);
        }
      }
    } finally {
      setActionLoadingId(null);
      setVerifyingBatch(null);
    }
  };

  const handleVerifyIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingBatch) return;
    await handleUpdateStatus(
      verifyingBatch.id,
      'received',
      `Weighbridge verified: ${measuredWeight} tonnes (Moisture: ${measuredMoisture}%). ${intakeNotes}`,
      measuredWeight
    );
  };

  // Filter incoming batches based on tab
  const filteredIncomingBatches = batches.filter(b => {
    if (incomingFilter === 'all') return true;
    if (incomingFilter === 'pending') return b.status === 'generated' || b.status === 'matched';
    if (incomingFilter === 'scheduled') return b.status === 'collection_scheduled';
    if (incomingFilter === 'in_transit') return b.status === 'in_transit';
    if (incomingFilter === 'received') return b.status === 'received';
    if (incomingFilter === 'processing') return b.status === 'converting';
    if (incomingFilter === 'completed') return b.status === 'converted';
    return true;
  });

  const incomingBatches = batches.filter(b => b.status === 'matched' || b.status === 'in_transit' || b.status === 'collection_scheduled');
  const activeConverting = batches.filter(b => b.status === 'received' || b.status === 'converting');
  const convertedBatches = batches.filter(b => b.status === 'converted');

  const acceptedFeedstocks = [
    { name: 'Rice Husk', supported: true, category: 'Agricultural', efficiency: '88%', retention: '0.92 tCO₂e/t' },
    { name: 'Agricultural Residue / Stubble', supported: true, category: 'Agricultural', efficiency: '85%', retention: '0.82 tCO₂e/t' },
    { name: 'Cotton Stalks', supported: true, category: 'Agricultural', efficiency: '87%', retention: '0.88 tCO₂e/t' },
    { name: 'Groundnut Shells', supported: true, category: 'Agricultural', efficiency: '89%', retention: '0.89 tCO₂e/t' },
    { name: 'Wheat Straw', supported: true, category: 'Agricultural', efficiency: '86%', retention: '0.85 tCO₂e/t' },
    { name: 'Sawdust & Wood Pellets', supported: true, category: 'Forestry', efficiency: '91%', retention: '1.05 tCO₂e/t' },
    { name: 'Food Waste (Wet Sludge)', supported: false, category: 'Anaerobic Biogas Only', efficiency: 'N/A', retention: 'N/A' },
    { name: 'Municipal Solid Waste (Mixed)', supported: false, category: 'Non-compliant', efficiency: 'N/A', retention: 'N/A' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Facility Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-950 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              FACILITY OPERATOR
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Sanand Industrial Eco-Park, Gujarat
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ● Facility Operational
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
            BioChar Plant A <span className="text-slate-500 text-lg sm:text-xl font-normal">/ Feedstock Intake & Conversion Cockpit</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Manages incoming agricultural biomass, weighbridge calibration, continuous 650°C pyrolysis reactors, and digital passport certification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchIncomingBatches}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* 2. Four Core Facility KPI Cards (Spec Section 6) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            Today's Capacity
          </span>
          <div className="text-2xl font-mono font-black text-cyan-300">
            45 <span className="text-xs font-normal text-slate-400">t/day</span>
          </div>
          <div className="text-[11px] text-cyan-400/80">71% utilized (13t available)</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-brand-400" />
            Incoming Waste
          </span>
          <div className="text-2xl font-mono font-black text-brand-300">
            18 <span className="text-xs font-normal text-slate-400">tonnes</span>
          </div>
          <div className="text-[11px] text-slate-500">2 batches (including WL-1024)</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Processing Today
          </span>
          <div className="text-2xl font-mono font-black text-amber-300">
            32 <span className="text-xs font-normal text-slate-400">tonnes</span>
          </div>
          <div className="text-[11px] text-amber-400/80">Reactor temp: 650°C stable</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1 bg-emerald-950/30 border-emerald-500/30">
          <span className="text-xs text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Carbon Impact
          </span>
          <div className="text-2xl font-mono font-black text-emerald-300">
            +24.8 <span className="text-xs font-normal text-slate-400">tCO₂e</span>
          </div>
          <div className="text-[11px] text-emerald-400">+142.6 tCO₂e this month</div>
        </div>
      </div>

      {/* 3. Capacity Utilization Progress Bar (Spec Section 7 & 16) */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-brand-400" />
              Today's Capacity Utilization & Allocation
            </span>
            <p className="text-[11px] text-slate-400">
              Matching engine consumes available headroom before recommending BioChar Plant A.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>Allocated: <strong className="text-slate-200">32 tonnes</strong></span>
            <span>Incoming: <strong className="text-cyan-300">10 tonnes</strong></span>
            <span>Available: <strong className="text-emerald-400">13 tonnes</strong></span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-800 flex overflow-hidden">
            <div 
              className="h-full bg-cyan-500 rounded-l-full transition-all" 
              style={{ width: '71%' }} 
              title="Allocated (71%)"
            />
            <div 
              className="h-full bg-brand-500 transition-all" 
              style={{ width: '22%' }} 
              title="Incoming (22%)"
            />
            <div 
              className="h-full bg-slate-800 rounded-r-full transition-all" 
              style={{ width: '7%' }} 
              title="Available (7%)"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0 tonnes</span>
            <span className="text-slate-400 font-semibold">32 / 45 tonnes (71% utilized)</span>
            <span>45 t/day Max</span>
          </div>
        </div>
      </div>

      {/* 4. Complete 7-Tab Navigation for Facility Operator (Spec Section 4 & 30) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('overview')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('incoming')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'incoming'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Incoming Waste</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
            {incomingBatches.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('capacity')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'capacity'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Capacity</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('processing')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'processing'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Processing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('carbon')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'carbon'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Carbon Impact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('passports')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'passports'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Passports</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'profile'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Facility Profile</span>
        </button>
      </div>

      {/* PAGE 1 / OVERVIEW: INCOMING QUEUE & RECENT BATCHES */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Active Highlight Incoming Cards (Spec Section 8) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                Incoming Waste Stream
              </h3>
              <span className="text-xs font-mono text-cyan-300">Live Intake Gate Feed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Flagship Card: WL-1024 */}
              <div className="glass-panel p-5 rounded-2xl border-cyan-500/40 bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-950 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/30">
                      WL-1024
                    </span>
                    <h4 className="text-base font-bold text-slate-100 mt-1">Rice Husk • 10 tonnes</h4>
                    <p className="text-xs text-slate-400">From: Gujarat Agro Producer Cooperative</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/40">
                    ● IN TRANSIT
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Route Corridor:</span>
                    <span className="font-mono">Ahmedabad APMC → Sanand (26.4 km)</span>
                  </div>
                  <div className="flex justify-between text-cyan-300 font-semibold">
                    <span>Estimated Arrival:</span>
                    <span className="font-mono">ETA: 24 minutes</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Match Score:</span>
                    <span className="font-mono font-bold">92% Compatibility</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">Pathway: Biochar Pyrolysis</span>
                  <button
                    type="button"
                    onClick={() => {
                      const found = batches.find(b => b.trackingNumber === 'WL-1024' || b.id === 'batch-ahmedabad-demo');
                      if (found) setInspectingBatch(found);
                      else setInspectingBatch(batches[0]);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Batch & Intake</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 2: WL-1023 */}
              <div className="glass-panel p-5 rounded-2xl border-slate-800 bg-slate-900/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                      WL-1023
                    </span>
                    <h4 className="text-base font-bold text-slate-100 mt-1">Groundnut Shells • 8 tonnes</h4>
                    <p className="text-xs text-slate-400">From: Saurashtra Agri Cluster Hub</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/40">
                    ● SCHEDULED
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Pickup Window:</span>
                    <span className="font-mono">Tomorrow • 10:30 AM</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Allocated Intake:</span>
                    <span className="font-mono">8.0 tonnes capacity reserved</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Match Score:</span>
                    <span className="font-mono font-bold">89% Compatibility</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">Pathway: Biochar</span>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('incoming')}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>Manage in Queue →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2 / INCOMING WASTE: COMPLETE INTAKE QUEUE (Spec Section 10-14) */}
      {activeSubTab === 'incoming' && (
        <div className="space-y-4">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {(['all', 'pending', 'scheduled', 'in_transit', 'received', 'processing', 'completed'] as IncomingFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setIncomingFilter(f)}
                className={`px-3 py-1 rounded-lg uppercase font-semibold text-[11px] transition-all cursor-pointer ${
                  incomingFilter === f
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Incoming Batches Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 glass-panel">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase">
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Generator & Feedstock</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Origin Hub</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-center">Facility Gate Action</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                {filteredIncomingBatches.map((batch) => {
                  const isProcessing = actionLoadingId === batch.id;
                  return (
                    <tr key={batch.id} className="hover:bg-slate-900/60">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-300">
                        {batch.trackingNumber || batch.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-100">{batch.wasteType}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {batch.generatorName}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-300">
                        {batch.quantityTonnes} Tonnes
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <div>{batch.origin.city}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{batch.origin.address}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <BatchStatusBadge status={batch.status} size="sm" />
                      </td>

                      {/* Operator Action Controls */}
                      <td className="py-3.5 px-4 text-center">
                        {batch.status === 'matched' && (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleUpdateStatus(batch.id, 'collection_scheduled', 'Facility accepted batch and scheduled intake.')}
                              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-sm cursor-pointer"
                            >
                              Accept Batch
                            </button>
                          </div>
                        )}

                        {batch.status === 'collection_scheduled' && (
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleUpdateStatus(batch.id, 'in_transit', 'Carrier departed pickup hub. En route to Sanand.')}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer"
                          >
                            Confirm Dispatch (In Transit)
                          </button>
                        )}

                        {batch.status === 'in_transit' && (
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => {
                              setVerifyingBatch(batch);
                              setMeasuredWeight(batch.quantityTonnes > 2 ? batch.quantityTonnes - 0.2 : batch.quantityTonnes);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>Verify Weighbridge Intake</span>
                          </button>
                        )}

                        {batch.status === 'received' && (
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleUpdateStatus(batch.id, 'converting', 'Feedstock loaded into continuous pyrolysis reactor. Temp: 650°C.')}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Start Pyrolysis Conversion</span>
                          </button>
                        )}

                        {batch.status === 'converting' && (
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleUpdateStatus(batch.id, 'converted', 'Pyrolysis complete. 2.6t Biochar produced. Passport generated.')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1 mx-auto shadow-md cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Complete & Issue Passport</span>
                          </button>
                        )}

                        {batch.status === 'converted' && (
                          <span className="text-xs font-mono text-emerald-400 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Verified (+10.9 tCO₂e)
                          </span>
                        )}

                        {batch.status === 'generated' && (
                          <span className="text-xs text-slate-500 italic">
                            Awaiting Smart Matcher
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setInspectingBatch(batch)}
                          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAGE 3 / CAPACITY: COMMITTED & FEEDSTOCK MATRIX (Spec Section 16-17) */}
      {activeSubTab === 'capacity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="glass-panel p-4 rounded-xl border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase text-[10px]">Daily Processing Capacity</span>
              <div className="text-xl font-bold text-slate-100">45 tonnes</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase text-[10px]">Allocated Today</span>
              <div className="text-xl font-bold text-cyan-300">32 tonnes</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase text-[10px]">Incoming Shipments</span>
              <div className="text-xl font-bold text-brand-300">10 tonnes</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border-emerald-500/30 bg-emerald-950/20 space-y-1">
              <span className="text-emerald-400 uppercase text-[10px]">Available Headroom</span>
              <div className="text-xl font-bold text-emerald-300">3 tonnes (93% Committed)</div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Accepted Feedstocks & Matching Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  Directly feeds the Compatibility Score parameter (30% weight) in the Smart Matching Engine.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                Algorithm Matrix v2.0
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {acceptedFeedstocks.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
                    item.supported 
                      ? 'bg-slate-900/80 border-emerald-500/30' 
                      : 'bg-slate-950/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200">{item.name}</span>
                    {item.supported ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                        <X className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400">
                    <div>Category: {item.category}</div>
                    <div>Efficiency: <strong className="text-emerald-400">{item.efficiency}</strong></div>
                    <div>Retention Factor: <span className="font-mono text-cyan-300">{item.retention}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAGE 4 / PROCESSING: PYROLYSIS REACTOR CONVERSION (Spec Section 18-22) */}
      {activeSubTab === 'processing' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/10 to-slate-900 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    Active Pyrolysis Reactor: Continuous Biomass Carbonizer Unit #1
                  </h4>
                  <p className="text-xs text-slate-400">
                    Batch WL-1024 (9.8t Rice Husk) under high-permanence thermal decomposition at 650°C.
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Reactor Processing (72%)
              </span>
            </div>

            {/* Stages Grid (Spec Section 18) */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-sans">
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-400">
                <span className="font-bold block">✓ 1. Intake Verified</span>
                <span className="text-[10px] text-slate-400">9.8t measured</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-400">
                <span className="font-bold block">✓ 2. Feedstock Prepared</span>
                <span className="text-[10px] text-slate-400">Moisture: 11%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-400">
                <span className="font-bold block">✓ 3. Pyrolysis Started</span>
                <span className="text-[10px] text-slate-400">650°C anoxic zone</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-300">
                <span className="font-bold block">● 4. Carbon Conversion</span>
                <span className="text-[10px] text-amber-200/80">Recalcitrant fixing</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-500">
                <span className="font-bold block">○ 5. Output Verification</span>
                <span className="text-[10px] text-slate-600">2.6t Biochar target</span>
              </div>
            </div>

            {/* Output Preview */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-300">
                Input: <strong>9.8 tonnes Rice Husk</strong> ➔ Output: <strong className="text-emerald-300">2.6 tonnes Biochar (Pyrolysis)</strong>
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                Net Carbon Value: +10.9 tCO₂e
              </span>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 5 / CARBON IMPACT: FACILITY CARBON TOTALS (Spec Section 23-24) */}
      {activeSubTab === 'carbon' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Facility Carbon Impact
                </span>
                <h3 className="text-xl font-bold text-slate-100">
                  BioChar Plant A Monthly Sequestration Ledger
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                This Month
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400 block uppercase">Waste Converted</span>
                <div className="text-2xl font-mono font-bold text-slate-100">184 tonnes</div>
                <span className="text-[11px] text-slate-500">Across 16 agricultural batches</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400 block uppercase">Estimated Carbon Benefit</span>
                <div className="text-2xl font-mono font-bold text-emerald-300">+142.6 tCO₂e</div>
                <span className="text-[11px] text-emerald-400">Biogenic permanent removal</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400 block uppercase">Landfill Diversion</span>
                <div className="text-2xl font-mono font-bold text-teal-300">184 tonnes</div>
                <span className="text-[11px] text-teal-400">100% circular conversion</span>
              </div>
            </div>
          </div>

          {/* Batch Carbon Details Table (Spec Section 23 & 24) */}
          <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Batch Carbon Accounting Breakdown
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase">
                    <th className="py-3 px-4">Batch ID</th>
                    <th className="py-3 px-4">Feedstock</th>
                    <th className="py-3 px-4">Avoided Landfill</th>
                    <th className="py-3 px-4">Conversion Benefit</th>
                    <th className="py-3 px-4">Transport Fuel</th>
                    <th className="py-3 px-4 font-mono font-bold text-right">Net Estimated Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-sans">
                  <tr className="hover:bg-slate-900/60 font-mono">
                    <td className="py-3.5 px-4 text-brand-300 font-bold">WL-1024</td>
                    <td className="py-3.5 px-4 font-sans text-slate-200 font-bold">Rice Husk (10t)</td>
                    <td className="py-3.5 px-4 text-cyan-300">+2.80 tCO₂e</td>
                    <td className="py-3.5 px-4 text-brand-300">+8.10 tCO₂e</td>
                    <td className="py-3.5 px-4 text-rose-300">-0.0062 tCO₂e</td>
                    <td className="py-3.5 px-4 text-right text-emerald-300 font-black">+10.9 tCO₂e</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60 font-mono">
                    <td className="py-3.5 px-4 text-slate-400">WL-1021</td>
                    <td className="py-3.5 px-4 font-sans text-slate-300">Wheat Straw (12t)</td>
                    <td className="py-3.5 px-4 text-cyan-300">+3.36 tCO₂e</td>
                    <td className="py-3.5 px-4 text-brand-300">+9.85 tCO₂e</td>
                    <td className="py-3.5 px-4 text-rose-300">-0.0081 tCO₂e</td>
                    <td className="py-3.5 px-4 text-right text-emerald-300 font-bold">+13.2 tCO₂e</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60 font-mono">
                    <td className="py-3.5 px-4 text-slate-400">WL-1018</td>
                    <td className="py-3.5 px-4 font-sans text-slate-300">Groundnut Shell (8t)</td>
                    <td className="py-3.5 px-4 text-cyan-300">+2.24 tCO₂e</td>
                    <td className="py-3.5 px-4 text-brand-300">+6.47 tCO₂e</td>
                    <td className="py-3.5 px-4 text-rose-300">-0.0055 tCO₂e</td>
                    <td className="py-3.5 px-4 text-right text-emerald-300 font-bold">+8.7 tCO₂e</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 6 / PASSPORTS: VERIFIED BATCH PASSPORTS (Spec Section 25-26) */}
      {activeSubTab === 'passports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-2xl border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    CLP-PASS-2026-9041
                  </span>
                  <h4 className="text-base font-bold text-slate-100 mt-1">Batch WL-1024 • Rice Husk</h4>
                  <p className="text-xs text-slate-400">Facility: BioChar Plant A (Sanand)</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-300 block">+10.9 tCO₂e</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">✓ Verified</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
                <div>Seal: SHA256:7f83b1657ff1fc53b92dc18148...</div>
                <div>Producer: Gujarat Agro Producer Cooperative</div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToTab('carbon-passports')}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>View Full Carbon Passport & QR Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 7 / PROFILE: FACILITY SPECS & FEEDBACK TO MATCHING (Spec Section 27-28) */}
      {activeSubTab === 'profile' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-slate-100">BioChar Plant A (Sanand Industrial Eco-Park)</h3>
              </div>
              <p className="text-xs text-slate-400">
                Plot 42-B, GIDC Sanand Phase II, Ahmedabad District, Gujarat
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              ● Operational
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] font-semibold">Facility Type</span>
              <div className="text-sm font-bold text-cyan-300">Biochar Pyrolysis Hub</div>
              <p className="text-[11px] text-slate-400">High-permanence carbon removal</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] font-semibold">Daily Intake Capacity</span>
              <div className="text-sm font-bold text-slate-100 font-mono">45 tonnes/day</div>
              <p className="text-[11px] text-slate-400">Feeds Capacity Score (20%)</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] font-semibold">Conversion Efficiency</span>
              <div className="text-sm font-bold text-emerald-400 font-mono">88%</div>
              <p className="text-[11px] text-slate-400">Feeds Efficiency Score (15%)</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] font-semibold">Carbon Retention Factor</span>
              <div className="text-sm font-bold text-brand-300 font-mono">0.92 tCO₂e/t</div>
              <p className="text-[11px] text-slate-400">Feeds Carbon Benefit Score (15%)</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. INTAKE INSPECTION DRAWER / MODAL (Spec Section 12-14) */}
      {inspectingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-2xl w-full rounded-2xl glass-panel border border-cyan-500/40 bg-slate-900 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Waste Intake Inspection — {inspectingBatch.trackingNumber || inspectingBatch.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingBatch(null)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-400 uppercase text-[10px]">Feedstock & Volume:</span>
                  <div className="text-sm font-bold text-slate-100">{inspectingBatch.wasteType} • {inspectingBatch.quantityTonnes} tonnes</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px]">Generator:</span>
                  <div className="text-sm font-bold text-slate-200">{inspectingBatch.generatorName}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px]">Origin:</span>
                  <div className="text-slate-300">{inspectingBatch.origin.city}, {inspectingBatch.origin.state}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px]">Current Status:</span>
                  <div><BatchStatusBadge status={inspectingBatch.status} size="sm" /></div>
                </div>
              </div>

              {/* Lifecycle Journey Progress for Facility (Spec Section 13) */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Chain-of-Custody Provenance
                </span>
                <div className="grid grid-cols-5 gap-1.5 text-[10px] font-mono text-center">
                  <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Matched
                  </div>
                  <div className={`p-1.5 rounded ${['collection_scheduled', 'in_transit', 'received', 'converting', 'converted'].includes(inspectingBatch.status) ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-900 text-slate-500'}`}>
                    {['collection_scheduled', 'in_transit', 'received', 'converting', 'converted'].includes(inspectingBatch.status) ? '✓ Scheduled' : '○ Scheduled'}
                  </div>
                  <div className={`p-1.5 rounded ${['in_transit', 'received', 'converting', 'converted'].includes(inspectingBatch.status) ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-900 text-slate-500'}`}>
                    {['in_transit', 'received', 'converting', 'converted'].includes(inspectingBatch.status) ? '✓ In Transit' : '○ In Transit'}
                  </div>
                  <div className={`p-1.5 rounded ${['received', 'converting', 'converted'].includes(inspectingBatch.status) ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-900 text-slate-500'}`}>
                    {['received', 'converting', 'converted'].includes(inspectingBatch.status) ? '✓ Received' : '○ Arrived'}
                  </div>
                  <div className={`p-1.5 rounded ${inspectingBatch.status === 'converted' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-900 text-slate-500'}`}>
                    {inspectingBatch.status === 'converted' ? '✓ Verified' : '○ Converted'}
                  </div>
                </div>
              </div>

              {/* Actions Toolbar */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                {inspectingBatch.status === 'in_transit' && (
                  <button
                    type="button"
                    onClick={() => {
                      setVerifyingBatch(inspectingBatch);
                      setMeasuredWeight(inspectingBatch.quantityTonnes > 2 ? inspectingBatch.quantityTonnes - 0.2 : inspectingBatch.quantityTonnes);
                      setInspectingBatch(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Scale className="w-4 h-4" />
                    <span>Log Weighbridge Verification</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setInspectingBatch(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. WEIGHBRIDGE INTAKE VERIFICATION MODAL (Spec Section 20 & 21) */}
      {verifyingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-lg w-full rounded-2xl glass-panel border border-cyan-500/40 bg-slate-900 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Weighbridge Intake Verification & Quality Check
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setVerifyingBatch(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyIntakeSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Batch ID:</span>
                  <span className="font-mono font-bold text-brand-300">{verifyingBatch.trackingNumber || verifyingBatch.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Producer / Origin:</span>
                  <span className="text-slate-200">{verifyingBatch.generatorName} ({verifyingBatch.origin.city})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Declared Expected Quantity:</span>
                  <span className="font-mono text-slate-300">{verifyingBatch.quantityTonnes} tonnes</span>
                </div>
              </div>

              {/* Weight & Moisture Input */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase text-[10px]">
                    Actual Measured Weight (Tonnes) <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={measuredWeight}
                    onChange={(e) => setMeasuredWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Tare gross delta calculation</span>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold uppercase text-[10px]">
                    Sample Moisture Content %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={measuredMoisture}
                    onChange={(e) => setMeasuredMoisture(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Infrared moisture probe reading</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold uppercase text-[10px]">
                  Intake Gate Notes
                </label>
                <input
                  type="text"
                  value={intakeNotes}
                  onChange={(e) => setIntakeNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setVerifyingBatch(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Verified Intake & Update Ledger</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
