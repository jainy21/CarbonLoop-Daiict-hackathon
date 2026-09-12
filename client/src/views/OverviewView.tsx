import React from 'react';
import { 
  Leaf, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Flame, 
  Scale, 
  TrendingUp, 
  Zap,
  Play,
  QrCode
} from 'lucide-react';

interface OverviewViewProps {
  onStartDemo: () => void;
  onNavigateToTab: (tabKey: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onStartDemo,
  onNavigateToTab
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-10 border border-brand-500/20 bg-gradient-to-b from-slate-900 via-slate-950 to-[#07111e]">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Waste-to-Carbon-Value Chain Tracker</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            Turn every waste batch into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-200">traceable carbon journey.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Connecting agricultural, food, and industrial waste generators with verified carbon conversion facilities. Intelligent matching, carbon-aware logistics, and verifiable public Carbon Passports.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStartDemo}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-black text-xs tracking-wider uppercase shadow-xl shadow-brand-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Flagship Demo (10t Rice Husk)</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateToTab('waste-batches')}
              className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-all flex items-center gap-2"
            >
              <span>Explore Waste Batches</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6-Step Core Journey Flow Card */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-brand-400" />
            Core Product Flow: The 6-Stage Traceability Journey
          </h3>
          <span className="text-xs text-brand-400 font-mono">End-to-End Value Chain</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              step: '01',
              title: 'Create Batch',
              desc: 'Farmer or generator logs 10t Rice Husk in Ahmedabad.',
              icon: Scale,
              tab: 'waste-batches',
              badge: 'Dev 1'
            },
            {
              step: '02',
              title: 'Smart Matching',
              desc: 'Ranks BioChar Plant A with 92% compatibility score.',
              icon: Sparkles,
              tab: 'smart-path',
              badge: 'Dev 2'
            },
            {
              step: '03',
              title: 'Logistics GIS',
              desc: 'Optimizes 26.4 km route with ₹2,140 cost & 6.2 kg transport CO₂.',
              icon: Truck,
              tab: 'map-logistics',
              badge: 'Dev 3'
            },
            {
              step: '04',
              title: 'Intake & Conversion',
              desc: 'Facility verifies intake & executes high-temp pyrolysis.',
              icon: Flame,
              tab: 'waste-batches',
              badge: 'Dev 1'
            },
            {
              step: '05',
              title: 'Carbon Impact',
              desc: 'Avoided landfill + Biochar C-fixation = +8.4 tCO₂e net.',
              icon: TrendingUp,
              tab: 'carbon-impact',
              badge: 'Dev 2'
            },
            {
              step: '06',
              title: 'Carbon Passport',
              desc: 'Issues verifiable QR certificate for judges & public.',
              icon: QrCode,
              tab: 'carbon-passports',
              badge: 'Dev 4'
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                onClick={() => onNavigateToTab(item.tab)}
                className="glass-panel p-3.5 rounded-xl border-slate-800/80 hover:border-brand-500/50 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-brand-400">
                    {item.step}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {item.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                    {item.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flagship Demo Highlight Box */}
      <div className="glass-panel p-6 rounded-2xl border-brand-500/30 bg-gradient-to-r from-brand-950/30 via-slate-900 to-slate-950 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-slate-100">
              Shared Hackathon Demo Scenario (Ahmedabad → Sanand)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Target Net Carbon: ~8.4 tCO₂e
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Waste Feedstock</span>
            <strong className="text-slate-200">10 tonnes Rice Husk</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Origin Hub</span>
            <strong className="text-cyan-300">Ahmedabad APMC</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Matched Plant</span>
            <strong className="text-brand-300">BioChar Plant A (92%)</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Logistics Route</span>
            <strong className="text-slate-200">26.4 km (₹2,140)</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Transport CO₂</span>
            <strong className="text-amber-300">6.2 kgCO₂e</strong>
          </div>
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
            <span className="text-emerald-400 text-[10px] block font-semibold">Net Carbon Impact</span>
            <strong className="text-emerald-300 font-mono text-sm">+8.4 tCO₂e</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
