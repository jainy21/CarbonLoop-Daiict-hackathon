import React, { useState } from 'react';
import { WasteBatch } from '../types/index.js';
import { StatusBadge } from './StatusBadge.js';
import { 
  ArrowUpRight, 
  Search, 
  Filter, 
  Sparkles, 
  Scale, 
  Building2, 
  Leaf, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface ActivityTableProps {
  batches: WasteBatch[];
  onSelectBatch: (batch: WasteBatch) => void;
  isLoading?: boolean;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  batches,
  onSelectBatch,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (batch.facilityName && batch.facilityName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      batch.origin.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate carbon impact display (+8.4 tCO2e for 10t rice husk, proportional estimate for others)
  const getCarbonImpact = (batch: WasteBatch) => {
    if (batch.estimatedCarbonImpactTonnesCO2e) {
      return `+${batch.estimatedCarbonImpactTonnesCO2e.toFixed(1)} tCO₂e`;
    }
    const factor = batch.wasteType.toLowerCase().includes('food') ? 0.98 : 0.84;
    const impact = Math.round(batch.quantityTonnes * factor * 10) / 10;
    return `+${impact.toFixed(1)} tCO₂e`;
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-0">
      {/* Header & Controls */}
      <div className="p-5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 bg-slate-950/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-brand-400" />
              Active Value Chain
            </h3>
            <span className="text-[11px] font-mono font-bold bg-brand-500/10 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded-full">
              {filteredBatches.length} Active Batches
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time traceability ledger connecting generators, logistics, and conversion facilities.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search batch, waste, facility..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-400 w-48 sm:w-60"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-brand-400"
            >
              <option value="all">All Statuses</option>
              <option value="generated">Generated</option>
              <option value="matched">Matched</option>
              <option value="collection_scheduled">Collection Scheduled</option>
              <option value="in_transit">In Transit</option>
              <option value="received">Received</option>
              <option value="converting">Converting</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Batch</th>
              <th className="py-3 px-4">Waste Feedstock</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Facility</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Carbon Impact</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5 px-4"><div className="h-4 w-16 bg-slate-800 rounded" /></td>
                  <td className="py-3.5 px-4"><div className="h-4 w-28 bg-slate-800 rounded" /></td>
                  <td className="py-3.5 px-4"><div className="h-4 w-16 bg-slate-800 rounded" /></td>
                  <td className="py-3.5 px-4"><div className="h-4 w-32 bg-slate-800 rounded" /></td>
                  <td className="py-3.5 px-4"><div className="h-5 w-24 bg-slate-800 rounded-full" /></td>
                  <td className="py-3.5 px-4 text-right"><div className="h-4 w-20 bg-slate-800 rounded ml-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><div className="h-6 w-6 bg-slate-800 rounded mx-auto" /></td>
                </tr>
              ))
            ) : filteredBatches.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                  No active waste batches match the specified criteria.
                </td>
              </tr>
            ) : (
              filteredBatches.map((batch) => {
                const carbonImpact = getCarbonImpact(batch);
                return (
                  <tr
                    key={batch.id}
                    onClick={() => onSelectBatch(batch)}
                    className="hover:bg-slate-850/70 cursor-pointer transition-colors group"
                  >
                    {/* 1. Batch */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-300 group-hover:text-brand-200">
                          {batch.trackingNumber}
                        </span>
                        {batch.trackingNumber === 'WL-1024' && (
                          <span className="text-[9px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                            Flagship
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                        {batch.origin.city}
                      </span>
                    </td>

                    {/* 2. Waste */}
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-200 font-semibold block">
                        {batch.wasteType}
                      </strong>
                      <span className="text-[11px] text-slate-400">
                        {batch.category || 'Agricultural'}
                      </span>
                    </td>

                    {/* 3. Quantity */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-100">
                        {batch.quantityTonnes} tonnes
                      </span>
                      {batch.moistureContentPercent !== undefined && (
                        <span className="text-[10px] text-slate-500 block">
                          {batch.moistureContentPercent}% moisture
                        </span>
                      )}
                    </td>

                    {/* 4. Facility */}
                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 font-medium truncate block max-w-[200px]">
                        {batch.facilityName || (
                          <span className="text-slate-500 italic">Matching in progress...</span>
                        )}
                      </span>
                      <span className="text-[10px] text-brand-400/80 font-mono">
                        {batch.preferredConversion}
                      </span>
                    </td>

                    {/* 5. Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={batch.status} size="sm" />
                    </td>

                    {/* 6. Carbon Impact */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-black text-emerald-300 text-xs inline-flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        {carbonImpact}
                      </span>
                    </td>

                    {/* 7. Action Button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBatch(batch);
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-brand-500/20 text-slate-400 group-hover:text-brand-300 border border-slate-800 group-hover:border-brand-500/40 transition-all inline-flex items-center gap-1 text-[11px]"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
