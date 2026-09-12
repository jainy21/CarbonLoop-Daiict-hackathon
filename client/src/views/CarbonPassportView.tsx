import React, { useState, useEffect } from 'react';
import { CarbonPassport, WasteBatch } from '../types/index.js';
import { 
  ShieldCheck, 
  QrCode, 
  ExternalLink, 
  Download, 
  Share2, 
  CheckCircle2, 
  Leaf, 
  Flame, 
  Scale, 
  MapPin, 
  Building2, 
  Lock,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface CarbonPassportViewProps {
  activeBatch?: WasteBatch | null;
  onOpenPublicVerification: (batchId: string) => void;
}

export const CarbonPassportView: React.FC<CarbonPassportViewProps> = ({
  activeBatch,
  onOpenPublicVerification
}) => {
  const [passport, setPassport] = useState<CarbonPassport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const batchId = activeBatch?.id || 'batch-ahmedabad-demo';

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
        console.warn('Passport fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPassport();
  }, [batchId]);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    window.location.origin + '/passport/' + batchId
  )}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-400">
            <QrCode className="w-3.5 h-3.5" />
            <span>STEP 6 • PUBLIC VERIFICATION & PROOF OF JOURNEY</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100">
            Digital Carbon Passport
          </h2>
          <p className="text-xs text-slate-400">
            Immutable digital certificate connecting waste generator origin, logistics transit, conversion facility, and carbon impact.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenPublicVerification(batchId)}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Judge Verification Page</span>
          </button>
        </div>
      </div>

      {/* Passport Certificate Card */}
      {loading ? (
        <div className="py-12 flex justify-center items-center text-slate-400 text-xs gap-2">
          <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin"></div>
          Generating cryptographic digital certificate...
        </div>
      ) : (
        <div className="max-w-4xl mx-auto rounded-3xl border-2 border-brand-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-[#040f1a] p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Subtle watermark background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Certificate Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Leaf className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black tracking-tight text-slate-100">
                    CARBON<span className="text-brand-400">LOOP</span>
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    CERTIFICATE OF CIRCULAR CONVERSION
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Verifiable Environmental Stewardship Record
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Passport Serial</span>
              <span className="text-xs font-mono font-bold text-brand-300">
                {passport?.passportNumber || 'CLP-PASS-2026-9041'}
              </span>
            </div>
          </div>

          {/* Main Grid: Details + QR Verification Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Left 2 Cols: Details */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Waste Material</span>
                  <div className="text-base font-bold text-slate-100">
                    {passport?.wasteType || 'Rice Husk'}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Verified Quantity</span>
                  <div className="text-base font-mono font-bold text-emerald-300">
                    {passport?.quantityTonnes || 10} Tonnes
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Origin / Generator</span>
                  <div className="text-xs text-slate-200 font-semibold truncate">
                    {passport?.generatorName || 'Gujarat Agro Producer Cooperative'}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {passport?.originName || 'APMC Market Yard, Ahmedabad'}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Conversion Facility</span>
                  <div className="text-xs text-slate-200 font-semibold truncate">
                    {passport?.facilityName || 'BioChar Plant A (Sanand)'}
                  </div>
                  <div className="text-[11px] text-indigo-300">
                    Pathway: {passport?.conversionPathway || 'Biochar'}
                  </div>
                </div>
              </div>

              {/* Net Carbon Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">
                    ESTIMATED NET CARBON IMPACT
                  </span>
                  <span className="text-xs text-slate-300">
                    Landfill Avoidance + Biochar Carbon Sequestration
                  </span>
                </div>
                <div className="text-2xl font-mono font-black text-emerald-300">
                  +{passport?.netCarbonImpactTonnesCO2e || 8.4} tCO₂e
                </div>
              </div>
            </div>

            {/* Right Col: QR Code Box */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
              <div className="p-2 bg-white rounded-xl shadow-lg">
                <img
                  src={qrImageUrl}
                  alt="Public Carbon Passport QR"
                  className="w-36 h-36 rounded-lg"
                />
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-200 flex items-center justify-center gap-1">
                  <QrCode className="w-3 h-3 text-brand-400" />
                  Scan to Verify Publicly
                </span>
                <p className="text-[10px] text-slate-500">
                  Open proof of journey on any mobile browser
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenPublicVerification(batchId)}
                className="text-[11px] text-brand-400 hover:text-brand-300 underline font-mono"
              >
                Direct Link: /passport/{batchId}
              </button>
            </div>
          </div>

          {/* Certificate Footer Seal */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-xs sm:max-w-md">
                Digital Seal: {passport?.digitalSealHash || 'SHA256:7f83b1657ff1fc53b92dc18148a1d65...'}
              </span>
            </div>

            <div className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Timestamp Logged</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
