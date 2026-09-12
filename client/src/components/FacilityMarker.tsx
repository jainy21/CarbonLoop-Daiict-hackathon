import React from 'react';
import { Facility, LocationCoordinates } from '../types/index.js';
import { Building2, Activity, MapPin } from 'lucide-react';

interface FacilityMarkerProps {
  facility?: Facility | null;
  location?: LocationCoordinates;
}

export const FacilityMarker: React.FC<FacilityMarkerProps> = ({
  facility,
  location = facility?.location || {
    lat: 22.9858,
    lng: 72.3812,
    address: 'Plot 42-B, GIDC Sanand Phase II',
    city: 'Sanand',
    state: 'Gujarat'
  }
}) => {
  return (
    <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/30 shadow-md space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold uppercase">
        <Building2 className="w-3.5 h-3.5" />
        <span>Conversion Facility</span>
      </div>
      <h4 className="text-sm font-bold text-slate-100">{facility?.name || 'BioChar Plant A (Sanand)'}</h4>
      <p className="text-xs text-slate-400 truncate">{location.address}, {location.city}</p>
      <div className="flex items-center justify-between text-[11px] font-mono text-indigo-300 font-semibold pt-1 border-t border-slate-800">
        <span>Pathway: {facility?.conversionType || 'Biochar'}</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <Activity className="w-3 h-3" />
          {facility?.operationalStatus || 'Active'}
        </span>
      </div>
    </div>
  );
};
