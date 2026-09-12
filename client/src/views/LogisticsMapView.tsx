import React, { useState, useEffect } from 'react';
import { Route, WasteBatch, Facility } from '../types/index.js';
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
  Gauge
} from 'lucide-react';

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
  const [route, setRoute] = useState<Route | null>(null);
  const [vehicleType, setVehicleType] = useState<'CNG Medium Carrier' | 'Electric Heavy Truck' | 'Diesel 10T Lorry'>('CNG Medium Carrier');
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
        city: 'Sanand / Ahmedabad',
        state: 'Gujarat'
      };

      const res = await fetch('/api/routes/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: activeBatch?.id || 'batch-ahmedabad-demo',
          origin,
          destination,
          vehicleType
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRoute(data);
      }
    } catch (err) {
      console.warn('Logistics route error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, [activeBatch, selectedFacility, vehicleType]);

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
            Route Optimization & Transport Emissions
          </h2>
          <p className="text-xs text-slate-400">
            Minimizing haulage distance, vehicle fuel penalties, and logistics overhead between waste origin and conversion plant.
          </p>
        </div>

        {/* Vehicle Selection */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setVehicleType('CNG Medium Carrier')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              vehicleType === 'CNG Medium Carrier'
                ? 'bg-brand-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CNG Carrier (Demo)
          </button>
          <button
            type="button"
            onClick={() => setVehicleType('Electric Heavy Truck')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              vehicleType === 'Electric Heavy Truck'
                ? 'bg-brand-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Electric Truck
          </button>
          <button
            type="button"
            onClick={() => setVehicleType('Diesel 10T Lorry')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              vehicleType === 'Diesel 10T Lorry'
                ? 'bg-brand-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Diesel 10T
          </button>
        </div>
      </div>

      {/* 4 Core Logistics Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            Optimized Distance
          </span>
          <div className="text-2xl font-mono font-black text-cyan-300">
            {route?.distanceKm || 26.4} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
          <div className="text-[11px] text-slate-500">Ahmedabad APMC → Sanand</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Est. Transit Time
          </span>
          <div className="text-2xl font-mono font-black text-indigo-300">
            {route?.durationMinutes || 58} <span className="text-xs font-normal text-slate-400">mins</span>
          </div>
          <div className="text-[11px] text-slate-500">Includes loading/weighment</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            Est. Logistics Cost
          </span>
          <div className="text-2xl font-mono font-black text-emerald-300">
            ₹{(route?.estimatedLogisticsCostINR || 2140).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400/80">Affordable cluster rate</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1 bg-amber-950/20 border-amber-500/20">
          <span className="text-xs text-amber-400 uppercase font-semibold flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            Transport Emissions
          </span>
          <div className="text-2xl font-mono font-black text-amber-300">
            {route?.transportEmissionsKgCO2e || 6.2} <span className="text-xs font-normal text-slate-400">kgCO₂e</span>
          </div>
          <div className="text-[11px] text-amber-400/80">Deducted from gross carbon</div>
        </div>
      </div>

      {/* Interactive GIS Visual Route Panel */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-slate-200">
              Live Corridor Profile: Vasna APMC Mandi ➔ Sanand GIDC Phase II
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Corridor Status: Free-Flow Highway
          </span>
        </div>

        {/* Visual Simulated Route Diagram */}
        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800/80 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            {/* Origin */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 w-full md:w-1/3 text-left">
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold uppercase mb-1">
                <MapPin className="w-3.5 h-3.5" />
                Origin Point
              </div>
              <h4 className="text-sm font-bold text-slate-100">
                {route?.origin.city || 'Ahmedabad'}, Gujarat
              </h4>
              <p className="text-xs text-slate-400 truncate">
                {route?.origin.address || 'APMC Market Yard, Vasna Road'}
              </p>
              <span className="text-[10px] font-mono text-slate-500">
                Lat: 23.0225°N, Lng: 72.5714°E
              </span>
            </div>

            {/* Transit Arrow & Vehicle Indicator */}
            <div className="flex flex-col items-center justify-center space-y-1 text-center">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-400 bg-slate-900 px-3 py-1 rounded-full border border-brand-500/30 shadow-md">
                <Truck className="w-4 h-4" />
                <span>26.4 km • {vehicleType}</span>
              </div>
              <div className="w-32 sm:w-48 h-0.5 bg-gradient-to-r from-cyan-500 via-brand-400 to-indigo-500" />
              <span className="text-[10px] text-slate-500 font-mono">
                Logistics Penalty: -0.0062 tCO₂e
              </span>
            </div>

            {/* Destination */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 w-full md:w-1/3 text-left">
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold uppercase mb-1">
                <MapPin className="w-3.5 h-3.5" />
                Destination Facility
              </div>
              <h4 className="text-sm font-bold text-slate-100">
                {selectedFacility?.name || 'BioChar Plant A (Sanand)'}
              </h4>
              <p className="text-xs text-slate-400 truncate">
                {route?.destination.address || 'Plot 42-B, GIDC Sanand Phase II'}
              </p>
              <span className="text-[10px] font-mono text-slate-500">
                Lat: 22.9858°N, Lng: 72.3812°E
              </span>
            </div>
          </div>
        </div>

        {/* Next Step Action */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={() => onNavigateToCarbonImpact(route)}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg"
          >
            <span>Proceed to Carbon Impact Breakdown</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
