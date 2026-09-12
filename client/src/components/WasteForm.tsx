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
  ArrowLeft,
  Building, 
  Flame, 
  Check, 
  RotateCcw,
  Zap,
  MapPin,
  Scale,
  ShieldCheck,
  CheckCircle2
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

const PREFERRED_CONVERSIONS: { id: PreferredConversion; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'Any suitable pathway', label: 'Auto-Select (Recommended)', icon: Leaf, desc: 'CarbonLoop AI determines the highest net carbon & efficiency pathway' },
  { id: 'Biochar', label: 'Biochar Pyrolysis', icon: Flame, desc: 'High-permanence carbon removal (100+ yr soil storage)' },
  { id: 'Biogas', label: 'Biogas / Anaerobic Digestion', icon: Sparkles, desc: 'Methane abatement + clean renewable energy & digestate' },
  { id: 'Carbon-negative material', label: 'Carbon-Negative Materials', icon: Building, desc: 'Sustainable composites & structural materials' }
];

export const WasteForm: React.FC<WasteFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
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

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!wasteType) newErrors.wasteType = 'Please select a waste type.';
    if (quantity === '' || quantity <= 0) {
      newErrors.quantity = 'Please enter a valid quantity greater than 0.';
    }
    if (moisture !== '' && (moisture < 0 || moisture > 100)) {
      newErrors.moisture = 'Moisture must be between 0% and 100%.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!location.address.trim()) {
      newErrors.address = 'Pickup address is required.';
    }
    if (!location.lat || isNaN(location.lat) || location.lat < -90 || location.lat > 90) {
      newErrors.lat = 'Valid latitude (-90 to 90) required.';
    }
    if (!location.lng || isNaN(location.lng) || location.lng < -180 || location.lng > 180) {
      newErrors.lng = 'Valid longitude (-180 to 180) required.';
    }
    if (!availableDate) {
      newErrors.availableDate = 'Available pickup date is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleNextToStep3 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;

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
      {/* Demo helper preset banner */}
      <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-brand-950/40 border border-brand-500/30 gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-medium text-brand-200">
            Hackathon Demonstration Preset
          </span>
        </div>
        <button
          type="button"
          onClick={handleLoadFlagshipDemo}
          className="text-xs font-semibold px-3 py-1 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
        >
          <span>Load Ahmedabad Flagship (10t Rice Husk)</span>
        </button>
      </div>

      {/* 3-Step Wizard Navigation */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            currentStep === 1
              ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
              : currentStep > 1
              ? 'bg-brand-500/10 text-brand-300 hover:bg-brand-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-900/50 text-[11px] font-mono">
            {currentStep > 1 ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
          </span>
          <span className="hidden sm:inline">STEP 1 —</span>
          <span>Waste Details</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (validateStep1()) setCurrentStep(2);
          }}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            currentStep === 2
              ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
              : currentStep > 2
              ? 'bg-brand-500/10 text-brand-300 hover:bg-brand-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-900/50 text-[11px] font-mono">
            {currentStep > 2 ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
          </span>
          <span className="hidden sm:inline">STEP 2 —</span>
          <span>Origin & Availability</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (validateStep1() && validateStep2()) setCurrentStep(3);
          }}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            currentStep === 3
              ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-900/50 text-[11px] font-mono">
            3
          </span>
          <span className="hidden sm:inline">STEP 3 —</span>
          <span>Review & Create</span>
        </button>
      </div>

      {/* STEP 1: WASTE DETAILS */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Feedstock Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-brand-400" />
              Feedstock & Waste Type <span className="text-rose-400">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {WASTE_TYPES.map((type) => {
                const isSelected = wasteType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setWasteType(type.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all relative cursor-pointer ${
                      isSelected
                        ? 'bg-brand-950/40 border-brand-500 ring-1 ring-brand-500/40 shadow-lg shadow-brand-500/10'
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

          {/* Quantity & Moisture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <QuantityInput
              quantity={quantity}
              unit={unit}
              onChangeQuantity={setQuantity}
              onChangeUnit={setUnit}
              error={errors.quantity}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                Moisture Content % (Optional)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 11% for dry rice husk"
                value={moisture}
                onChange={(e) => setMoisture(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <p className="text-[11px] text-slate-500">
                Determines energy density and facility reactor compatibility.
              </p>
              {errors.moisture && <p className="text-xs text-rose-400">{errors.moisture}</p>}
            </div>
          </div>

          {/* Preferred Pathway */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Preferred Carbon Conversion Pathway
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PREFERRED_CONVERSIONS.map((conv) => {
                const isSelected = preferredConversion === conv.id;
                const Icon = conv.icon;
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setPreferredConversion(conv.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-brand-500 ring-1 ring-brand-500/40 text-brand-300'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-brand-400" />
                      <span className="text-xs font-bold text-slate-100">{conv.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{conv.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleNextToStep2}
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20 cursor-pointer"
            >
              <span>Continue to Origin & Availability</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ORIGIN & AVAILABILITY */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Location Input with Map Coordinates & Presets */}
          <LocationInput
            location={location}
            onChangeLocation={setLocation}
            errors={{
              address: errors.address,
              lat: errors.lat,
              lng: errors.lng
            }}
          />

          {/* Generator Org & Availability Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                Generator / Producer Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Gujarat Agro Producer Cooperative"
                value={generatorName}
                onChange={(e) => setGeneratorName(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <p className="text-[11px] text-slate-500">
                Registered farm, cooperative, or food processing entity.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-400" />
                Available Pickup Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={availableDate}
                onChange={(e) => setAvailableDate(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              {errors.availableDate && <p className="text-xs text-rose-400">{errors.availableDate}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2]" />
              <span>Back to Waste Details</span>
            </button>

            <button
              type="button"
              onClick={handleNextToStep3}
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20 cursor-pointer"
            >
              <span>Review Batch Summary</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & CREATE */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Review Summary Card */}
          <div className="glass-panel p-6 rounded-2xl border border-brand-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
                <h4 className="text-base font-bold text-slate-100">Waste Batch Pre-Submission Review</h4>
              </div>
              <span className="text-[11px] font-mono text-brand-300 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/30">
                Ready for Smart Matching
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Feedstock Material</span>
                <div className="text-sm font-bold text-slate-100">{wasteType}</div>
                <div className="text-[11px] text-slate-400">{moisture !== '' ? `${moisture}% Moisture` : 'Standard Moisture'}</div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Quantity</span>
                <div className="text-sm font-mono font-bold text-emerald-300">{quantity} {unit}</div>
                <div className="text-[11px] text-slate-400">Baseline Diversion Available</div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Target Pathway</span>
                <div className="text-sm font-bold text-brand-300">{preferredConversion}</div>
                <div className="text-[11px] text-slate-400">Optimal Matching Criteria</div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Origin Pickup Hub</span>
                <div className="text-sm font-bold text-slate-100">{location.address}</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {location.city}, {location.state} • ({location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E)
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Available Date</span>
                <div className="text-sm font-bold text-slate-100">{availableDate}</div>
                <div className="text-[11px] text-slate-400">Producer: {generatorName}</div>
              </div>
            </div>

            {/* Estimated Landfill baseline callout */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">
                Estimated Baseline Landfill Methane Avoided:
              </span>
              <span className="font-mono font-bold text-emerald-400">
                ~{(Number(quantity || 0) * 0.28).toFixed(2)} tCO₂e
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2]" />
              <span>Back to Origin</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-500 via-emerald-500 to-teal-400 hover:from-brand-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xl shadow-brand-500/25 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Registering Batch & Finding Best Pathway...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  <span>Create Waste Batch & Run Matcher</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
