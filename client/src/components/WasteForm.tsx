import React, { useState } from 'react';
import { CreateBatchInput, PreferredConversion, WasteType } from '../types/index.js';
import { QuantityInput } from './QuantityInput.js';
import { LocationInput } from './LocationInput.js';
import { 
  Leaf, 
  Sparkles, 
  Calendar, 
  Droplet, 
  ArrowRight, 
  Building, 
  Flame, 
  Check, 
  RotateCcw,
  Zap
} from 'lucide-react';

interface WasteFormProps {
  onSubmit: (input: CreateBatchInput) => Promise<void>;
  isLoading?: boolean;
  onSelectFlagshipPreset?: () => void;
}

const WASTE_TYPES: { id: string; label: string; category: string; description: string }[] = [
  {
    id: 'Rice Husk',
    label: 'Rice Husk',
    category: 'Agricultural',
    description: 'High silica lignocellulosic biomass ideal for high-porosity Biochar.'
  },
  {
    id: 'Sugarcane Bagasse',
    label: 'Sugarcane Bagasse',
    category: 'Agricultural',
    description: 'Fibrous byproduct with strong pyrolysis & biochar carbon-fixation potential.'
  },
  {
    id: 'Food Waste',
    label: 'Food Waste',
    category: 'Food Processing',
    description: 'High moisture organic sludge suited for anaerobic biogas/CBG conversion.'
  },
  {
    id: 'Agricultural Residue',
    label: 'Agricultural Residue',
    category: 'Agricultural',
    description: 'Mixed farm crop stalks, stubble and cotton hulls for carbon sequestration.'
  },
  {
    id: 'Sawdust',
    label: 'Sawdust',
    category: 'Forestry Residue',
    description: 'Clean wood particles for durable carbon-negative composites and biochar.'
  },
  {
    id: 'Organic Industrial Waste',
    label: 'Organic Industrial Waste',
    category: 'Industrial Organic',
    description: 'Spent grain, pulp, molasses effluents from food & pharma processing.'
  }
];

const PREFERRED_CONVERSIONS: { id: PreferredConversion; label: string; icon: React.ElementType }[] = [
  { id: 'Biochar', label: 'Biochar (Long-term Carbon Removal)', icon: Flame },
  { id: 'Biogas', label: 'Biogas / CBG (Clean Energy + Digestate)', icon: Sparkles },
  { id: 'Carbon-negative material', label: 'Carbon-Negative Materials', icon: Building },
  { id: 'Any suitable pathway', label: 'Any Suitable Pathway (System Optimized)', icon: Leaf }
];

export const WasteForm: React.FC<WasteFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [wasteType, setWasteType] = useState<WasteType>('Rice Husk');
  const [quantity, setQuantity] = useState<number | ''>(10);
  const [unit, setUnit] = useState<'kg' | 'tonnes'>('tonnes');
  const [moisture, setMoisture] = useState<number | ''>(11);
  const [availableDate, setAvailableDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [preferredConversion, setPreferredConversion] = useState<PreferredConversion>('Biochar');
  const [generatorName, setGeneratorName] = useState<string>('Gujarat Agro Producer Cooperative');

  const [location, setLocation] = useState({
    address: 'APMC Market Yard, Vasna Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!wasteType) newErrors.wasteType = 'Please select a waste type.';

    if (quantity === '' || quantity <= 0) {
      newErrors.quantity = 'Please enter a valid quantity greater than 0.';
    }

    if (!location.address.trim()) {
      newErrors.address = 'Pickup address is required.';
    }

    if (!location.lat || isNaN(location.lat) || location.lat < -90 || location.lat > 90) {
      newErrors.lat = 'Valid latitude (-90 to 90) required.';
    }

    if (!location.lng || isNaN(location.lng) || location.lng < -180 || location.lng > 180) {
      newErrors.lng = 'Valid longitude (-180 to 180) required.';
    }

    if (moisture !== '' && (moisture < 0 || moisture > 100)) {
      newErrors.moisture = 'Moisture must be between 0% and 100%.';
    }

    if (!availableDate) {
      newErrors.availableDate = 'Available pickup date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      wasteType,
      quantity: quantity as number,
      unit,
      location,
      moisture: moisture === '' ? undefined : (moisture as number),
      availableDate,
      preferredConversion,
      generatorName: generatorName.trim() || undefined
    });
  };

  const handleLoadFlagshipDemo = () => {
    setWasteType('Rice Husk');
    setQuantity(10);
    setUnit('tonnes');
    setMoisture(11);
    setAvailableDate(new Date().toISOString().split('T')[0]);
    setPreferredConversion('Biochar');
    setGeneratorName('Gujarat Agro Producer Cooperative');
    setLocation({
      address: 'APMC Market Yard, Vasna Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      lat: 23.0225,
      lng: 72.5714
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo helper banner */}
      <div className="flex flex-wrap items-center justify-between p-3 rounded-lg bg-brand-950/40 border border-brand-500/30 gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-medium text-brand-200">
            Hackathon Demonstration Preset
          </span>
        </div>
        <button
          type="button"
          onClick={handleLoadFlagshipDemo}
          className="text-xs font-semibold px-3 py-1 rounded bg-brand-500 hover:bg-brand-400 text-slate-950 transition-colors flex items-center gap-1 shadow-sm"
        >
          <span>Load Ahmedabad Flagship (10t Rice Husk)</span>
        </button>
      </div>

      {/* Waste Type Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5 text-brand-400" />
          Waste Type & Feedstock <span className="text-rose-400">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {WASTE_TYPES.map((type) => {
            const isSelected = wasteType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setWasteType(type.id)}
                className={`text-left p-3 rounded-lg border transition-all relative ${
                  isSelected
                    ? 'bg-slate-900 border-brand-500 ring-1 ring-brand-500/30 shadow-md'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-brand-300' : 'text-slate-200'}`}>
                    {type.label}
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-brand-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {type.description}
                </p>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {type.category}
                </span>
              </button>
            );
          })}
        </div>
        {errors.wasteType && <p className="text-xs text-rose-400">{errors.wasteType}</p>}
      </div>

      {/* Quantity & Generator Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <QuantityInput
          quantity={quantity}
          unit={unit}
          onChangeQuantity={setQuantity}
          onChangeUnit={setUnit}
          error={errors.quantity}
        />

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Generator / Organization Name
          </label>
          <input
            type="text"
            placeholder="e.g. Gujarat Agro Producer Cooperative"
            value={generatorName}
            onChange={(e) => setGeneratorName(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
          <p className="text-[11px] text-slate-500">
            Farm cooperative, municipal node, or food manufacturing facility.
          </p>
        </div>
      </div>

      {/* Location Input */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <LocationInput
          location={location}
          onChangeLocation={setLocation}
          errors={{
            address: errors.address,
            lat: errors.lat,
            lng: errors.lng
          }}
        />
      </div>

      {/* Moisture & Available Date Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-cyan-400" />
              Moisture Content (Optional)
            </label>
            {moisture !== '' && (
              <span className="text-xs font-mono text-cyan-400">
                {moisture}%
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              placeholder="e.g. 11 (%)"
              value={moisture}
              onChange={(e) =>
                setMoisture(e.target.value === '' ? '' : parseFloat(e.target.value))
              }
              className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
            />
            <span className="absolute right-3.5 top-2.5 text-sm text-slate-400 font-mono">%</span>
          </div>
          {errors.moisture && <p className="text-xs text-rose-400">{errors.moisture}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Available Pickup Date <span className="text-rose-400">*</span>
          </label>
          <input
            type="date"
            value={availableDate}
            onChange={(e) => setAvailableDate(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500 [color-scheme:dark]"
          />
          {errors.availableDate && <p className="text-xs text-rose-400">{errors.availableDate}</p>}
        </div>
      </div>

      {/* Preferred Conversion Pathway */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          Preferred Conversion Pathway
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PREFERRED_CONVERSIONS.map((path) => {
            const isSelected = preferredConversion === path.id;
            const Icon = path.icon;
            return (
              <button
                key={path.id}
                type="button"
                onClick={() => setPreferredConversion(path.id)}
                className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all ${
                  isSelected
                    ? 'bg-brand-950/40 border-brand-500/80 text-brand-200 ring-1 ring-brand-500/20 shadow-md'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-500/20 text-brand-300' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">{path.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleLoadFlagshipDemo}
          className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to Demo
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>Registering Batch...</span>
            </>
          ) : (
            <>
              <span>Find Best Carbon Path</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
