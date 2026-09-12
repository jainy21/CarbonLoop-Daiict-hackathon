import React from 'react';
import { LocationCoordinates } from '../types/index.js';
import { MapPin, Leaf } from 'lucide-react';

interface WasteMarkerProps {
  location: LocationCoordinates;
  wasteType?: string;
  quantityTonnes?: number;
}

export const WasteMarker: React.FC<WasteMarkerProps> = ({
  location,
  wasteType = 'Rice Husk',
  quantityTonnes = 10
}) => {
  return (
    <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 shadow-md space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase">
        <MapPin className="w-3.5 h-3.5" />
        <span>Waste Origin Generator</span>
      </div>
      <h4 className="text-sm font-bold text-slate-100">{location.city}, Gujarat</h4>
      <p className="text-xs text-slate-400 truncate">{location.address}</p>
      <div className="text-[11px] font-mono text-emerald-300 font-semibold pt-1 border-t border-slate-800">
        Feedstock: {quantityTonnes}t {wasteType}
      </div>
    </div>
  );
};
