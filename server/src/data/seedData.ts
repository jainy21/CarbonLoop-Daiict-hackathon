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
    acceptedWasteTypes: ['Rice Husk', 'Cotton Stalks', 'Groundnut Shells', 'Wheat Straw', 'Wood Scrap'],
    totalCapacityTonnesPerDay: 80,
    availableCapacityTonnesPerDay: 45,
    conversionEfficiencyPercent: 88,
    carbonBenefitFactorPerTonne: 0.92, // tCO2e sequestered per tonne biochar feed
    operationalStatus: 'Active',
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
    acceptedWasteTypes: ['Food Processing Waste', 'Municipal Organic Sludge', 'Cattle Manure', 'Vegetable Market Residue'],
    totalCapacityTonnesPerDay: 120,
    availableCapacityTonnesPerDay: 28,
    conversionEfficiencyPercent: 82,
    carbonBenefitFactorPerTonne: 0.68,
    operationalStatus: 'Active',
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
    acceptedWasteTypes: ['Rice Husk', 'Sugarcane Bagasse', 'Mustard Stalks', 'Castor Stalks'],
    totalCapacityTonnesPerDay: 60,
    availableCapacityTonnesPerDay: 12,
    conversionEfficiencyPercent: 84,
    carbonBenefitFactorPerTonne: 0.89,
    operationalStatus: 'High Demand',
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
      address: 'Industrial Circular corridor, Manjusar',
      city: 'Vadodara',
      state: 'Gujarat'
    },
    conversionType: 'Carbon-negative materials',
    acceptedWasteTypes: ['Industrial Cellulose', 'Rice Husk Ash', 'Foundry Slag Organic', 'Sawdust'],
    totalCapacityTonnesPerDay: 100,
    availableCapacityTonnesPerDay: 62,
    conversionEfficiencyPercent: 91,
    carbonBenefitFactorPerTonne: 1.15,
    operationalStatus: 'Active',
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
      city: 'Mehsana',
      state: 'Gujarat'
    },
    conversionType: 'Gasification Syngas',
    acceptedWasteTypes: ['Cotton Stalks', 'Sawdust', 'Agro Residue Briquettes', 'Rice Husk'],
    totalCapacityTonnesPerDay: 50,
    availableCapacityTonnesPerDay: 35,
    conversionEfficiencyPercent: 79,
    carbonBenefitFactorPerTonne: 0.74,
    operationalStatus: 'Active',
    verifiedCompliance: true,
    contactEmail: 'ops@kadienergy.in',
    processingCostPerTonneINR: 190
  }
];

export const EMISSION_FACTORS: Record<
  string,
  { avoidedLandfillPerTonne: number; defaultConversionBenefit: number; defaultPathway: string }
> = {
  'Rice Husk': {
    avoidedLandfillPerTonne: 0.28, // tCO2e/t avoided methane from anaerobic open decomposition
    defaultConversionBenefit: 0.58, // tCO2e/t sequestered stable carbon
    defaultPathway: 'Biochar'
  },
  'Cotton Stalks': {
    avoidedLandfillPerTonne: 0.26,
    defaultConversionBenefit: 0.55,
    defaultPathway: 'Biochar'
  },
  'Food Processing Waste': {
    avoidedLandfillPerTonne: 0.62, // high methane potential in landfills
    defaultConversionBenefit: 0.38,
    defaultPathway: 'Biogas'
  },
  'Sugarcane Bagasse': {
    avoidedLandfillPerTonne: 0.31,
    defaultConversionBenefit: 0.52,
    defaultPathway: 'Biochar'
  },
  'Municipal Organic Sludge': {
    avoidedLandfillPerTonne: 0.58,
    defaultConversionBenefit: 0.40,
    defaultPathway: 'Biogas'
  },
  'Sawdust': {
    avoidedLandfillPerTonne: 0.24,
    defaultConversionBenefit: 0.65,
    defaultPathway: 'Carbon-negative materials'
  }
};

export const SEED_BATCHES: WasteBatch[] = [
  {
    id: 'batch-ahmedabad-demo',
    trackingNumber: 'CLP-2026-0914',
    wasteType: 'Rice Husk',
    category: 'Agricultural',
    quantityTonnes: 10,
    moistureContentPercent: 11,
    generatorName: 'Gujarat Agro Producer Cooperative',
    generatorType: 'Farmer',
    origin: {
      lat: 23.0225,
      lng: 72.5714,
      address: 'APMC Market Yard, Vasna',
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
    trackingNumber: 'CLP-2026-0882',
    wasteType: 'Food Processing Waste',
    category: 'Food Processing',
    quantityTonnes: 18,
    moistureContentPercent: 42,
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
    trackingNumber: 'CLP-2026-0901',
    wasteType: 'Cotton Stalks',
    category: 'Agricultural',
    quantityTonnes: 25,
    moistureContentPercent: 14,
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
      description: '10 tonnes of dry rice husk declared at APMC Market Yard, Vasna.',
      location: 'Vasna, Ahmedabad',
      timestamp: '2026-09-12T08:30:00.000Z',
      actor: 'Gujarat Agro Producer Cooperative',
      txHash: '0x8f2a9c1e...d74e'
    },
    {
      id: 'evt-2',
      batchId: 'batch-ahmedabad-demo',
      status: 'matched',
      title: 'Optimal Facility Matched',
      description: 'Smart Matching Engine ranked BioChar Plant A (92% Match Score).',
      location: 'CarbonLoop Intelligence Engine',
      timestamp: '2026-09-12T08:35:00.000Z',
      actor: 'Matching Engine v2.4',
      txHash: '0x3c9b71a2...f819'
    }
  ],
  'batch-sabarmati-food': [
    {
      id: 'evt-10',
      batchId: 'batch-sabarmati-food',
      status: 'generated',
      title: 'Waste Batch Registered',
      description: '18 tonnes Food Processing Waste registered.',
      location: 'Narol, Ahmedabad',
      timestamp: '2026-09-10T09:15:00.000Z',
      actor: 'Amul Agro Processing Unit 3',
      txHash: '0x1b2c3d4e...a5b6'
    },
    {
      id: 'evt-11',
      batchId: 'batch-sabarmati-food',
      status: 'matched',
      title: 'Facility Assigned',
      description: 'Matched to Sabarmati Bio-Energy Hub.',
      location: 'Ahmedabad',
      timestamp: '2026-09-10T09:30:00.000Z',
      actor: 'System',
      txHash: '0x2c3d4e5f...b6c7'
    },
    {
      id: 'evt-12',
      batchId: 'batch-sabarmati-food',
      status: 'collection_scheduled',
      title: 'Logistics Scheduled',
      description: 'CNG Carrier assigned for pickup at 11:00 AM.',
      location: 'Narol',
      timestamp: '2026-09-10T10:00:00.000Z',
      actor: 'GreenHaul Logistics',
      txHash: '0x3d4e5f6a...c7d8'
    },
    {
      id: 'evt-13',
      batchId: 'batch-sabarmati-food',
      status: 'in_transit',
      title: 'Dispatched & In-Transit',
      description: 'Truck GJ-01-CZ-8812 en route to Pirana facility (14.8 km).',
      location: 'Narol - Pirana Highway',
      timestamp: '2026-09-10T11:15:00.000Z',
      actor: 'Carrier GJ-01',
      txHash: '0x4e5f6a7b...d8e9'
    },
    {
      id: 'evt-14',
      batchId: 'batch-sabarmati-food',
      status: 'received',
      title: 'Intake Weighment Verified',
      description: 'Weighbridge logged 18.04 tonnes gross input.',
      location: 'Pirana Facility Gate 2',
      timestamp: '2026-09-10T12:30:00.000Z',
      actor: 'Intake Inspector',
      txHash: '0x5f6a7b8c...e9f0'
    },
    {
      id: 'evt-15',
      batchId: 'batch-sabarmati-food',
      status: 'converting',
      title: 'Anaerobic Digestion Active',
      description: 'Bio-methanation process initiated in Digester #4.',
      location: 'Sabarmati Bio-Energy Hub',
      timestamp: '2026-09-10T14:00:00.000Z',
      actor: 'Plant Engineer',
      txHash: '0x6a7b8c9d...f0a1'
    },
    {
      id: 'evt-16',
      batchId: 'batch-sabarmati-food',
      status: 'converted',
      title: 'Carbon Value Realized',
      description: 'Yielded 1,620 m³ compressed biogas and organic soil conditioner.',
      location: 'Sabarmati Bio-Energy Hub',
      timestamp: '2026-09-11T16:45:00.000Z',
      actor: 'Certification Unit',
      txHash: '0x7b8c9d0e...a1b2'
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
    wasteType: 'Food Processing Waste',
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
    journeyTimeline: SEED_TIMELINES['batch-sabarmati-food']
  }
};
