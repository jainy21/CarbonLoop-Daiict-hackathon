import React, { useState, useEffect } from 'react';
import { Route, WasteBatch, Facility, RouteDetail } from '../types/index.js';
import { 
  MapPin, 
  Truck, 
  Navigation, 
  Clock, 
  Scale, 
  IndianRupee, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  Gauge,
  RotateCcw,
  Sparkles,
  Building2
} from 'lucide-react';
import { MapView } from '../components/MapView.js';
import { DistanceCard } from '../components/DistanceCard.js';
import { RouteComparison } from '../components/RouteComparison.js';
import { LogisticsSummary } from '../components/LogisticsSummary.js';
import { WasteMarker } from '../components/WasteMarker.js';
import { FacilityMarker } from '../components/FacilityMarker.js';

interface LogisticsMapViewProps {
  activeBatch?: WasteBatch | null;
  selectedFacility?: Facility | null;
  onNavigateToCarbonImpact: (routeData: any) => void;
}

export const LogisticsMapView: React.FC<LogisticsMapViewProps> = ({
  activeBatch,
  selectedFacility,
  onNavigateToCarbonImpact
}) => {
  const [routeData, setRouteData] = useState<Route | null>(null);
  const [vehicleType, setVehicleType] = useState<'CNG Medium Carrier' | 'Electric Heavy Truck' | 'Diesel 10T Lorry'>('CNG Medium Carrier');
  const [activeRouteType, setActiveRouteType] = useState<'recommended' | 'alternative'>('recommended');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRoute = async () => {
    try {
      setLoading(true);
      const origin = activeBatch?.origin || {
        lat: 23.0225,
        lng: 72.5714,
        address: 'APMC Market Yard, Vasna Road',
        city: 'Ahmedabad',
        state: 'Gujarat'
      };

      const destination = selectedFacility?.location || {
        lat: 22.9858,
        lng: 72.3812,
        address: 'Plot 42-B, GIDC Sanand Phase II',
        city: 'Sanand',
        state: 'Gujarat'
      };

      const res = await fetch('/api/routes/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: activeBatch?.id || 'batch-wl-1024',
          origin,
          destination,
          vehicleType,
          weightTonnes: activeBatch?.quantityTonnes || 10
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRouteData(data);
      }
    } catch (err) {
      console.warn('Logistics route optimization error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, [activeBatch, selectedFacility, vehicleType]);

  const origin = activeBatch?.origin || {
    lat: 23.0225,
    lng: 72.5714,
    address: 'APMC Market Yard, Vasna Road',
    city: 'Ahmedabad',
    state: 'Gujarat'
  };

  const destination = selectedFacility?.location || {
    lat: 22.9858,
    lng: 72.3812,
    address: 'Plot 42-B, GIDC Sanand Phase II',
    city: 'Sanand',
    state: 'Gujarat'
  };

  const currentActiveRoute: RouteDetail | undefined = 
    activeRouteType === 'recommended'
      ? routeData?.recommendedRoute
      : routeData?.alternativeRoute;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
            <Truck className="w-3.5 h-3.5" />
            <span>STEP 3 • CARBON-AWARE LOGISTICS & GIS</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100">
            Route Optimization & GIS Transit Ledger
          </h2>
          <p className="text-xs text-slate-400">
            Minimizing haulage distance, vehicle fuel penalties, and logistics overhead between waste origin and conversion plant.
          </p>
        </div>

        {/* Re-calculate button */}
        <button
          type="button"
          onClick={fetchRoute}
          className="text-xs font-semibold text-cyan-300 hover:text-cyan-100 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Recalculate Route
        </button>
      </div>

      {/* 4 Core Metrics Cards */}
      <DistanceCard
        distanceKm={currentActiveRoute?.distanceKm || (activeRouteType === 'recommended' ? 26.4 : 34.8)}
        durationMinutes={currentActiveRoute?.durationMinutes || (activeRouteType === 'recommended' ? 48 : 58)}
        estimatedCostINR={currentActiveRoute?.estimatedCost || (activeRouteType === 'recommended' ? 2140 : 2730)}
        transportEmissionsKgCO2e={currentActiveRoute?.transportEmissionsKgCO2e || (activeRouteType === 'recommended' ? 6.2 : 8.1)}
        originCity={origin.city}
        destinationCity={destination.city}
      />

      {/* Interactive Map View */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            Interactive Gujarat Route Map
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Routing Engine: {routeData?.provider || 'OSRM / Deterministic Hybrid'}
          </span>
        </div>

        <MapView
          origin={origin}
          destination={destination}
          recommendedRoute={routeData?.recommendedRoute}
          alternativeRoute={routeData?.alternativeRoute}
          activeRouteType={activeRouteType}
          facilityName={selectedFacility?.name || 'BioChar Plant A (Sanand)'}
          wasteType={activeBatch?.wasteType || 'Rice Husk'}
        />
      </div>

      {/* Corridor Endpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WasteMarker
          location={origin}
          wasteType={activeBatch?.wasteType || 'Rice Husk'}
          quantityTonnes={activeBatch?.quantityTonnes || 10}
        />
        <FacilityMarker
          facility={selectedFacility}
          location={destination}
        />
      </div>

      {/* Multi-Route Corridor Comparison */}
      {routeData?.comparison && (
        <RouteComparison
          comparison={routeData.comparison}
          activeRouteType={activeRouteType}
          onSelectRouteType={(type) => setActiveRouteType(type)}
        />
      )}

      {/* Vehicle & Cost Formula Breakdown */}
      {currentActiveRoute && (
        <LogisticsSummary
          route={currentActiveRoute}
          vehicleType={vehicleType}
          onVehicleChange={(v) => setVehicleType(v)}
        />
      )}

      {/* Next Step CTA */}
      <div className="glass-panel p-4 rounded-2xl border-slate-800 flex items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          Selected Route: <strong className="text-emerald-300 font-mono">{currentActiveRoute?.distanceKm || 26.4} km</strong> via {currentActiveRoute?.corridorName || 'Sanand Expressway'} (Emissions: {currentActiveRoute?.transportEmissionsKgCO2e || 6.2} kgCO₂e)
        </div>

        <button
          type="button"
          onClick={() => onNavigateToCarbonImpact(routeData || currentActiveRoute)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xl shadow-brand-500/20"
        >
          <span>Proceed to Carbon Impact Model</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

