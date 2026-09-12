import { Router, Request, Response } from 'express';
import { wasteService } from '../services/wasteService.js';
import { matchingService } from '../services/matchingService.js';
import { routingService } from '../services/routingService.js';
import { carbonService } from '../services/carbonService.js';
import { passportService } from '../services/passportService.js';
import { optionalAuthenticate, authenticate, authorize, AuthenticatedRequest } from '../middleware/auth.js';
import { BatchStatus } from '../types/index.js';
import authRouter from './auth.js';

const router = Router();

// Mount authentication sub-router
router.use('/auth', authRouter);

// Helper to safely get string param
const getParam = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
};

// ==========================================
// 1. WASTE BATCH ENDPOINTS (Developer 1 Module)
// ==========================================

/**
 * POST /api/waste-batches
 * Create a new waste batch (Allowed for: waste_generator, admin)
 */
router.post('/waste-batches', optionalAuthenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    // If authenticated, enforce role restriction
    if (req.user) {
      if (req.user.role !== 'waste_generator' && req.user.role !== 'admin') {
        return res.status(403).json({
          error: `Forbidden: Only waste generators and administrators can register waste batches. Your role is '${req.user.role}'.`
        });
      }
    }

    const {
      wasteType,
      category,
      quantityTonnes,
      moistureContentPercent,
      availableDate,
      generatorName,
      generatorType,
      origin,
      preferredConversion
    } = req.body;

    if (!wasteType) {
      return res.status(400).json({ error: 'wasteType is required' });
    }

    if (!quantityTonnes || isNaN(Number(quantityTonnes)) || Number(quantityTonnes) <= 0) {
      return res.status(400).json({ error: 'quantityTonnes must be a positive number' });
    }

    if (!origin || !origin.address || origin.lat === undefined || origin.lng === undefined) {
      return res.status(400).json({ error: 'Valid origin location with address, lat, and lng is required' });
    }

    const resolvedGeneratorName = generatorName || req.user?.name || req.user?.organization || 'Registered Waste Producer';

    const batch = wasteService.createBatch({
      wasteType,
      category,
      quantityTonnes: Number(quantityTonnes),
      moistureContentPercent: moistureContentPercent ? Number(moistureContentPercent) : undefined,
      availableDate,
      generatorId: req.user?.id,
      generatorName: resolvedGeneratorName,
      generatorType: generatorType || 'Farmer',
      origin,
      preferredConversion
    });

    return res.status(201).json(batch);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create waste batch' });
  }
});

/**
 * GET /api/waste-batches
 * Fetch list of waste batches with role-aware filtering
 */
router.get('/waste-batches', optionalAuthenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, wasteType, search } = req.query;

    let generatorIdFilter: string | undefined = undefined;
    let facilityIdFilter: string | undefined = undefined;

    // If user is logged in as waste_generator, filter by their generatorId
    if (req.user && req.user.role === 'waste_generator') {
      generatorIdFilter = req.user.id;
    }

    // If user is facility_operator with an assigned facility, filter to batches for that facility
    if (req.user && req.user.role === 'facility_operator' && req.user.facilityId) {
      facilityIdFilter = req.user.facilityId;
    }

    let batches = wasteService.getAllBatches({
      status: status as string,
      wasteType: wasteType as string,
      search: search as string,
      generatorId: generatorIdFilter,
      facilityId: facilityIdFilter
    });

    // If generator filter returned empty, return all user-accessible demo batches so UI never breaks
    if (batches.length === 0 && req.user?.role === 'waste_generator') {
      batches = wasteService.getAllBatches({
        status: status as string,
        wasteType: wasteType as string,
        search: search as string
      });
    }

    return res.json(batches);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to retrieve batches' });
  }
});

/**
 * GET /api/waste-batches/:id
 * Retrieve single batch by ID
 */
router.get('/waste-batches/:id', (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const batch = wasteService.getBatchById(id);
    if (!batch) {
      return res.status(404).json({ error: `Waste batch '${id}' not found` });
    }
    return res.json(batch);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/waste-batches/:id/status
 * Transition batch status across standard lifecycle
 */
router.patch('/waste-batches/:id/status', optionalAuthenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { status, actor, location, description, facilityId, facilityName } = req.body;
    const validStatuses: BatchStatus[] = [
      'generated',
      'matched',
      'collection_scheduled',
      'in_transit',
      'received',
      'converting',
      'converted'
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const resolvedActor = actor || req.user?.name || req.user?.organization || 'CarbonLoop Lifecycle Engine';

    const result = wasteService.updateBatchStatus(id, status, {
      actor: resolvedActor,
      location,
      description,
      facilityId,
      facilityName
    });

    return res.json(result);
  } catch (err: any) {
    return res.status(404).json({ error: err.message || 'Failed to update batch status' });
  }
});

/**
 * GET /api/batches/:id/timeline
 * Get chronological timeline of batch lifecycle events
 */
router.get('/batches/:id/timeline', (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const timeline = wasteService.getTimeline(id);
    return res.json(timeline);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. FACILITIES & MATCHING (Developer 2 Module)
// ==========================================

/**
 * GET /api/facilities
 * Retrieve conversion facilities with optional filtering
 */
router.get('/facilities', (req: Request, res: Response) => {
  try {
    const { conversionType, wasteType, search } = req.query;
    const facilities = matchingService.getFacilities({
      conversionType: conversionType as string,
      wasteType: wasteType as string,
      search: search as string
    });
    return res.json(facilities);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/facilities/:id
 * Retrieve single conversion facility by ID
 */
router.get('/facilities/:id', (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const facility = matchingService.getFacilityById(id);
    if (!facility) {
      return res.status(404).json({ error: `Facility '${id}' not found` });
    }
    return res.json(facility);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/matching/recommend
 * Smart matching algorithm ranking facilities via explainable weighted scoring:
 * (Compatibility 30% + Capacity 20% + Distance 15% + Efficiency 15% + Carbon Benefit 15% + Logistics Cost 5%)
 */
router.post('/matching/recommend', (req: Request, res: Response) => {
  try {
    const { batchId, wasteType, quantityTonnes, origin, preferredConversion } = req.body;

    // Must provide either batchId OR (wasteType + origin)
    if (!batchId && (!wasteType || !origin)) {
      return res.status(400).json({
        error: 'Either batchId (e.g. "WL-1024") or { wasteType, quantityTonnes, origin } is required for matching'
      });
    }

    const recommendations = matchingService.recommend({
      batchId,
      wasteType,
      quantityTonnes: quantityTonnes ? Number(quantityTonnes) : undefined,
      origin,
      preferredConversion
    });

    return res.json(recommendations);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Matching evaluation failed' });
  }
});

// ==========================================
// 3. LOGISTICS & ROUTING (Developer 3 Module)
// ==========================================

/**
 * POST /api/routes/optimize
 */
router.post('/routes/optimize', (req: Request, res: Response) => {
  try {
    const { batchId, origin, destination, vehicleType } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ error: 'origin and destination are required' });
    }

    const route = routingService.optimizeRoute({
      batchId: batchId || 'temp-batch',
      origin,
      destination,
      vehicleType
    });

    return res.json(route);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/routes/:id
 */
router.get('/routes/:id', (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const route = routingService.getRouteById(id);
    if (!route) {
      return res.status(404).json({ error: `Route '${id}' not found` });
    }
    return res.json(route);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. CARBON ENGINE & PASSPORTS (Developer 2 & 4 Modules)
// ==========================================

/**
 * POST /api/carbon/calculate
 * Carbon impact calculation model:
 * (Avoided Landfill + Conversion Carbon Benefit - Transport Emissions = Net Carbon Impact)
 */
router.post('/carbon/calculate', (req: Request, res: Response) => {
  try {
    const { batchId, wasteType, quantityTonnes, distanceKm, conversionType, vehicleType } = req.body;

    const calc = carbonService.calculate({
      batchId,
      wasteType,
      quantityTonnes: quantityTonnes ? Number(quantityTonnes) : undefined,
      distanceKm: distanceKm ? Number(distanceKm) : undefined,
      conversionType,
      vehicleType
    });

    return res.json(calc);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Carbon calculation failed' });
  }
});

/**
 * GET /api/carbon/:batchId
 */
router.get('/carbon/:batchId', (req: Request, res: Response) => {
  try {
    const batchId = getParam(req.params.batchId);
    const calc = carbonService.getCalculationByBatchId(batchId);
    if (!calc) {
      return res.status(404).json({ error: `Carbon calculation for batch '${batchId}' not found` });
    }
    return res.json(calc);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/passports
 */
router.post('/passports', (req: Request, res: Response) => {
  try {
    const { batchId, metrics } = req.body;
    const batch = wasteService.getBatchById(batchId);
    if (!batch) {
      return res.status(404).json({ error: `Waste batch '${batchId}' not found` });
    }
    const passport = passportService.createPassport(batch, metrics);
    return res.status(201).json(passport);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/passports/:batchId
 * NOTE: MUST REMAIN PUBLICLY ACCESSIBLE for QR scan verification!
 */
router.get('/passports/:batchId', (req: Request, res: Response) => {
  try {
    const batchId = getParam(req.params.batchId);
    const passport = passportService.getPassportByBatchId(batchId);
    if (!passport) {
      return res.status(404).json({ error: `Passport for batch '${batchId}' not found` });
    }
    return res.json(passport);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
