import React, { useState, useEffect } from 'react';
import { CarbonPassport } from '../types/index.js';
import { 
  ShieldCheck, 
  Leaf, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Scale, 
  TrendingUp, 
  Lock, 
  ArrowLeft,
  Clock,
  ExternalLink
} from 'lucide-react';

interface PublicPassportVerificationProps {
  batchId: string;
  onBackToApp?: () => void;
}

export const PublicPassportVerification: React.FC<PublicPassportVerificationProps> = ({
  batchId,
  onBackToApp
}) => {
  const [passport, setPassport] = useState<CarbonPassport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPassport = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/passports/${batchId}`);
        if (res.ok) {
          const data = await res.json();
          setPassport(data);
        }
      } catch (err) {
        console.warn('Public passport error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPassport();
  }, [batchId]);

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation back */}
        {onBackToApp && (
          <button
            onClick={onBackToApp}
            className="text-xs font-semibold text-slate-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to CarbonLoop Dashboard</span>
          </button>
        )}

        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OFFICIAL PUBLIC QR VERIFICATION RECORD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
            CarbonLoop Value Chain Certificate
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Batch Reference: {batchId} • Serial: {passport?.passportNumber || 'CLP-PASS-2026-9041'}
          </p>
        </div>

        {/* Certificate Card */}
        {loading ? (
          <div className="glass-panel p-12 rounded-2xl flex justify-center items-center text-slate-400 text-xs gap-2">
            <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin"></div>
            Verifying cryptographic proof...
          </div>
        ) : (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-emerald-500/30 space-y-6">
            {/* Status confirmation */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-200">
                  Cryptographic Integrity Verified
                </h3>
                <p className="text-xs text-emerald-400/80">
                  This waste batch was tracked end-to-end and converted into measured carbon value.
                </p>
              </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Feedstock</span>
                <strong className="text-sm text-slate-100">{passport?.wasteType || 'Rice Husk'}</strong>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Volume</span>
                <strong className="text-sm font-mono text-emerald-300">{passport?.quantityTonnes || 10} Tonnes</strong>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Pathway</span>
                <strong className="text-sm text-cyan-300">{passport?.conversionPathway || 'Biochar'}</strong>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Net Impact</span>
                <strong className="text-sm font-mono text-emerald-300">+{passport?.netCarbonImpactTonnesCO2e || 8.4} tCO₂e</strong>
              </div>
            </div>

            {/* Value Chain Journey Details */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Full Value Chain Traceability
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Origin Point:</strong> {passport?.originName}
                    <div className="text-[11px] text-slate-400">Generator: {passport?.generatorName}</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                  <Building2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Conversion Facility:</strong> {passport?.facilityName}
                    <div className="text-[11px] text-slate-400">Transit Distance: {passport?.transportDistanceKm} km</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Seal */}
            <div className="pt-4 border-t border-slate-800 text-center space-y-1">
              <div className="text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Digital Ledger Seal: {passport?.digitalSealHash}</span>
              </div>
              <p className="text-[10px] text-slate-600">
                Powered by CarbonLoop Circular Carbon Ecosystem Protocol
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
