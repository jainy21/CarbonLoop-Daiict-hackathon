import React, { useState, useEffect } from 'react';
import { Facility } from '../types/index.js';
import { 
  Building2, 
  MapPin, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Search, 
  Filter,
  ShieldCheck
} from 'lucide-react';

export const FacilitiesView: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch('/api/facilities');
        if (res.ok) {
          const data = await res.json();
          setFacilities(data);
        }
      } catch (err) {
        console.warn('Could not fetch facilities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  const filteredFacilities = facilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.acceptedWasteTypes.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || f.conversionType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400">
            <Building2 className="w-3.5 h-3.5" />
            <span>VERIFIED CONVERSION INFRASTRUCTURE</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100">
            Regional Carbon Conversion Facilities
          </h2>
          <p className="text-xs text-slate-400">
            Biochar pyrolysis units, anaerobic biogas hubs, and carbon-negative material processors in Gujarat.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search facility name, city, or accepted feedstock..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 appearance-none"
          >
            <option value="all">All Conversion Types</option>
            <option value="Biochar">Biochar</option>
            <option value="Biogas">Biogas</option>
            <option value="Carbon-negative materials">Carbon-negative materials</option>
            <option value="Gasification Syngas">Gasification Syngas</option>
          </select>
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Facility Grid */}
      {loading ? (
        <div className="py-12 flex justify-center items-center text-slate-400 text-xs gap-2">
          <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin"></div>
          Loading conversion facilities database...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="glass-panel p-5 rounded-xl space-y-3.5 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                    {fac.conversionType}
                  </span>
                  <span className="text-[10px] flex items-center gap-1 font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Compliance
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 mb-1">
                  {fac.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{fac.location.address}, {fac.location.city}</span>
                </div>

                {/* Capacity & Efficiency Gauges */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Available Capacity</span>
                    <strong className="text-xs font-mono text-brand-300">
                      {fac.availableCapacityTonnesPerDay} / {fac.totalCapacityTonnesPerDay} t/day
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Conversion Efficiency</span>
                    <strong className="text-xs font-mono text-emerald-300">
                      {fac.conversionEfficiencyPercent}%
                    </strong>
                  </div>
                </div>

                {/* Accepted Waste Tags */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Accepted Feedstock</span>
                  <div className="flex flex-wrap gap-1">
                    {fac.acceptedWasteTypes.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Benefit Factor:</span>
                <span className="text-emerald-400 font-bold">+{fac.carbonBenefitFactorPerTonne} tCO₂e/t</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
