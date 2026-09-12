import { LocationCoordinates, GeocodingResult } from '../types/index.js';

export class GeocodingService {
  private knownLocations: Map<string, LocationCoordinates> = new Map([
    // Major Cities & Hubs
    [
      'ahmedabad',
      {
        lat: 23.0225,
        lng: 72.5714,
        address: 'APMC Market Yard, Vasna Road',
        city: 'Ahmedabad',
        state: 'Gujarat'
      }
    ],
    [
      'vasna',
      {
        lat: 23.0035,
        lng: 72.5485,
        address: 'Vasna APMC Agricultural Market',
        city: 'Ahmedabad',
        state: 'Gujarat'
      }
    ],
    [
      'sanand',
      {
        lat: 22.9858,
        lng: 72.3812,
        address: 'GIDC Sanand Phase II Eco-Park',
        city: 'Sanand',
        state: 'Gujarat'
      }
    ],
    [
      'gandhinagar',
      {
        lat: 23.2156,
        lng: 72.6369,
        address: 'Sector 28 GIDC Electronic & Green Park',
        city: 'Gandhinagar',
        state: 'Gujarat'
      }
    ],
    [
      'mehsana',
      {
        lat: 23.5880,
        lng: 72.3693,
        address: 'North Gujarat Agri-Processing Corridor',
        city: 'Mehsana',
        state: 'Gujarat'
      }
    ],
    [
      'anand',
      {
        lat: 22.5645,
        lng: 72.9289,
        address: 'Anand-Kheda Dairy & Bio-Digestion Cluster',
        city: 'Anand',
        state: 'Gujarat'
      }
    ],
    [
      'vadodara',
      {
        lat: 22.3072,
        lng: 73.1812,
        address: 'Manjusar GIDC Industrial Estate',
        city: 'Vadodara',
        state: 'Gujarat'
      }
    ],
    [
      'baroda',
      {
        lat: 22.3072,
        lng: 73.1812,
        address: 'Manjusar GIDC Industrial Estate',
        city: 'Vadodara',
        state: 'Gujarat'
      }
    ],
    [
      'bavla',
      {
        lat: 22.8361,
        lng: 72.3619,
        address: 'Bavla Agri-Rice Milling Cluster',
        city: 'Bavla',
        state: 'Gujarat'
      }
    ],
    [
      'kalol',
      {
        lat: 23.2384,
        lng: 72.4975,
        address: 'Kalol Industrial Area',
        city: 'Kalol',
        state: 'Gujarat'
      }
    ],
    [
      'viramgam',
      {
        lat: 23.1256,
        lng: 72.0345,
        address: 'Viramgam Agri Supply Logistics Hub',
        city: 'Viramgam',
        state: 'Gujarat'
      }
    ],
    [
      'nadiad',
      {
        lat: 22.6916,
        lng: 72.8634,
        address: 'Nadiad Biomass Pre-Processing Yard',
        city: 'Nadiad',
        state: 'Gujarat'
      }
    ],
    [
      'surat',
      {
        lat: 21.1702,
        lng: 72.8311,
        address: 'Sachin GIDC Industrial Belt',
        city: 'Surat',
        state: 'Gujarat'
      }
    ],
    [
      'rajkot',
      {
        lat: 22.3039,
        lng: 70.8022,
        address: 'Metoda GIDC Green Energy Zone',
        city: 'Rajkot',
        state: 'Gujarat'
      }
    ],
    [
      'bharuch',
      {
        lat: 21.7051,
        lng: 72.9959,
        address: 'Ankleshwar-Bharuch Industrial Belt',
        city: 'Bharuch',
        state: 'Gujarat'
      }
    ]
  ]);

  /**
   * Resolve freeform location query to Gujarat coordinates
   */
  public geocode(query: string): GeocodingResult {
    if (!query || typeof query !== 'string') {
      return {
        query: 'Default Location',
        address: 'APMC Market Yard, Vasna Road',
        city: 'Ahmedabad',
        state: 'Gujarat',
        lat: 23.0225,
        lng: 72.5714,
        confidence: 0.5,
        displayName: 'APMC Market Yard, Vasna Road, Ahmedabad, Gujarat'
      };
    }

    const clean = query.trim().toLowerCase();

    // Check direct known dictionary matches
    for (const [key, loc] of this.knownLocations.entries()) {
      if (clean.includes(key) || key.includes(clean)) {
        return {
          query,
          address: loc.address,
          city: loc.city,
          state: loc.state,
          lat: loc.lat,
          lng: loc.lng,
          confidence: 0.95,
          displayName: `${loc.address}, ${loc.city}, ${loc.state}`
        };
      }
    }

    // Default fallback to Ahmedabad Hub
    return {
      query,
      address: query,
      city: 'Ahmedabad',
      state: 'Gujarat',
      lat: 23.0225 + (Math.sin(query.length) * 0.05),
      lng: 72.5714 + (Math.cos(query.length) * 0.05),
      confidence: 0.6,
      displayName: `${query}, Gujarat, India`
    };
  }

  /**
   * Reverse geocode coordinates to nearest known Gujarat location name
   */
  public reverseGeocode(lat: number, lng: number): LocationCoordinates {
    let nearest: LocationCoordinates = {
      lat,
      lng,
      address: `Location (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`,
      city: 'Gujarat Region',
      state: 'Gujarat'
    };
    let minDistance = Infinity;

    for (const [, loc] of this.knownLocations.entries()) {
      const d = Math.hypot(lat - loc.lat, lng - loc.lng);
      if (d < minDistance) {
        minDistance = d;
        nearest = { ...loc, lat, lng };
      }
    }

    return nearest;
  }
}

export const geocodingService = new GeocodingService();
