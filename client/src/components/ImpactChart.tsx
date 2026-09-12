import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Building2, 
  Leaf, 
  Calendar, 
  Sparkles,
  Layers
} from 'lucide-react';

interface ImpactChartProps {
  className?: string;
}

export const ImpactChart: React.FC<ImpactChartProps> = ({ className = '' }) => {
  const [activeChartView, setActiveChartView] = useState<'all' | 'diversion' | 'carbon' | 'waste' | 'facility'>('all');

  // 1. Waste Diversion Trend Data (Jan - Aug 2026, Tonnes)
  const diversionTrend = [
    { month: 'Jan', tonnes: 14.2, target: 12 },
    { month: 'Feb', tonnes: 18.5, target: 15 },
    { month: 'Mar', tonnes: 24.8, target: 20 },
    { month: 'Apr', tonnes: 32.1, target: 25 },
    { month: 'May', tonnes: 48.6, target: 40 },
    { month: 'Jun', tonnes: 76.4, target: 60 },
    { month: 'Jul', tonnes: 98.2, target: 80 },
    { month: 'Aug', tonnes: 128.4, target: 100 },
  ];

  // 2. Carbon Impact Trend Data (Cumulative tCO2e Sequestered / Avoided)
  const carbonImpactTrend = [
    { month: 'Jan', netCO2: 10.4, grossAvoided: 12.1 },
    { month: 'Feb', netCO2: 23.8, grossAvoided: 27.2 },
    { month: 'Mar', netCO2: 41.6, grossAvoided: 48.0 },
    { month: 'Apr', netCO2: 65.2, grossAvoided: 74.8 },
    { month: 'May', netCO2: 94.7, grossAvoided: 108.5 },
  ];

  // 3. Waste Type Distribution Data
  const wasteDistribution = [
    { type: 'Rice Husk', percentage: 42, tonnes: 54.0, color: '#10b981', conversion: 'Biochar' },
    { type: 'Food Waste', percentage: 26, tonnes: 33.4, color: '#06b6d4', conversion: 'Biogas' },
    { type: 'Sugarcane Bagasse', percentage: 18, tonnes: 23.1, color: '#8b5cf6', conversion: 'Biochar' },
    { type: 'Sawdust & Wood', percentage: 14, tonnes: 17.9, color: '#f59e0b', conversion: 'C-Materials' },
  ];

  // 4. Conversion Facility Utilization Data
  const facilityUtilization = [
    { name: 'BioChar Plant A (Sanand)', type: 'Biochar', current: 35, capacity: 80, rate: 44, color: '#10b981' },
    { name: 'Sabarmati Bio-Energy CBG', type: 'Biogas', current: 92, capacity: 120, rate: 76, color: '#06b6d4' },
    { name: 'Gujarat Agritech Pyrolysis', type: 'Biochar', current: 48, capacity: 60, rate: 80, color: '#f59e0b' },
    { name: 'Baroda C-Negative Hub', type: 'Materials', current: 38, capacity: 100, rate: 38, color: '#8b5cf6' },
  ];

  const maxDiversion = Math.max(...diversionTrend.map((d) => d.tonnes));
  const maxCarbon = Math.max(...carbonImpactTrend.map((c) => c.netCO2));

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Chart View Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Circular Carbon Analytics Engine
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'all', label: 'All 4 Metrics' },
            { id: 'diversion', label: 'Waste Diversion' },
            { id: 'carbon', label: 'Carbon Impact' },
            { id: 'waste', label: 'Feedstock Mix' },
            { id: 'facility', label: 'Facility Load' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveChartView(tab.id as any)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                activeChartView === tab.id
                  ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 4 Meaningful Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Waste Diversion Trend */}
        {(activeChartView === 'all' || activeChartView === 'diversion') && (
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  Waste Diversion Trend
                </h4>
                <p className="text-[11px] text-slate-400">
                  Cumulative volume diverted from open dumping & landfills (Tonnes)
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                128.4t Total
              </span>
            </div>

            {/* Bar Chart Visualization */}
            <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800/80">
              {diversionTrend.map((item) => {
                const heightPct = Math.round((item.tonnes / maxDiversion) * 100);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      {item.tonnes}t
                    </span>
                    <div className="w-full max-w-[28px] bg-slate-800 rounded-t-md h-full flex items-end overflow-hidden p-0.5">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full bg-gradient-to-t from-emerald-600 to-brand-400 rounded-t-sm group-hover:brightness-125 transition-all duration-500 shadow-md shadow-emerald-500/20"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Baseline: Jan 2026 (14.2t)</span>
              <span className="text-emerald-400 font-bold">+804% YTD Growth</span>
            </div>
          </div>
        )}

        {/* 2. Carbon Impact Trend */}
        {(activeChartView === 'all' || activeChartView === 'carbon') && (
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  Carbon Impact Trend
                </h4>
                <p className="text-[11px] text-slate-400">
                  Net sequestered & avoided greenhouse gases (tCO₂e)
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                94.7 tCO₂e Net
              </span>
            </div>

            {/* Stepped Area / Bar Progress Visualization */}
            <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800/80">
              {carbonImpactTrend.map((item) => {
                const netPct = Math.round((item.netCO2 / maxCarbon) * 100);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      +{item.netCO2}
                    </span>
                    <div className="w-full max-w-[36px] bg-slate-900 border border-slate-800 rounded-t-lg h-full flex flex-col justify-end p-1 relative overflow-hidden">
                      <div
                        style={{ height: `${netPct}%` }}
                        className="w-full bg-gradient-to-t from-cyan-600 via-teal-500 to-emerald-400 rounded-t-md group-hover:brightness-125 transition-all duration-500"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Prototype Methodology (IPCC Tier-2)</span>
              <span className="text-cyan-400 font-bold">Avg 0.74 tCO₂e / Tonne</span>
            </div>
          </div>
        )}

        {/* 3. Waste Type Distribution */}
        {(activeChartView === 'all' || activeChartView === 'waste') && (
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5 text-brand-400" />
                  Waste Type Distribution
                </h4>
                <p className="text-[11px] text-slate-400">
                  Feedstock composition across active regional clusters
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-brand-300">
                4 Key Feedstocks
              </span>
            </div>

            {/* Segmented Stacked Progress Bar */}
            <div className="space-y-3 pt-2">
              <div className="h-4 w-full rounded-full bg-slate-900 overflow-hidden flex shadow-inner">
                {wasteDistribution.map((item) => (
                  <div
                    key={item.type}
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    title={`${item.type}: ${item.percentage}% (${item.tonnes}t)`}
                    className="h-full transition-all hover:brightness-125 cursor-pointer first:rounded-l-full last:rounded-r-full"
                  />
                ))}
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {wasteDistribution.map((item) => (
                  <div key={item.type} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <div>
                        <span className="font-semibold text-slate-200 block text-[11px]">{item.type}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.conversion}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-200 block text-[11px]">{item.percentage}%</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.tonnes}t</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Facility Utilization */}
        {(activeChartView === 'all' || activeChartView === 'facility') && (
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  Facility Utilization
                </h4>
                <p className="text-[11px] text-slate-400">
                  Active processing load vs daily conversion throughput capacity
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                12 Facilities Active
              </span>
            </div>

            {/* Utilization Bars */}
            <div className="space-y-3 pt-1">
              {facilityUtilization.map((fac) => (
                <div key={fac.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 text-[11px] truncate max-w-[190px]">
                      {fac.name}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      <strong className="text-slate-200">{fac.current}</strong> / {fac.capacity} t/day (
                      <span style={{ color: fac.color }} className="font-bold">
                        {fac.rate}%
                      </span>
                      )
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                    <div
                      style={{ width: `${fac.rate}%`, backgroundColor: fac.color }}
                      className="h-full rounded-full transition-all duration-500 shadow-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/60">
              <span>Avg Regional Load: 59.5%</span>
              <span className="text-brand-300">Optimal Buffer Available</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
