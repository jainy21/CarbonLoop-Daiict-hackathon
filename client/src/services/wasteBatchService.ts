import { WasteBatch, BatchEvent, CreateBatchInput, BatchStatus } from '../types/index.js';

const API_BASE = '/api';

export const wasteBatchService = {
  /**
   * Create a new waste batch (POST /api/waste-batches)
   */
  async createBatch(input: CreateBatchInput): Promise<WasteBatch> {
    const quantityTonnes = input.unit === 'kg' ? input.quantity / 1000 : input.quantity;

    const payload = {
      wasteType: input.wasteType,
      category: input.wasteType.includes('Food') ? 'Food Processing' : 'Agricultural',
      quantityTonnes,
      moistureContentPercent: input.moisture,
      availableDate: input.availableDate,
      generatorName: input.generatorName || 'Agricultural Producer Cluster',
      generatorType: 'Farmer',
      origin: input.location,
      preferredConversion: input.preferredConversion,
    };

    const response = await fetch(`${API_BASE}/waste-batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to create waste batch (${response.status})`);
    }

    return response.json();
  },

  /**
   * Fetch all waste batches with optional filtering (GET /api/waste-batches)
   */
  async getBatches(filters?: {
    status?: string;
    wasteType?: string;
    search?: string;
  }): Promise<WasteBatch[]> {
    const query = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') query.append('status', filters.status);
    if (filters?.wasteType && filters.wasteType !== 'all') query.append('wasteType', filters.wasteType);
    if (filters?.search) query.append('search', filters.search);

    const response = await fetch(`${API_BASE}/waste-batches?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to load waste batches (${response.status})`);
    }
    return response.json();
  },

  /**
   * Get single batch by ID (GET /api/waste-batches/:id)
   */
  async getBatchById(id: string): Promise<WasteBatch> {
    const response = await fetch(`${API_BASE}/waste-batches/${id}`);
    if (!response.ok) {
      throw new Error(`Batch not found (${response.status})`);
    }
    return response.json();
  },

  /**
   * Update status (PATCH /api/waste-batches/:id/status)
   */
  async updateStatus(
    id: string,
    status: BatchStatus,
    metadata?: { actor?: string; location?: string; description?: string }
  ): Promise<{ batch: WasteBatch; event: BatchEvent }> {
    const response = await fetch(`${API_BASE}/waste-batches/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...metadata }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update status (${response.status})`);
    }

    return response.json();
  },

  /**
   * Fetch complete timeline for a batch (GET /api/batches/:id/timeline)
   */
  async getTimeline(batchId: string): Promise<BatchEvent[]> {
    const response = await fetch(`${API_BASE}/batches/${batchId}/timeline`);
    if (!response.ok) {
      throw new Error(`Failed to load timeline events (${response.status})`);
    }
    return response.json();
  },
};
