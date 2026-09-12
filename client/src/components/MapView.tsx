import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RouteDetail, LocationCoordinates } from '../types/index.js';
import { MapPin, Building2, Truck, Navigation } from 'lucide-react';

// Custom Map Auto-Fit Controller
function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [bounds, map]);
  return null;
}

interface MapViewProps {
  origin: LocationCoordinates;
  destination: LocationCoordinates;
  recommendedRoute?: RouteDetail;
  alternativeRoute?: RouteDetail;
  activeRouteType?: 'recommended' | 'alternative';
  facilityName?: string;
  wasteType?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  origin,
  destination,
  recommendedRoute,
  alternativeRoute,
  activeRouteType = 'recommended',
  facilityName = 'BioChar Plant A (Sanand)',
  wasteType = 'Rice Husk'
}) => {
  const [mapReady, setMapReady] = useState(false);

  // Custom SVG HTML Icons for Leaflet
  const originIcon = useMemo(
    () =>
      L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: #10b981;
            color: #022c22;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            box-shadow: 0 0 16px rgba(16, 185, 129, 0.6), 0 0 0 4px rgba(16, 185, 129, 0.2);
            border: 2px solid #ecfdf5;
            font-size: 14px;
          ">
            🌾
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      }),
    []
  );

  const destinationIcon = useMemo(
    () =>
      L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: #6366f1;
            color: #ffffff;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            box-shadow: 0 0 16px rgba(99, 102, 241, 0.6), 0 0 0 4px rgba(99, 102, 241, 0.2);
            border: 2px solid #e0e7ff;
            font-size: 15px;
          ">
            🏭
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      }),
    []
  );

  const junctionIcon = useMemo(
    () =>
      L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: #0ea5e9;
            color: #ffffff;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 8px rgba(14, 165, 233, 0.5);
            border: 2px solid #0369a1;
            font-size: 10px;
          ">
            🛣️
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      }),
    []
  );

  const bounds: L.LatLngBoundsExpression = useMemo(() => {
    return [
      [Math.min(origin.lat, destination.lat) - 0.05, Math.min(origin.lng, destination.lng) - 0.05],
      [Math.max(origin.lat, destination.lat) + 0.05, Math.max(origin.lng, destination.lng) + 0.05]
    ];
  }, [origin, destination]);

  const activeRoute = activeRouteType === 'recommended' ? recommendedRoute : alternativeRoute;

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 z-[400] bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] space-y-1 shadow-lg pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
          <span className="text-slate-200">Origin: Generator Mandi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm" />
          <span className="text-slate-200">Destination: Conversion Plant</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-emerald-400 rounded-full" />
          <span className="text-emerald-300 font-semibold">Recommended Route</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-amber-400/80 rounded-full border-b border-dashed border-amber-300" />
          <span className="text-amber-300">Alternative Route</span>
        </div>
      </div>

      {/* Floating Status Pill */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-300 font-mono">
          Corridor: <strong>{activeRoute?.corridorName || 'Sanand-Sardar Patel Ring Road'}</strong> ({activeRoute?.distanceKm || 26.4} km)
        </span>
      </div>

      <MapContainer
        center={[origin.lat, origin.lng]}
        zoom={11}
        scrollWheelZoom={false}
        className="w-full h-full"
        whenReady={() => setMapReady(true)}
      >
        <ChangeView bounds={bounds} />

        {/* High-Contrast Dark Matter Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* 1. Alternative Route Layer (Muted, dashed if secondary) */}
        {alternativeRoute && alternativeRoute.polylineCoordinates && (
          <Polyline
            positions={alternativeRoute.polylineCoordinates}
            pathOptions={{
              color: activeRouteType === 'alternative' ? '#38bdf8' : '#eab308',
              weight: activeRouteType === 'alternative' ? 5 : 3,
              opacity: activeRouteType === 'alternative' ? 0.9 : 0.45,
              dashArray: activeRouteType === 'alternative' ? undefined : '6, 8'
            }}
          >
            <Tooltip sticky>
              <div className="text-xs font-mono">
                <strong>Alternative Route</strong>: {alternativeRoute.distanceKm} km • {alternativeRoute.durationMinutes} mins
              </div>
            </Tooltip>
          </Polyline>
        )}

        {/* 2. Recommended Route Layer (Glowing, bold emerald) */}
        {recommendedRoute && recommendedRoute.polylineCoordinates && (
          <Polyline
            positions={recommendedRoute.polylineCoordinates}
            pathOptions={{
              color: activeRouteType === 'recommended' ? '#10b981' : '#64748b',
              weight: activeRouteType === 'recommended' ? 6 : 4,
              opacity: activeRouteType === 'recommended' ? 0.95 : 0.5
            }}
          >
            <Tooltip sticky>
              <div className="text-xs font-mono">
                <strong>Recommended Route</strong>: {recommendedRoute.distanceKm} km • {recommendedRoute.durationMinutes} mins
              </div>
            </Tooltip>
          </Polyline>
        )}

        {/* 3. Waste Generator Origin Marker */}
        <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
          <Popup className="custom-leaflet-popup">
            <div className="p-1 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                📍 Waste Origin Point
              </span>
              <strong className="text-slate-900 block">{origin.address}</strong>
              <div className="text-slate-600">{origin.city}, {origin.state}</div>
              <div className="text-[10px] text-emerald-700 font-mono font-semibold">
                Feedstock: {wasteType}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* 4. Conversion Facility Destination Marker */}
        <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
          <Popup className="custom-leaflet-popup">
            <div className="p-1 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-indigo-600 block">
                🏭 Conversion Facility
              </span>
              <strong className="text-slate-900 block">{facilityName}</strong>
              <div className="text-slate-600">{destination.address}, {destination.city}</div>
              <div className="text-[10px] text-indigo-700 font-mono font-semibold">
                Target: Biochar Pyrolysis Matrix
              </div>
            </div>
          </Popup>
        </Marker>

        {/* 5. Expressway Waypoint Marker */}
        {activeRoute?.waypoints && activeRoute.waypoints[1] && (
          <Marker
            position={[activeRoute.waypoints[1].lat, activeRoute.waypoints[1].lng]}
            icon={junctionIcon}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 space-y-0.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-cyan-600 block">
                  🛣️ Transit Corridor Waypoint
                </span>
                <strong className="text-slate-900 block">{activeRoute.waypoints[1].label}</strong>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
