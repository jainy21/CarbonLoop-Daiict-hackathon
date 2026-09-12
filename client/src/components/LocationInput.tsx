import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { LocationCoordinates } from '../types/index.js';

interface LocationInputProps {
  location: LocationCoordinates;
  onChangeLocation: (loc: LocationCoordinates) => void;
  errors?: {
    address?: string;
    lat?: string;
    lng?: string;
  };
}

const LOCATION_PRESETS: { label: string; data: LocationCoordinates }[] = [
  {
    label: 'Ahmedabad APMC (Demo Flagship)',
    data: {
      address: 'APMC Market Yard, Vasna Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      lat: 23.0225,
      lng: 72.5714
    }
  },
  {
    label: 'Sanand Agro Cluster',
    data: {
      address: 'Sanand Rural Mandi, Sector 4',
      city: 'Sanand',
      state: 'Gujarat',
      lat: 22.9902,
      lng: 72.3821
    }
  },
  {
    label: 'Narol Food Processing Zone',
    data: {
      address: 'Plot 112, Narol Industrial Estate',
      city: 'Ahmedabad',
      state: 'Gujarat',
      lat: 22.9734,
      lng: 72.6021
    }
  },
  {
    label: 'Kadi Cotton Hub',
    data: {
      address: 'Kadi Cotton Market Yard',
      city: 'Kadi',
      state: 'Gujarat',
      lat: 23.2988,
      lng: 72.3341
    }
  }
];

export const LocationInput: React.FC<LocationInputProps> = ({
  location,
  onChangeLocation,
  errors
}) => {
  const handlePresetSelect = (preset: LocationCoordinates) => {
    onChangeLocation({ ...preset });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand-400" />
          Origin / Waste Pickup Location <span className="text-rose-400">*</span>
        </label>
        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
          <Navigation className="w-3 h-3 text-cyan-400" />
          {location.lat ? `${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E` : 'Coords required'}
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-1.5">
        {LOCATION_PRESETS.map((p) => {
          const isSelected =
            location.lat === p.data.lat && location.lng === p.data.lng;
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => handlePresetSelect(p.data)}
              className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                isSelected
                  ? 'bg-brand-500/20 border-brand-500/60 text-brand-300 font-medium'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/80 text-slate-300'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Address Text */}
      <div className="space-y-1">
        <input
          type="text"
          placeholder="Street address or landmark (e.g. APMC Market Yard, Vasna)"
          value={location.address}
          onChange={(e) =>
            onChangeLocation({ ...location, address: e.target.value })
          }
          className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        {errors?.address && <p className="text-xs text-rose-400">{errors.address}</p>}
      </div>

      {/* City, State & Coordinates Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <input
            type="text"
            placeholder="City (e.g. Ahmedabad)"
            value={location.city}
            onChange={(e) =>
              onChangeLocation({ ...location, city: e.target.value })
            }
            className="w-full bg-slate-900/80 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="State (e.g. Gujarat)"
            value={location.state}
            onChange={(e) =>
              onChangeLocation({ ...location, state: e.target.value })
            }
            className="w-full bg-slate-900/80 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
        <div>
          <input
            type="number"
            step="0.0001"
            placeholder="Latitude (e.g. 23.0225)"
            value={location.lat || ''}
            onChange={(e) =>
              onChangeLocation({
                ...location,
                lat: parseFloat(e.target.value) || 0
              })
            }
            className="w-full bg-slate-900/80 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
          />
          {errors?.lat && <p className="text-[10px] text-rose-400">{errors.lat}</p>}
        </div>
        <div>
          <input
            type="number"
            step="0.0001"
            placeholder="Longitude (e.g. 72.5714)"
            value={location.lng || ''}
            onChange={(e) =>
              onChangeLocation({
                ...location,
                lng: parseFloat(e.target.value) || 0
              })
            }
            className="w-full bg-slate-900/80 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
          />
          {errors?.lng && <p className="text-[10px] text-rose-400">{errors.lng}</p>}
        </div>
      </div>
    </div>
  );
};
