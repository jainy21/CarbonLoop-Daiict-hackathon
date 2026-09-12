import React from 'react';
import { 
  Building2, 
  TrendingUp, 
  Scale, 
  Leaf, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Download,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const MunicipalityAnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400">
            <Building2 className="w-3.5 h-3.5" />
            <span>MUNICIPALITY CLIMATE INTELLIGENCE</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100">
            Ahmedabad Regional Waste Diversion & Carbon Analytics
          </h2>
          <p className="text-xs text-slate-400">
            Official municipal oversight: monitoring landfill diversion quotas, methane emissions avoided, and biochar sequestration across Gujarat hubs.
          </p>
        </div>

        <button
          onClick={() => alert('Municipal Environmental Report exported successfully.')}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export AMC Climate Audit</span>
        </button>
      </div>

      {/* 4 Core Municipal Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-brand-400" />
            Total Diverted Waste
          </span>
          <div className="text-2xl font-mono font-black text-slate-100">
            1,428.6 <span className="text-xs font-normal text-slate-400">Tonnes</span>
          </div>
          <div className="text-[11px] text-emerald-400">91.4% diversion rate vs target</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Avoided Landfill Methane
          </span>
          <div className="text-2xl font-mono font-black text-emerald-300">
            +398.2 <span className="text-xs font-normal text-slate-400">tCO₂e</span>
          </div>
          <div className="text-[11px] text-slate-400">Pirana & Vasna landfills</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Biochar Fixed Carbon
          </span>
          <div className="text-2xl font-mono font-black text-amber-300">
            +782.4 <span className="text-xs font-normal text-slate-400">tCO₂e</span>
          </div>
          <div className="text-[11px] text-slate-400">Sanand & Bavla hubs</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/30">
          <span className="text-xs text-indigo-400 uppercase font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Verified Passports Issued
          </span>
          <div className="text-2xl font-mono font-black text-indigo-300">
            142 <span className="text-xs font-normal text-slate-400">Batches</span>
          </div>
          <div className="text-[11px] text-indigo-300">100% auditable public trace</div>
        </div>
      </div>

      {/* Municipal Breakdown Table */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-400" />
          Zonal Municipal Solid Waste & Agro Feedstock Streams
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase">
                <th className="py-3 px-4">Municipal Zone</th>
                <th className="py-3 px-4">Primary Feedstock</th>
                <th className="py-3 px-4">Monthly Intake</th>
                <th className="py-3 px-4">Designated Facility</th>
                <th className="py-3 px-4">Net Carbon Offset</th>
                <th className="py-3 px-4 text-right">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              <tr className="hover:bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-slate-200">Ahmedabad South (Vasna/Pirana)</td>
                <td className="py-3 px-4 text-slate-300">Rice Husk & APMC Agro Residue</td>
                <td className="py-3 px-4 font-mono text-emerald-300">420 Tonnes</td>
                <td className="py-3 px-4 text-cyan-300">BioChar Plant A (Sanand)</td>
                <td className="py-3 px-4 font-mono text-emerald-400">+352.8 tCO₂e</td>
                <td className="py-3 px-4 text-right text-emerald-400 font-semibold">✓ 100% Compliant</td>
              </tr>
              <tr className="hover:bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-slate-200">Ahmedabad East (Narol Industrial)</td>
                <td className="py-3 px-4 text-slate-300">Food Processing Organic Sludge</td>
                <td className="py-3 px-4 font-mono text-emerald-300">310 Tonnes</td>
                <td className="py-3 px-4 text-cyan-300">Sabarmati Bio-Energy Hub</td>
                <td className="py-3 px-4 font-mono text-emerald-400">+210.8 tCO₂e</td>
                <td className="py-3 px-4 text-right text-emerald-400 font-semibold">✓ 100% Compliant</td>
              </tr>
              <tr className="hover:bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-slate-200">Ahmedabad North (Kadi Corridor)</td>
                <td className="py-3 px-4 text-slate-300">Cotton Ginning Stalks</td>
                <td className="py-3 px-4 font-mono text-emerald-300">550 Tonnes</td>
                <td className="py-3 px-4 text-cyan-300">Kadi Gasification Works</td>
                <td className="py-3 px-4 font-mono text-emerald-400">+407.0 tCO₂e</td>
                <td className="py-3 px-4 text-right text-emerald-400 font-semibold">✓ 100% Compliant</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
