import React, { useState } from 'react';
import { WasteBatch, BatchStatus } from '../types/index.js';
import { BatchStatusBadge } from './BatchStatusBadge.js';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  MapPin, 
  Scale, 
  Building2, 
  Calendar, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface WasteBatchTableProps {
  batches: WasteBatch[];
  onSelectBatch: (batch: WasteBatch) => void;
  selectedBatchId?: string;
  onRefresh?: () => void;
}

export const WasteBatchTable: React.FC<WasteBatchTableProps> = ({
  batches,
  onSelectBatch,
  selectedBatchId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>('all');

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.origin.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.generatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.facilityName && b.facilityName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || b.status === statusFilter;

    const matchesType =
      wasteTypeFilter === 'all' || b.wasteType === wasteTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const uniqueWasteTypes = Array.from(new Set(batches.map((b) => b.wasteType)));

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Batch ID, waste type, city, generator, or facility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 appearance-none"
          >
            <option value="all">All Statuses ({batches.length})</option>
            <option value="generated">Waste Generated</option>
            <option value="matched">Facility Matched</option>
            <option value="collection_scheduled">Collection Scheduled</option>
            <option value="in_transit">In Transit</option>
            <option value="received">Facility Received</option>
            <option value="converting">Converting</option>
            <option value="converted">Converted & Verified</option>
          </select>
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>

        {/* Waste Type Filter */}
        <div className="relative">
          <select
            value={wasteTypeFilter}
            onChange={(e) => setWasteTypeFilter(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 appearance-none"
          >
            <option value="all">All Waste Types</option>
            {uniqueWasteTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Batch ID</th>
              <th className="py-3 px-4">Waste Type & Category</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Origin Location</th>
              <th className="py-3 px-4">Assigned Facility</th>
              <th className="py-3 px-4">Lifecycle Status</th>
              <th className="py-3 px-4">Est. Carbon Impact</th>
              <th className="py-3 px-4 text-right">Created</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredBatches.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-slate-600" />
                    <span>No waste batches match your current search and filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredBatches.map((batch) => {
                const isSelected = selectedBatchId === batch.id;
                return (
                  <tr
                    key={batch.id}
                    onClick={() => onSelectBatch(batch)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-brand-950/40 border-l-4 border-l-brand-400'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-300 whitespace-nowrap">
                      {batch.trackingNumber || batch.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">
                        {batch.wasteType}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {batch.category}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-medium text-emerald-300">
                      <span className="flex items-center gap-1">
                        <Scale className="w-3 h-3 text-emerald-400" />
                        {batch.quantityTonnes} t
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-[180px] truncate">
                      <div className="flex items-center gap-1 text-slate-300 truncate">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{batch.origin.city}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {batch.origin.address}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px] truncate">
                      {batch.facilityName ? (
                        <div className="flex items-center gap-1 text-indigo-300 truncate">
                          <Building2 className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span className="truncate">{batch.facilityName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <BatchStatusBadge status={batch.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-emerald-400 font-medium">
                      {batch.estimatedCarbonImpactTonnesCO2e ? (
                        `+${batch.estimatedCarbonImpactTonnesCO2e.toFixed(1)} tCO₂e`
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {new Date(batch.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBatch(batch);
                        }}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-brand-400 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
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
