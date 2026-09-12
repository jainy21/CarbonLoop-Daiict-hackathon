export type UserRole =
  | 'waste_generator'
  | 'facility_operator'
  | 'municipality'
  | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  organization: string;
  facilityId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

export type BatchStatus =
  | 'generated'
  | 'matched'
  | 'collection_scheduled'
  | 'in_transit'
  | 'received'
  | 'converting'
  | 'converted';

export type WasteCategory =
  | 'Agricultural'
  | 'Industrial Organic'
  | 'Food Processing'
  | 'Municipal Solid Waste'
  | 'Forestry Residue';

export type ConversionType =
  | 'Biochar'
  | 'Biogas'
  | 'Carbon-negative materials'
  | 'Compost'
  | 'Gasification Syngas';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
}

export interface WasteBatch {
  id: string;
  trackingNumber: string;
  wasteType: string;
  category: WasteCategory;
  quantityTonnes: number;
  moistureContentPercent?: number;
  availableDate?: string;
  generatorId?: string;
  generatorName: string;
  generatorType: 'Farmer' | 'Food Processor' | 'Municipality' | 'Industrial Factory';
  origin: LocationCoordinates;
  preferredConversion: ConversionType;
  status: BatchStatus;
  facilityId?: string;
  facilityName?: string;
  routeId?: string;
  carbonCalculationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: string;
  name: string;
  location: LocationCoordinates;
  conversionType: ConversionType;
  acceptedWasteTypes: string[];
  totalCapacityTonnesPerDay: number;
  availableCapacityTonnesPerDay: number;
  monthlyCapacity?: number; // tonnes per month (e.g. 2400)
  currentUtilization?: number; // percentage (e.g. 44%)
  conversionEfficiencyPercent: number; // e.g. 88%
  conversionEfficiency?: number; // 0.88
  carbonBenefitFactorPerTonne: number; // e.g. 0.92
  carbonRetentionFactor?: number; // e.g. 0.92
  operationalStatus: 'Active' | 'High Demand' | 'Maintenance';
  status?: 'Active' | 'High Demand' | 'Maintenance';
  verifiedCompliance: boolean;
  contactEmail: string;
  processingCostPerTonneINR: number;
}

export interface RouteWaypoint {
  lat: number;
  lng: number;
  label?: string;
}

export interface Route {
  id: string;
  batchId: string;
  origin: LocationCoordinates;
  destination: LocationCoordinates;
  distanceKm: number;
  durationMinutes: number;
  estimatedLogisticsCostINR: number;
  transportEmissionsKgCO2e: number;
  vehicleType: 'Electric Heavy Truck' | 'CNG Medium Carrier' | 'Diesel 10T Lorry';
  waypoints: RouteWaypoint[];
  polylineCoordinates: [number, number][]; // [lat, lng] array
  createdAt: string;
}

export interface CarbonCalculation {
  id: string;
  batchId: string;
  wasteType: string;
  quantityTonnes: number;
  wasteQuantityTonnes?: number;
  avoidedLandfillEmissionsTonnesCO2e: number;
  avoidedLandfillEmissions?: number;
  conversionCarbonBenefitTonnesCO2e: number;
  conversionCarbonBenefit?: number;
  transportEmissionsTonnesCO2e: number;
  transportEmissions?: number;
  transportEmissionsKg?: number;
  netCarbonImpactTonnesCO2e: number;
  netCarbonImpact?: number;
  calculationMethodology: string;
  methodologyVersion?: string;
  calculatedAt: string;
  formulaBreakdown: {
    landfillEmissionFactor?: number;
    conversionEfficiency?: number;
    carbonRetentionFactor?: number;
    vehicleEmissionFactor?: number;
    distanceKm?: number;
    baselineMethaneFactor?: number;
    conversionFactor?: number;
    transportFuelPenalty?: number;
  };
}

export interface BatchEvent {
  id: string;
  batchId: string;
  status: BatchStatus;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  actor: string;
  txHash?: string;
}

export interface CarbonPassport {
  id: string;
  batchId: string;
  passportNumber: string;
  qrCodeUrl: string;
  publicVerificationUrl: string;
  digitalSealHash: string;
  wasteType: string;
  quantityTonnes: number;
  generatorName: string;
  originName: string;
  facilityName: string;
  conversionPathway: ConversionType;
  transportDistanceKm: number;
  avoidedLandfillTonnesCO2e: number;
  conversionBenefitTonnesCO2e: number;
  transportEmissionsKgCO2e: number;
  netCarbonImpactTonnesCO2e: number;
  issuedAt: string;
  status: 'VERIFIED' | 'IN_TRANSIT' | 'PROCESSING';
  journeyTimeline: BatchEvent[];
}

export interface FacilityMatchScore {
  facility: Facility;
  matchScorePercent: number; // 0-100 (e.g. 92)
  matchScore?: number; // 92
  isRecommended: boolean;
  breakdown: {
    compatibilityScore: number;
    capacityScore: number;
    distanceScore: number;
    efficiencyScore: number;
    carbonBenefitScore: number;
    logisticsCostScore: number;
  };
  componentScores?: {
    compatibility: number; // 0.0 - 1.0
    capacity: number;
    distance: number;
    efficiency: number;
    carbonBenefit: number;
    logisticsCost: number;
  };
  reasons: string[];
  estimatedDistanceKm: number;
  estimatedLogisticsCostINR: number;
  estimatedNetCarbonImpactTonnesCO2e: number;
}

export interface MatchingRecommendationResponse {
  recommendedFacility: Facility;
  matchScore: number;
  reasons: string[];
  componentScores: {
    compatibility: number;
    capacity: number;
    distance: number;
    efficiency: number;
    carbonBenefit: number;
    logisticsCost: number;
  };
  candidates: FacilityMatchScore[];
}

// Future AI Interface Contracts (Section 12)
export interface IFacilityRecommendationEngine {
  recommend(input: {
    batchId?: string;
    wasteType: string;
    quantityTonnes: number;
    origin: LocationCoordinates;
    preferredConversion?: string;
  }): Promise<MatchingRecommendationResponse> | MatchingRecommendationResponse;
}

export interface ICarbonPredictionEngine {
  calculate(input: {
    batchId: string;
    wasteType: string;
    quantityTonnes: number;
    distanceKm: number;
    conversionType?: string;
  }): Promise<CarbonCalculation> | CarbonCalculation;
}

export interface IWasteClassifier {
  classifyWaste(input: { description?: string; imageBase64?: string }): Promise<{
    wasteType: string;
    category: WasteCategory;
    estimatedMoisture: number;
    confidenceScore: number;
  }>;
}

export interface IAnomalyDetectionEngine {
  detectAnomalies(batch: WasteBatch, calculation?: CarbonCalculation): Promise<{
    isAnomalous: boolean;
    flags: string[];
    riskScore: number;
  }>;
}
