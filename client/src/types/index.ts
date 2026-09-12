export type UserRole =
  | 'waste_generator'
  | 'facility_operator'
  | 'municipality'
  | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  facilityId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export type BatchStatus =
  | 'generated'
  | 'matched'
  | 'collection_scheduled'
  | 'in_transit'
  | 'received'
  | 'converting'
  | 'converted';

export type WasteType =
  | 'Rice Husk'
  | 'Sugarcane Bagasse'
  | 'Food Waste'
  | 'Agricultural Residue'
  | 'Sawdust'
  | 'Organic Industrial Waste'
  | string;

export type PreferredConversion =
  | 'Biochar'
  | 'Biogas'
  | 'Carbon-negative material'
  | 'Any suitable pathway';

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
  category: string;
  quantityTonnes: number;
  moistureContentPercent?: number;
  availableDate?: string;
  generatorId?: string;
  generatorName: string;
  generatorType: 'Farmer' | 'Food Processor' | 'Municipality' | 'Industrial Factory';
  origin: LocationCoordinates;
  preferredConversion: PreferredConversion;
  status: BatchStatus;
  facilityId?: string;
  facilityName?: string;
  routeId?: string;
  carbonCalculationId?: string;
  estimatedCarbonImpactTonnesCO2e?: number;
  createdAt: string;
  updatedAt: string;
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

export interface CreateBatchInput {
  wasteType: string;
  quantity: number;
  unit: 'kg' | 'tonnes';
  location: LocationCoordinates;
  moisture?: number;
  availableDate?: string;
  preferredConversion: PreferredConversion;
  generatorName?: string;
}

export interface Facility {
  id: string;
  name: string;
  location: LocationCoordinates;
  conversionType: 'Biochar' | 'Biogas' | 'Carbon-negative material' | string;
  acceptedWasteTypes: string[];
  totalCapacityTonnesPerDay: number;
  availableCapacityTonnesPerDay: number;
  monthlyCapacity?: number;
  currentUtilization?: number;
  conversionEfficiency?: number;
  conversionEfficiencyPercent: number;
  carbonRetentionFactor?: number;
  carbonBenefitFactorPerTonne: number;
  operationalStatus: 'Active' | 'High Demand' | 'Maintenance';
  status?: 'Active' | 'High Demand' | 'Maintenance' | string;
  verifiedCompliance: boolean;
  contactEmail: string;
  processingCostPerTonneINR: number;
}

export interface FacilityComponentScores {
  compatibility: number;
  capacity: number;
  distance: number;
  efficiency: number;
  carbonBenefit: number;
  logisticsCost: number;
}

export interface FacilityMatchScore {
  facility: Facility;
  matchScore: number;
  matchScorePercent: number;
  isRecommended: boolean;
  reasons: string[];
  componentScores?: FacilityComponentScores;
  breakdown: {
    compatibilityScore: number;
    capacityScore: number;
    distanceScore: number;
    efficiencyScore: number;
    carbonBenefitScore: number;
    logisticsCostScore: number;
  };
  estimatedDistanceKm: number;
  estimatedLogisticsCostINR: number;
  estimatedNetCarbonImpactTonnesCO2e: number;
}

export interface MatchingRecommendationResponse {
  recommendedFacility: Facility;
  matchScore: number;
  reasons: string[];
  componentScores: FacilityComponentScores;
  candidates: FacilityMatchScore[];
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
  transportEmissionsKg: number;
  netCarbonImpactTonnesCO2e: number;
  netCarbonImpact?: number;
  calculationMethodology: string;
  methodologyVersion: string;
  calculatedAt: string;
  formulaBreakdown: {
    landfillEmissionFactor: number;
    conversionEfficiency: number;
    carbonRetentionFactor: number;
    vehicleEmissionFactor: number;
    distanceKm: number;
    baselineMethaneFactor: number;
    conversionFactor: number;
    transportFuelPenalty: number;
  };
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
  polylineCoordinates: [number, number][];
  createdAt: string;
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
  conversionPathway: string;
  transportDistanceKm: number;
  avoidedLandfillTonnesCO2e: number;
  conversionBenefitTonnesCO2e: number;
  transportEmissionsKgCO2e: number;
  netCarbonImpactTonnesCO2e: number;
  issuedAt: string;
  status: 'VERIFIED' | 'IN_TRANSIT' | 'PROCESSING';
  journeyTimeline: BatchEvent[];
}

