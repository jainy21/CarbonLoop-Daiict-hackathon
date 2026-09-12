import { CarbonPassport, WasteBatch } from '../types/index.js';
import { SEED_PASSPORTS } from '../data/seedData.js';
import { wasteService } from './wasteService.js';

export class PassportService {
  private passports: Map<string, CarbonPassport> = new Map();

  constructor() {
    Object.entries(SEED_PASSPORTS).forEach(([batchId, pass]) => {
      this.passports.set(batchId, { ...pass });
    });
  }

  public createPassport(batch: WasteBatch, metrics?: {
    transportDistanceKm?: number;
    avoidedLandfillTonnesCO2e?: number;
    conversionBenefitTonnesCO2e?: number;
    transportEmissionsKgCO2e?: number;
    netCarbonImpactTonnesCO2e?: number;
  }): CarbonPassport {
    const passportId = `pass-${batch.id}`;
    const passportNumber = `CLP-PASS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const timeline = wasteService.getTimeline(batch.id);

    const transportDistanceKm = metrics?.transportDistanceKm || 26.4;
    const avoidedLandfill = metrics?.avoidedLandfillTonnesCO2e || Math.round(batch.quantityTonnes * 0.28 * 100) / 100;
    const conversionBenefit = metrics?.conversionBenefitTonnesCO2e || Math.round(batch.quantityTonnes * 0.58 * 100) / 100;
    const transportEmissionsKg = metrics?.transportEmissionsKgCO2e || 6.2;
    const netImpact =
      metrics?.netCarbonImpactTonnesCO2e ||
      Math.round((avoidedLandfill + conversionBenefit - transportEmissionsKg / 1000) * 10) / 10;

    const publicVerificationUrl = `/passport/${batch.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http://localhost:5173/passport/${batch.id}`;
    const digitalSealHash = `SHA256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const passport: CarbonPassport = {
      id: passportId,
      batchId: batch.id,
      passportNumber,
      qrCodeUrl,
      publicVerificationUrl,
      digitalSealHash,
      wasteType: batch.wasteType,
      quantityTonnes: batch.quantityTonnes,
      generatorName: batch.generatorName,
      originName: `${batch.origin.address}, ${batch.origin.city}`,
      facilityName: batch.facilityName || 'BioChar Plant A (Sanand)',
      conversionPathway: batch.preferredConversion,
      transportDistanceKm,
      avoidedLandfillTonnesCO2e: avoidedLandfill,
      conversionBenefitTonnesCO2e: conversionBenefit,
      transportEmissionsKgCO2e: transportEmissionsKg,
      netCarbonImpactTonnesCO2e: netImpact,
      issuedAt: new Date().toISOString(),
      status: 'VERIFIED',
      journeyTimeline: timeline
    };

    this.passports.set(batch.id, passport);
    return passport;
  }

  public getPassportByBatchId(batchId: string): CarbonPassport | undefined {
    if (this.passports.has(batchId)) return this.passports.get(batchId);

    // Lookup batch by id or trackingNumber
    const batch = wasteService.getBatchById(batchId);
    if (batch) {
      if (this.passports.has(batch.id)) return this.passports.get(batch.id);
      if (this.passports.has(batch.trackingNumber)) return this.passports.get(batch.trackingNumber);
      return this.createPassport(batch);
    }

    // Case-insensitive search across existing passports
    const lower = batchId.toLowerCase();
    for (const [key, pass] of this.passports.entries()) {
      if (key.toLowerCase() === lower || pass.batchId.toLowerCase() === lower || pass.passportNumber.toLowerCase() === lower) {
        return pass;
      }
    }
    return undefined;
  }
}

export const passportService = new PassportService();
