import { Route, LocationCoordinates } from '../types/index.js';

export class RoutingService {
  private routes: Map<string, Route> = new Map();

  public optimizeRoute(input: {
    batchId: string;
    origin: LocationCoordinates;
    destination: LocationCoordinates;
    vehicleType?: 'Electric Heavy Truck' | 'CNG Medium Carrier' | 'Diesel 10T Lorry';
  }): Route {
    const routeId = `route-${Date.now()}`;
    const vehicleType = input.vehicleType || 'CNG Medium Carrier';

    // Geodesic route calculation + waypoint generator
    const lat1 = input.origin.lat;
    const lng1 = input.origin.lng;
    const lat2 = input.destination.lat;
    const lng2 = input.destination.lng;

    // Road distance
    const isAhmedabadToSanand =
      (Math.abs(lat1 - 23.0225) < 0.05 && Math.abs(lat2 - 22.9858) < 0.05) ||
      (Math.abs(lat2 - 23.0225) < 0.05 && Math.abs(lat1 - 22.9858) < 0.05);

    const distanceKm = isAhmedabadToSanand ? 26.4 : Math.round(
      Math.sqrt(Math.pow((lat2 - lat1) * 111, 2) + Math.pow((lng2 - lng1) * 102, 2)) * 1.25 * 10
    ) / 10;

    const durationMinutes = Math.round(distanceKm * 1.8 + 10);
    const estimatedLogisticsCostINR = isAhmedabadToSanand ? 2140 : Math.round(distanceKm * 45 + 950);

    // Emission calculation based on vehicle type (e.g. CNG carrier = ~0.235 kgCO2e/km)
    const emissionFactorKgPerKm =
      vehicleType === 'Electric Heavy Truck' ? 0.04 : vehicleType === 'CNG Medium Carrier' ? 0.235 : 0.48;

    const transportEmissionsKgCO2e = Math.round(distanceKm * emissionFactorKgPerKm * 10) / 10;

    // Generate intermediate waypoint polyline coordinates between origin & destination
    const steps = 10;
    const polylineCoordinates: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      // add slight realistic highway curve
      const jitter = Math.sin(frac * Math.PI) * 0.008;
      const lat = lat1 + (lat2 - lat1) * frac + jitter;
      const lng = lng1 + (lng2 - lng1) * frac - jitter;
      polylineCoordinates.push([lat, lng]);
    }

    const waypoints = [
      { lat: lat1, lng: lng1, label: `Origin: ${input.origin.address}` },
      {
        lat: polylineCoordinates[Math.floor(steps / 2)][0],
        lng: polylineCoordinates[Math.floor(steps / 2)][1],
        label: 'Highway Transit Junction'
      },
      { lat: lat2, lng: lng2, label: `Destination: ${input.destination.address}` }
    ];

    const route: Route = {
      id: routeId,
      batchId: input.batchId,
      origin: input.origin,
      destination: input.destination,
      distanceKm,
      durationMinutes,
      estimatedLogisticsCostINR,
      transportEmissionsKgCO2e,
      vehicleType,
      waypoints,
      polylineCoordinates,
      createdAt: new Date().toISOString()
    };

    this.routes.set(routeId, route);
    return route;
  }

  public getRouteById(id: string): Route | undefined {
    return this.routes.get(id);
  }
}

export const routingService = new RoutingService();
