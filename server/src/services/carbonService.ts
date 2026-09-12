import { CarbonCalculation } from '../types/index.js';
import { EMISSION_FACTORS } from '../data/seedData.js';

export class CarbonService {
  private calculations: Map<string, CarbonCalculation> = new Map();

  public calculateCarbonImpact(input: {
    batchId: string;
    wasteType: string;
    quantityTonnes: number;
    distanceKm: number;
    conversionType?: string;
  }): CarbonCalculation {
    const calculationId = `calc-${Date.now()}`;
    const emissionFactor = EMISSION_FACTORS[input.wasteType] || {
      avoidedLandfillPerTonne: 0.28,
      defaultConversionBenefit: 0.58,
      defaultPathway: 'Biochar'
    };

    // Avoided Landfill Emissions = Quantity * baseline factor
    const baselineMethaneFactor = emissionFactor.avoidedLandfillPerTonne;
    const avoidedLandfillEmissionsTonnesCO2e = Math.round(input.quantityTonnes * baselineMethaneFactor * 100) / 100;

    // Conversion Benefit = Quantity * conversion sequestration factor
    // Flagship: 10t Rice Husk -> ~0.58 tCO2e/t * 10 = 5.8 tCO2e (plus avoided 2.8 tCO2e = 8.6 tCO2e gross)
    const conversionFactor = emissionFactor.defaultConversionBenefit;
    const conversionCarbonBenefitTonnesCO2e = Math.round(input.quantityTonnes * conversionFactor * 100) / 100;

    // Transport emissions = Distance * 0.235 kgCO2e/km / 1000 = ~0.0062 tCO2e (6.2 kgCO2e)
    const transportFuelPenalty = Math.round((input.distanceKm * 0.235) / 10) / 100; // in tonnes
    const transportEmissionsTonnesCO2e = transportFuelPenalty;

    // Net Carbon Impact = Avoided + Conversion - Transport
    const netCarbonImpactTonnesCO2e =
      Math.round((avoidedLandfillEmissionsTonnesCO2e + conversionCarbonBenefitTonnesCO2e - transportEmissionsTonnesCO2e) * 10) / 10;

    const calc: CarbonCalculation = {
      id: calculationId,
      batchId: input.batchId,
      wasteType: input.wasteType,
      quantityTonnes: input.quantityTonnes,
      avoidedLandfillEmissionsTonnesCO2e,
      conversionCarbonBenefitTonnesCO2e,
      transportEmissionsTonnesCO2e,
      netCarbonImpactTonnesCO2e,
      calculationMethodology: 'IPCC Tier-2 Derived Landfill Methane Avoidance & Biochar Stable C-Fixation Model',
      calculatedAt: new Date().toISOString(),
      formulaBreakdown: {
        baselineMethaneFactor,
        conversionFactor,
        transportFuelPenalty
      }
    };

    this.calculations.set(input.batchId, calc);
    return calc;
  }

  public getCalculationByBatchId(batchId: string): CarbonCalculation | undefined {
    return this.calculations.get(batchId);
  }
}

export const carbonService = new CarbonService();
