import { WasteBatch, BatchEvent, BatchStatus, LocationCoordinates } from '../types/index.js';
import { SEED_BATCHES, SEED_TIMELINES } from '../data/seedData.js';

class WasteService {
  private batches: Map<string, WasteBatch> = new Map();
  private timelines: Map<string, BatchEvent[]> = new Map();
  private batchCounter: number = 1024;

  constructor() {
    // Seed initial batches
    SEED_BATCHES.forEach((b) => {
      this.batches.set(b.id, { ...b, generatorId: 'usr-generator-1' });
    });

    // Seed initial timelines
    Object.entries(SEED_TIMELINES).forEach(([batchId, events]) => {
      this.timelines.set(batchId, [...events]);
    });
  }

  public getAllBatches(filters?: {
    status?: string;
    wasteType?: string;
    search?: string;
    generatorId?: string;
    facilityId?: string;
  }): WasteBatch[] {
    let list = Array.from(this.batches.values());

    if (filters?.generatorId) {
      list = list.filter((b) => !b.generatorId || b.generatorId === filters.generatorId);
    }

    if (filters?.facilityId) {
      list = list.filter((b) => !b.facilityId || b.facilityId === filters.facilityId);
    }

    if (filters?.status && filters.status !== 'all') {
      list = list.filter((b) => b.status === filters.status);
    }

    if (filters?.wasteType && filters.wasteType !== 'all') {
      list = list.filter((b) => b.wasteType.toLowerCase() === filters.wasteType!.toLowerCase());
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (b) =>
          b.trackingNumber.toLowerCase().includes(q) ||
          b.wasteType.toLowerCase().includes(q) ||
          b.origin.city.toLowerCase().includes(q) ||
          b.generatorName.toLowerCase().includes(q) ||
          (b.facilityName && b.facilityName.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getBatchById(id: string): WasteBatch | undefined {
    if (this.batches.has(id)) return this.batches.get(id);
    const lower = id.toLowerCase();
    for (const b of this.batches.values()) {
      if (b.id.toLowerCase() === lower || b.trackingNumber.toLowerCase() === lower) {
        return b;
      }
    }
    return undefined;
  }

  public createBatch(input: {
    wasteType: string;
    category?: string;
    quantityTonnes: number;
    moistureContentPercent?: number;
    availableDate?: string;
    generatorId?: string;
    generatorName?: string;
    generatorType?: 'Farmer' | 'Food Processor' | 'Municipality' | 'Industrial Factory';
    origin: LocationCoordinates;
    preferredConversion?: any;
  }): WasteBatch {
    const trackingNumber = `WL-${this.batchCounter++}`;
    const id = `batch-${trackingNumber.toLowerCase()}`;
    const now = new Date().toISOString();

    const category =
      input.category ||
      (input.wasteType.toLowerCase().includes('food')
        ? 'Food Processing'
        : input.wasteType.toLowerCase().includes('sawdust')
        ? 'Forestry Residue'
        : 'Agricultural');

    const newBatch: WasteBatch = {
      id,
      trackingNumber,
      wasteType: input.wasteType,
      category: category as any,
      quantityTonnes: Number(input.quantityTonnes),
      moistureContentPercent: input.moistureContentPercent,
      generatorId: input.generatorId,
      generatorName: input.generatorName || 'Registered Waste Producer',
      generatorType: input.generatorType || 'Farmer',
      origin: input.origin,
      preferredConversion: input.preferredConversion || 'Biochar',
      status: 'generated',
      createdAt: now,
      updatedAt: now,
    };

    this.batches.set(id, newBatch);

    // Create the initial "Waste Generated" event
    const initialEvent: BatchEvent = {
      id: `evt-${Date.now()}-1`,
      batchId: id,
      status: 'generated',
      title: 'Waste Batch Declared',
      description: `${newBatch.quantityTonnes} tonnes of ${newBatch.wasteType} registered at ${newBatch.origin.address}, ${newBatch.origin.city}.`,
      location: `${newBatch.origin.city}, ${newBatch.origin.state}`,
      timestamp: now,
      actor: newBatch.generatorName,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    };

    this.timelines.set(id, [initialEvent]);

    return newBatch;
  }

  public updateBatchStatus(
    id: string,
    status: BatchStatus,
    metadata?: {
      actor?: string;
      location?: string;
      description?: string;
      facilityId?: string;
      facilityName?: string;
      actualQuantityTonnes?: number;
      actualMoisturePercent?: number;
      conversionOutputTonnes?: number;
      outputType?: string;
      processingProgressPercent?: number;
    }
  ): { batch: WasteBatch; event: BatchEvent } {
    let batch = this.batches.get(id);
    if (!batch) {
      batch = this.getBatchById(id);
    }
    if (!batch) {
      throw new Error(`Batch ${id} not found`);
    }

    const now = new Date().toISOString();
    batch.status = status;
    batch.updatedAt = now;

    if (metadata?.facilityId) batch.facilityId = metadata.facilityId;
    if (metadata?.facilityName) batch.facilityName = metadata.facilityName;
    if (metadata?.actualQuantityTonnes !== undefined) {
      batch.actualQuantityTonnes = Number(metadata.actualQuantityTonnes);
      batch.quantityTonnes = Number(metadata.actualQuantityTonnes);
    }
    if (metadata?.actualMoisturePercent !== undefined) {
      batch.actualMoisturePercent = Number(metadata.actualMoisturePercent);
    }
    if (metadata?.conversionOutputTonnes !== undefined) {
      batch.conversionOutputTonnes = Number(metadata.conversionOutputTonnes);
    }
    if (metadata?.outputType) {
      batch.outputType = metadata.outputType;
    }
    if (metadata?.processingProgressPercent !== undefined) {
      batch.processingProgressPercent = Number(metadata.processingProgressPercent);
    }

    const statusDescriptions: Record<BatchStatus, string> = {
      generated: 'Waste batch declared and verified at origin hub.',
      matched: `Smart Matching Engine identified optimal facility${batch.facilityName ? `: ${batch.facilityName}` : ''}.`,
      collection_scheduled: 'Logistics route optimized; carrier pickup scheduled.',
      in_transit: `Batch dispatched and currently in-transit to facility (${batch.origin.city} -> destination).`,
      received: `Batch arrived at ${batch.facilityName || 'facility'} and weighbridge verification completed (${batch.actualQuantityTonnes || batch.quantityTonnes} tonnes).`,
      converting: `Active carbon conversion underway (${batch.preferredConversion} process).`,
      converted: `Conversion complete. ${batch.conversionOutputTonnes || 2.6} tonnes ${batch.outputType || 'Biochar'} produced. Digital Carbon Passport generated.`,
    };

    const newEvent: BatchEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      batchId: batch.id,
      status,
      title: this.getStatusTitle(status),
      description: metadata?.description || statusDescriptions[status],
      location: metadata?.location || `${batch.origin.city}, ${batch.origin.state}`,
      timestamp: now,
      actor: metadata?.actor || 'CarbonLoop Lifecycle Engine',
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    };

    const currentTimeline = this.timelines.get(batch.id) || [];
    currentTimeline.push(newEvent);
    this.timelines.set(batch.id, currentTimeline);

    return { batch, event: newEvent };
  }

  public getTimeline(batchId: string): BatchEvent[] {
    if (this.timelines.has(batchId)) return this.timelines.get(batchId)!;
    const batch = this.getBatchById(batchId);
    if (batch && this.timelines.has(batch.id)) return this.timelines.get(batch.id)!;
    return [];
  }

  private getStatusTitle(status: BatchStatus): string {
    const titles: Record<BatchStatus, string> = {
      generated: 'Waste Batch Registered',
      matched: 'Optimal Facility Matched',
      collection_scheduled: 'Logistics Scheduled',
      in_transit: 'In Transit to Facility',
      received: 'Facility Received & Weighed',
      converting: 'Carbon Conversion Active',
      converted: 'Converted & Carbon Verified',
    };
    return titles[status] || status;
  }
}

export const wasteService = new WasteService();
