import { CarbonCalculation, ICarbonPredictionEngine } from '../types/index.js';
import { EMISSION_FACTORS } from '../data/seedData.js';
import { wasteService } from './wasteService.js';

export class DeterministicCarbonEngine implements ICarbonPredictionEngine {
  private calculations: Map<string, CarbonCalculation> = new Map();

  /**
   * Prototype Carbon Impact Estimation Engine:
   *
   * Avoided Landfill Emissions = Waste Quantity × Landfill Emission Factor
   * Conversion Carbon Benefit  = Waste Quantity × Conversion Efficiency × Carbon Retention Factor
   * Transport Emissions        = Distance × Vehicle Emission Factor
   * Net Carbon Impact          = Avoided Landfill Emissions + Conversion Carbon Benefit - Transport Emissions
   */
  public calculate(input: {
    batchId?: string;
    wasteType?: string;
    quantityTonnes?: number;
    distanceKm?: number;
    conversionType?: string;
    vehicleType?: string;
  }): CarbonCalculation {
    const batchId = input.batchId || `temp-batch-${Date.now()}`;
    const calculationId = `calc-${Date.now()}`;

    let wasteType = input.wasteType;
    let quantityTonnes = input.quantityTonnes;

    if (input.batchId) {
      const allBatches = wasteService.getAllBatches();
      const matchedBatch =
        wasteService.getBatchById(input.batchId) ||
        allBatches.find(
          (b) =>
            b.id.toLowerCase() === input.batchId!.toLowerCase() ||
            b.trackingNumber.toLowerCase() === input.batchId!.toLowerCase()
        );

      if (matchedBatch) {
        wasteType = wasteType || matchedBatch.wasteType;
        quantityTonnes = quantityTonnes || matchedBatch.quantityTonnes;
      }
    }

    const resolvedWasteType = wasteType || 'Rice Husk';
    const resolvedQty = Number(quantityTonnes) || 10;

    if (resolvedQty <= 0) {
      throw new Error('waste quantity must be a positive number greater than 0 tonnes');
    }

    const distanceKm = Number(input.distanceKm) >= 0 ? Number(input.distanceKm) : 26.4;

    const factorData = EMISSION_FACTORS[resolvedWasteType] || {
      landfillEmissionFactor: 0.28,
      carbonRetentionFactor: 0.92,
      defaultEfficiency: 0.88,
      defaultPathway: 'Biochar'
    };

    // 1. Avoided Landfill Emissions = Waste Quantity × Landfill Emission Factor
    const landfillEmissionFactor = factorData.landfillEmissionFactor;
    const avoidedLandfillEmissionsTonnesCO2e =
      Math.round(resolvedQty * landfillEmissionFactor * 100) / 100;

    // 2. Conversion Carbon Benefit = Waste Quantity × Conversion Efficiency × Carbon Retention Factor
    const conversionEfficiency = factorData.defaultEfficiency;
    const carbonRetentionFactor = factorData.carbonRetentionFactor;
    const conversionCarbonBenefitTonnesCO2e =
      Math.round(resolvedQty * conversionEfficiency * carbonRetentionFactor * 100) / 100;

    // 3. Transport Emissions = Distance × Vehicle Emission Factor (e.g. 0.235 kgCO2e/km for CNG Medium Carrier)
    const vehicleEmissionFactor =
      input.vehicleType === 'Electric Heavy Truck'
        ? 0.04
        : input.vehicleType === 'Diesel 10T Lorry'
        ? 0.48
        : 0.235; // default CNG

    const transportEmissionsKg = Math.round(distanceKm * vehicleEmissionFactor * 10) / 10;
    const transportEmissionsTonnesCO2e = Math.round((transportEmissionsKg / 1000) * 10000) / 10000;

    // 4. Net Carbon Impact = Avoided Landfill Emissions + Conversion Carbon Benefit - Transport Emissions
    const netCarbonImpactTonnesCO2e =
      Math.round(
        (avoidedLandfillEmissionsTonnesCO2e + conversionCarbonBenefitTonnesCO2e - transportEmissionsTonnesCO2e) * 10
      ) / 10;

    const calc: CarbonCalculation = {
      id: calculationId,
      batchId,
      wasteType: resolvedWasteType,
      quantityTonnes: resolvedQty,
      wasteQuantityTonnes: resolvedQty,
      avoidedLandfillEmissionsTonnesCO2e,
      avoidedLandfillEmissions: avoidedLandfillEmissionsTonnesCO2e,
      conversionCarbonBenefitTonnesCO2e,
      conversionCarbonBenefit: conversionCarbonBenefitTonnesCO2e,
      transportEmissionsTonnesCO2e,
      transportEmissions: transportEmissionsTonnesCO2e,
      transportEmissionsKg,
      netCarbonImpactTonnesCO2e,
      netCarbonImpact: netCarbonImpactTonnesCO2e,
      calculationMethodology:
        'CarbonLoop Scientific Prototype Model v2.0 (IPCC Tier-2 Landfill Methane Avoidance + Pyrolysis C-Fixation)',
      methodologyVersion: 'CarbonLoop-v2.0-Prototype',
      calculatedAt: new Date().toISOString(),
      formulaBreakdown: {
        landfillEmissionFactor,
        conversionEfficiency,
        carbonRetentionFactor,
        vehicleEmissionFactor,
        distanceKm,
        baselineMethaneFactor: landfillEmissionFactor,
        conversionFactor: Math.round(conversionEfficiency * carbonRetentionFactor * 100) / 100,
        transportFuelPenalty: transportEmissionsTonnesCO2e
      }
    };

    this.calculations.set(batchId, calc);
    return calc;
  }

  public getCalculationByBatchId(batchId: string): CarbonCalculation | undefined {
    let calc = this.calculations.get(batchId);
    if (!calc) {
      // Lookup if batch exists
      const allBatches = wasteService.getAllBatches();
      const b =
        wasteService.getBatchById(batchId) ||
        allBatches.find(
          (batch) =>
            batch.id.toLowerCase() === batchId.toLowerCase() ||
            batch.trackingNumber.toLowerCase() === batchId.toLowerCase()
        );

      if (b) {
        calc = this.calculate({
          batchId: b.id,
          wasteType: b.wasteType,
          quantityTonnes: b.quantityTonnes,
          distanceKm: 26.4,
          conversionType: b.preferredConversion
        });
      }
    }
    return calc;
  }
}

export const carbonService = new DeterministicCarbonEngine();
