import { Facility, WasteBatch, CarbonPassport, BatchEvent } from '../types/index.js';

export const SEED_FACILITIES: Facility[] = [
  {
    id: 'fac-biochar-a',
    name: 'BioChar Plant A (Sanand Industrial Eco-Park)',
    location: {
      lat: 22.9858,
      lng: 72.3812,
      address: 'Plot 42-B, GIDC Sanand Phase II',
      city: 'Sanand / Ahmedabad',
      state: 'Gujarat'
    },
    conversionType: 'Biochar',
    acceptedWasteTypes: ['Rice Husk', 'Agricultural Residue', 'Cotton Stalks', 'Groundnut Shells', 'Wheat Straw', 'Sawdust'],
    totalCapacityTonnesPerDay: 80,
    availableCapacityTonnesPerDay: 45,
    monthlyCapacity: 2400,
    currentUtilization: 44,
    conversionEfficiencyPercent: 88,
    conversionEfficiency: 0.88,
    carbonBenefitFactorPerTonne: 0.92, // tCO2e fixed per tonne
    carbonRetentionFactor: 0.92,
    operationalStatus: 'Active',
    status: 'Active',
    verifiedCompliance: true,
    contactEmail: 'operations@sanandbiochar.in',
    processingCostPerTonneINR: 180
  },
  {
    id: 'fac-sabarmati-biogas',
    name: 'Sabarmati Bio-Energy & CBG Complex',
    location: {
      lat: 22.9912,
      lng: 72.5714,
      address: 'Sector 9, Pirana Clean Energy Zone',
      city: 'Ahmedabad',
      state: 'Gujarat'
    },
    conversionType: 'Biogas',
    acceptedWasteTypes: ['Food Waste', 'Organic Industrial Waste', 'Food Processing Waste', 'Municipal Organic Sludge', 'Vegetable Residue'],
    totalCapacityTonnesPerDay: 120,
    availableCapacityTonnesPerDay: 28,
    monthlyCapacity: 3600,
    currentUtilization: 76,
    conversionEfficiencyPercent: 82,
    conversionEfficiency: 0.82,
    carbonBenefitFactorPerTonne: 0.68,
    carbonRetentionFactor: 0.68,
    operationalStatus: 'Active',
    status: 'Active',
    verifiedCompliance: true,
    contactEmail: 'intake@sabarmatigas.org',
    processingCostPerTonneINR: 210
  },
  {
    id: 'fac-gujarat-agritech',
    name: 'Gujarat Agritech Pyrolysis Facility',
    location: {
      lat: 22.8421,
      lng: 72.3556,
      address: 'Bavla-Bagodara Highway, Km 14',
      city: 'Bavla / Ahmedabad',
      state: 'Gujarat'
    },
    conversionType: 'Biochar',
    acceptedWasteTypes: ['Rice Husk', 'Sugarcane Bagasse', 'Agricultural Residue', 'Cotton Stalks', 'Castor Stalks'],
    totalCapacityTonnesPerDay: 60,
    availableCapacityTonnesPerDay: 12,
    monthlyCapacity: 1800,
    currentUtilization: 80,
    conversionEfficiencyPercent: 84,
    conversionEfficiency: 0.84,
    carbonBenefitFactorPerTonne: 0.89,
    carbonRetentionFactor: 0.89,
    operationalStatus: 'High Demand',
    status: 'High Demand',
    verifiedCompliance: true,
    contactEmail: 'plant@gujaratagritech.com',
    processingCostPerTonneINR: 200
  },
  {
    id: 'fac-baroda-carbon-neg',
    name: 'Baroda Carbon-Negative Composite Hub',
    location: {
      lat: 22.3119,
      lng: 73.1812,
      address: 'Industrial Circular Corridor, Manjusar',
      city: 'Vadodara',
      state: 'Gujarat'
    },
    conversionType: 'Carbon-negative materials',
    acceptedWasteTypes: ['Sawdust', 'Organic Industrial Waste', 'Rice Husk', 'Cellulose Fiber'],
    totalCapacityTonnesPerDay: 100,
    availableCapacityTonnesPerDay: 62,
    monthlyCapacity: 3000,
    currentUtilization: 38,
    conversionEfficiencyPercent: 91,
    conversionEfficiency: 0.91,
    carbonBenefitFactorPerTonne: 1.15,
    carbonRetentionFactor: 1.15,
    operationalStatus: 'Active',
    status: 'Active',
    verifiedCompliance: true,
    contactEmail: 'contact@barodacarbon.tech',
    processingCostPerTonneINR: 320
  },
  {
    id: 'fac-kadi-mehsana',
    name: 'North Gujarat Biomass Gasification Station',
    location: {
      lat: 23.3015,
      lng: 72.3318,
      address: 'Kadi Green Industrial Belt',
      city: 'Kadi / Mehsana',
      state: 'Gujarat'
    },
    conversionType: 'Gasification Syngas',
    acceptedWasteTypes: ['Agricultural Residue', 'Cotton Stalks', 'Sawdust', 'Rice Husk'],
    totalCapacityTonnesPerDay: 50,
    availableCapacityTonnesPerDay: 35,
    monthlyCapacity: 1500,
    currentUtilization: 30,
    conversionEfficiencyPercent: 79,
    conversionEfficiency: 0.79,
    carbonBenefitFactorPerTonne: 0.74,
    carbonRetentionFactor: 0.74,
    operationalStatus: 'Active',
    status: 'Active',
    verifiedCompliance: true,
    contactEmail: 'ops@kadienergy.in',
    processingCostPerTonneINR: 190
  },
  {
    id: 'fac-gandhinagar-biochar',
    name: 'Gandhinagar Green Biochar Station',
    location: {
      lat: 23.2156,
      lng: 72.6369,
      address: 'Sector 28 Industrial Estate',
      city: 'Gandhinagar',
      state: 'Gujarat'
    },
    conversionType: 'Biochar',
    acceptedWasteTypes: ['Agricultural Residue', 'Rice Husk', 'Wood Waste', 'Sawdust'],
    totalCapacityTonnesPerDay: 70,
    availableCapacityTonnesPerDay: 30,
    monthlyCapacity: 2100,
    currentUtilization: 57,
    conversionEfficiencyPercent: 86,
    conversionEfficiency: 0.86,
    carbonBenefitFactorPerTonne: 0.90,
    carbonRetentionFactor: 0.90,
    operationalStatus: 'Active',
    status: 'Active',
    verifiedCompliance: true,
    contactEmail: 'info@gandhinagarbiochar.in',
    processingCostPerTonneINR: 185
  },
  {
    id: 'fac-anand-biogas',
    name: 'Anand Biomethanation & Organic Power Hub',
    location: {
      lat: 22.5645,
      lng: 72.9289,
      address: 'Dairy Technology Park, Mogar',
      city: 'Anand',
      state: 'Gujarat'
    },
    conversionType: 'Biogas',
    acceptedWasteTypes: ['Food Waste', 'Organic Industrial Waste', 'Food Processing Waste', 'Cattle Residue'],
    totalCapacityTonnesPerDay: 90,
    availableCapacityTonnesPerDay: 40,
    monthlyCapacity: 2700,
    currentUtilization: 55,
    conversionEfficiencyPercent: 83,
    conversionEfficiency: 0.83,
    carbonBenefitFactorPerTonne: 0.70,
    carbonRetentionFactor: 0.70,
    operationalStatus: 'Active',
    status: 'Active',
    verifiedCompliance: true,
    contactEmail: 'operations@anandbiopower.org',
    processingCostPerTonneINR: 205
  },
  {
    id: 'fac-nadiad-pyrolysis',
    name: 'Nadiad Agrichar Sequestration Works',
    location: {
      lat: 22.6916,
      lng: 72.8634,
      address: 'Uttarsanda Road Bio-Hub',
      city: 'Nadiad',
      state: 'Gujarat'
    },
    conversionType: 'Biochar',
    acceptedWasteTypes: ['Sugarcane Bagasse', 'Rice Husk', 'Agricultural Residue', 'Mustard Stalks'],
    totalCapacityTonnesPerDay: 65,
    availableCapacityTonnesPerDay: 20,
    monthlyCapacity: 1950,
    currentUtilization: 69,
    conversionEfficiencyPercent: 85,
    conversionEfficiency: 0.85,
    carbonBenefitFactorPerTonne: 0.88,
    carbonRetentionFactor: 0.88,
    operationalStatus: 'Active',
    status: 'Active',
    verifiedCompliance: true,
    contactEmail: 'contact@nadiadagrichar.com',
    processingCostPerTonneINR: 195
  },
  {
    id: 'fac-kalol-syngas',
    name: 'Kalol Clean SynGas Facility',
    location: {
      lat: 23.2541,
      lng: 72.4962,
      address: 'GIDC Industrial Area, Phase I',
      city: 'Kalol / Gandhinagar',
      state: 'Gujarat'
    },
    conversionType: 'Gasification Syngas',
    acceptedWasteTypes: ['Sawdust', 'Organic Industrial Waste', 'Agricultural Residue', 'Wood Scrap'],
    totalCapacityTonnesPerDay: 55,
    availableCapacityTonnesPerDay: 25,
    monthlyCapacity: 1650,
    currentUtilization: 54,
    conversionEfficiencyPercent: 80,
    conversionEfficiency: 0.80,
    carbonBenefitFactorPerTonne: 0.76,
    carbonRetentionFactor: 0.76,
    operationalStatus: 'Active',
    status: 'Active',
    verifiedCompliance: true,
    contactEmail: 'kalol@cleansyngas.in',
    processingCostPerTonneINR: 190
  },
  {
    id: 'fac-viramgam-carbon',
    name: 'Viramgam Agro-Carbon Pyrolysis Plant',
    location: {
      lat: 23.1256,
      lng: 72.0321,
      address: 'State Highway 7, Cotton Ginning Belt',
      city: 'Viramgam / Ahmedabad',
      state: 'Gujarat'
    },
    conversionType: 'Biochar',
    acceptedWasteTypes: ['Cotton Stalks', 'Agricultural Residue', 'Rice Husk', 'Sesame Stalks'],
    totalCapacityTonnesPerDay: 75,
    availableCapacityTonnesPerDay: 50,
    monthlyCapacity: 2250,
    currentUtilization: 33,
    conversionEfficiencyPercent: 87,
    conversionEfficiency: 0.87,
    carbonBenefitFactorPerTonne: 0.91,
    carbonRetentionFactor: 0.91,
    operationalStatus: 'Active',
    status: 'Active',
    verifiedCompliance: true,
    contactEmail: 'viramgam@agrocarbon.org',
    processingCostPerTonneINR: 175
  }
];

export const EMISSION_FACTORS: Record<
  string,
  {
    landfillEmissionFactor: number; // tCO2e avoided per tonne (baseline methane factor)
    carbonRetentionFactor: number; // tCO2e fixed per tonne
    defaultEfficiency: number; // 0-1
    defaultPathway: string;
  }
> = {
  'Rice Husk': {
    landfillEmissionFactor: 0.28,
    carbonRetentionFactor: 0.92,
    defaultEfficiency: 0.88,
    defaultPathway: 'Biochar'
  },
  'Food Waste': {
    landfillEmissionFactor: 0.62,
    carbonRetentionFactor: 0.55,
    defaultEfficiency: 0.82,
    defaultPathway: 'Biogas'
  },
  'Sugarcane Bagasse': {
    landfillEmissionFactor: 0.31,
    carbonRetentionFactor: 0.85,
    defaultEfficiency: 0.84,
    defaultPathway: 'Biochar'
  },
  'Sawdust': {
    landfillEmissionFactor: 0.24,
    carbonRetentionFactor: 1.05,
    defaultEfficiency: 0.90,
    defaultPathway: 'Carbon-negative materials'
  },
  'Agricultural Residue': {
    landfillEmissionFactor: 0.26,
    carbonRetentionFactor: 0.82,
    defaultEfficiency: 0.80,
    defaultPathway: 'Biochar'
  },
  'Organic Industrial Waste': {
    landfillEmissionFactor: 0.45,
    carbonRetentionFactor: 0.75,
    defaultEfficiency: 0.85,
    defaultPathway: 'Biogas'
  },
  // Aliases for user flexibility
  'Cotton Stalks': {
    landfillEmissionFactor: 0.26,
    carbonRetentionFactor: 0.88,
    defaultEfficiency: 0.87,
    defaultPathway: 'Biochar'
  },
  'Food Processing Waste': {
    landfillEmissionFactor: 0.62,
    carbonRetentionFactor: 0.55,
    defaultEfficiency: 0.82,
    defaultPathway: 'Biogas'
  }
};

export const SEED_BATCHES: WasteBatch[] = [
  {
    id: 'batch-ahmedabad-demo',
    trackingNumber: 'WL-1024',
    wasteType: 'Rice Husk',
    category: 'Agricultural',
    quantityTonnes: 10,
    moistureContentPercent: 11,
    generatorId: 'usr-generator-1',
    generatorName: 'Gujarat Agro Producer Cooperative',
    generatorType: 'Farmer',
    origin: {
      lat: 23.0225,
      lng: 72.5714,
      address: 'APMC Market Yard, Vasna Road',
      city: 'Ahmedabad',
      state: 'Gujarat'
    },
    preferredConversion: 'Biochar',
    status: 'matched',
    facilityId: 'fac-biochar-a',
    facilityName: 'BioChar Plant A (Sanand Industrial Eco-Park)',
    createdAt: '2026-09-12T08:30:00.000Z',
    updatedAt: '2026-09-12T08:35:00.000Z'
  },
  {
    id: 'batch-sabarmati-food',
    trackingNumber: 'WL-1025',
    wasteType: 'Food Waste',
    category: 'Food Processing',
    quantityTonnes: 18,
    moistureContentPercent: 42,
    generatorId: 'usr-generator-1',
    generatorName: 'Amul Agro Processing Unit 3',
    generatorType: 'Food Processor',
    origin: {
      lat: 22.9734,
      lng: 72.6021,
      address: 'Narol Industrial Estate',
      city: 'Ahmedabad',
      state: 'Gujarat'
    },
    preferredConversion: 'Biogas',
    status: 'converted',
    facilityId: 'fac-sabarmati-biogas',
    facilityName: 'Sabarmati Bio-Energy & CBG Complex',
    createdAt: '2026-09-10T09:15:00.000Z',
    updatedAt: '2026-09-11T16:45:00.000Z'
  },
  {
    id: 'batch-cotton-kadi',
    trackingNumber: 'WL-1026',
    wasteType: 'Agricultural Residue',
    category: 'Agricultural',
    quantityTonnes: 25,
    moistureContentPercent: 14,
    generatorId: 'usr-generator-1',
    generatorName: 'Kadi Cotton Ginning Association',
    generatorType: 'Farmer',
    origin: {
      lat: 23.2988,
      lng: 72.3341,
      address: 'Ginning Mills Yard Road',
      city: 'Kadi',
      state: 'Gujarat'
    },
    preferredConversion: 'Biochar',
    status: 'in_transit',
    facilityId: 'fac-kadi-mehsana',
    facilityName: 'North Gujarat Biomass Gasification Station',
    createdAt: '2026-09-11T14:20:00.000Z',
    updatedAt: '2026-09-12T09:10:00.000Z'
  }
];

export const SEED_TIMELINES: Record<string, BatchEvent[]> = {
  'batch-ahmedabad-demo': [
    {
      id: 'evt-1',
      batchId: 'batch-ahmedabad-demo',
      status: 'generated',
      title: 'Waste Batch Registered',
      description: '10 tonnes of dry rice husk declared at APMC Market Yard, Vasna Road, Ahmedabad.',
      location: 'Ahmedabad, Gujarat',
      timestamp: '2026-09-12T08:30:00.000Z',
      actor: 'Gujarat Agro Producer Cooperative',
      txHash: '0x8f2a9c1e...d74e'
    },
    {
      id: 'evt-2',
      batchId: 'batch-ahmedabad-demo',
      status: 'matched',
      title: 'Optimal Facility Matched',
      description: 'Smart Matching Engine ranked BioChar Plant A (92% Match Score) as optimal partner.',
      location: 'CarbonLoop Intelligence Engine',
      timestamp: '2026-09-12T08:35:00.000Z',
      actor: 'RuleBasedFacilityRecommendationEngine v2.0',
      txHash: '0x3c9b71a2...f819'
    }
  ]
};

export const SEED_PASSPORTS: Record<string, CarbonPassport> = {
  'batch-sabarmati-food': {
    id: 'pass-sabarmati-food',
    batchId: 'batch-sabarmati-food',
    passportNumber: 'CLP-PASS-2026-7789',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http://localhost:5173/passport/batch-sabarmati-food',
    publicVerificationUrl: '/passport/batch-sabarmati-food',
    digitalSealHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    wasteType: 'Food Waste',
    quantityTonnes: 18,
    generatorName: 'Amul Agro Processing Unit 3',
    originName: 'Narol Industrial Estate, Ahmedabad',
    facilityName: 'Sabarmati Bio-Energy & CBG Complex',
    conversionPathway: 'Biogas',
    transportDistanceKm: 14.8,
    avoidedLandfillTonnesCO2e: 11.16,
    conversionBenefitTonnesCO2e: 6.84,
    transportEmissionsKgCO2e: 4.8,
    netCarbonImpactTonnesCO2e: 17.995,
    issuedAt: '2026-09-11T17:00:00.000Z',
    status: 'VERIFIED',
    journeyTimeline: []
  }
};
