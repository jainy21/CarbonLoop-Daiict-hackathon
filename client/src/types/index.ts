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
  conversionType: string;
  acceptedWasteTypes: string[];
  totalCapacityTonnesPerDay: number;
  availableCapacityTonnesPerDay: number;
  conversionEfficiencyPercent: number;
  carbonBenefitFactorPerTonne: number;
  operationalStatus: 'Active' | 'High Demand' | 'Maintenance';
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
