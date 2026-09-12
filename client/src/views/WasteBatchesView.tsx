import React, { useState, useEffect } from 'react';
import { WasteBatch, CreateBatchInput, BatchStatus } from '../types/index.js';
import { wasteBatchService } from '../services/wasteBatchService.js';
import { WasteForm } from '../components/WasteForm.js';
import { WasteBatchTable } from '../components/WasteBatchTable.js';
import { WasteBatchCard } from '../components/WasteBatchCard.js';
import { BatchDetail } from '../components/BatchDetail.js';
import { 
  PlusCircle, 
  ListOrdered, 
  LayoutGrid, 
  Table as TableIcon, 
  Sparkles, 
  Scale, 
  Truck, 
  CheckCircle2, 
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface WasteBatchesViewProps {
  onBatchCreated?: (batch: WasteBatch) => void;
  onNavigateToModule?: (moduleKey: string) => void;
  activeBatchId?: string;
}

export const WasteBatchesView: React.FC<WasteBatchesViewProps> = ({
  onBatchCreated,
  onNavigateToModule,
  activeBatchId
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'list' | 'detail'>('list');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<WasteBatch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const data = await wasteBatchService.getBatches();
      setBatches(data);

      // If activeBatchId was passed from outside, select it
      if (activeBatchId) {
        const found = data.find((b) => b.id === activeBatchId);
        if (found) {
          setSelectedBatch(found);
          setActiveSubTab('detail');
        }
      } else if (!selectedBatch && data.length > 0) {
        setSelectedBatch(data[0]);
      }
    } catch (err: any) {
      console.error('Failed to load batches:', err);
      setNotification({
        type: 'error',
        message: 'Could not connect to Waste Batch API. Running with local fallback data.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [activeBatchId]);

  const handleCreateBatch = async (input: CreateBatchInput) => {
    try {
      setIsSubmitting(true);
      setNotification(null);

      const newBatch = await wasteBatchService.createBatch(input);
      setBatches((prev) => [newBatch, ...prev]);
      setSelectedBatch(newBatch);
      setActiveSubTab('detail');

      setNotification({
        type: 'success',
        message: `Batch ${newBatch.trackingNumber || newBatch.id} successfully created and registered into the immutable value chain.`
      });

      if (onBatchCreated) {
        onBatchCreated(newBatch);
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to create waste batch. Please check inputs.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (batchId: string, nextStatus: BatchStatus) => {
    try {
      const { batch: updatedBatch } = await wasteBatchService.updateStatus(batchId, nextStatus);
      setBatches((prev) => prev.map((b) => (b.id === batchId ? updatedBatch : b)));
      setSelectedBatch(updatedBatch);
      setNotification({
        type: 'success',
        message: `Batch status advanced to "${nextStatus.replace('_', ' ').toUpperCase()}". Event appended to ledger.`
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to update batch status.'
      });
    }
  };

  // Compute summary metrics
  const totalTonnes = batches.reduce((acc, b) => acc + (b.quantityTonnes || 0), 0);
  const activeInTransit = batches.filter((b) => b.status === 'in_transit').length;
  const totalConverted = batches.filter((b) => b.status === 'converted').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metric KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Total Batches</span>
            <ListOrdered className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-mono font-black text-slate-100">
            {batches.length}
          </div>
          <div className="text-[11px] text-slate-400">Tracked in lifecycle ledger</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Feedstock Volume</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-black text-emerald-300">
            {totalTonnes.toFixed(1)} <span className="text-sm font-sans font-normal text-slate-400">Tonnes</span>
          </div>
          <div className="text-[11px] text-emerald-400/80">Diverted from landfill</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>In-Transit Active</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-black text-cyan-300">
            {activeInTransit}
          </div>
          <div className="text-[11px] text-cyan-400/80">Logistics dispatch live</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1 bg-gradient-to-br from-slate-900 to-emerald-950/30 border-emerald-500/20">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold uppercase">
            <span>Carbon Realized</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-black text-emerald-300">
            {totalConverted} <span className="text-xs font-sans text-slate-400">Batches</span>
          </div>
          <div className="text-[11px] text-emerald-400">Passports generated & verified</div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-200 text-xs px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Tab Controller & Subheader */}
      <div className="glass-panel p-2 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveSubTab('list')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'list'
                ? 'bg-brand-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>All Batches ({batches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('create')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'create'
                ? 'bg-brand-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Waste Batch</span>
          </button>

          {selectedBatch && (
            <button
              type="button"
              onClick={() => setActiveSubTab('detail')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'detail'
                  ? 'bg-brand-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Trace: {selectedBatch.trackingNumber || selectedBatch.id}</span>
            </button>
          )}
        </div>

        {/* View Mode Switcher (for list tab) & Refresh */}
        <div className="flex items-center gap-2">
          {activeSubTab === 'list' && (
            <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'table'
                    ? 'bg-slate-800 text-brand-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-slate-800 text-brand-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={fetchBatches}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Refresh from API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tab 1: Create Waste Batch Form */}
      {activeSubTab === 'create' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800">
          <div className="mb-6 space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STEP 1 OF CARBONLOOP JOURNEY</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              Register New Waste Batch
            </h2>
            <p className="text-xs text-slate-400">
              Enter feedstock parameters, quantity, origin coordinates, and preferred pathway to initiate smart matching and carbon traceability.
            </p>
          </div>

          <WasteForm
            onSubmit={handleCreateBatch}
            isLoading={isSubmitting}
          />
        </div>
      )}

      {/* Tab 2: All Waste Batches List */}
      {activeSubTab === 'list' && (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <WasteBatchTable
              batches={batches}
              onSelectBatch={(batch) => {
                setSelectedBatch(batch);
                setActiveSubTab('detail');
              }}
              selectedBatchId={selectedBatch?.id}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches.map((batch) => (
                <WasteBatchCard
                  key={batch.id}
                  batch={batch}
                  onSelect={(b) => {
                    setSelectedBatch(b);
                    setActiveSubTab('detail');
                  }}
                  isSelected={selectedBatch?.id === batch.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Selected Batch Detail & Lifecycle Advancer */}
      {activeSubTab === 'detail' && selectedBatch && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveSubTab('list')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              ← Back to all batches
            </button>
            <span className="text-xs text-slate-500 font-mono">
              Batch UID: {selectedBatch.id}
            </span>
          </div>

          <BatchDetail
            batch={selectedBatch}
            onStatusChange={handleStatusChange}
            onNavigateToModule={onNavigateToModule}
          />
        </div>
      )}
    </div>
  );
};
