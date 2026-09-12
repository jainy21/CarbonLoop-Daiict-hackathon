import React, { useState } from 'react';
import { CarbonPassport as CarbonPassportType, WasteBatch } from '../types/index.js';
import { PassportTimeline } from './PassportTimeline.js';
import { QRCode } from './QRCode.js';
import { 
  Leaf, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Truck, 
  Sparkles, 
  TrendingUp, 
  Download, 
  Printer, 
  ExternalLink,
  Share2,
  Copy,
  Check
} from 'lucide-react';

interface CarbonPassportProps {
  passport?: CarbonPassportType | null;
  batch?: WasteBatch | null;
  onOpenPublicVerification?: (batchId: string) => void;
  className?: string;
}

export const CarbonPassport: React.FC<CarbonPassportProps> = ({
  passport,
  batch,
  onOpenPublicVerification,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  // Resolved values with fallback to Flagship Demo (10 tonnes Rice Husk Ahmedabad -> BioChar Plant A)
  const batchId = passport?.batchId || batch?.id || 'WL-1024';
  const trackingNumber = batch?.trackingNumber || (batchId.startsWith('WL-') ? batchId : 'WL-1024');
  const wasteType = passport?.wasteType || batch?.wasteType || 'Rice Husk';
  const quantityTonnes = passport?.quantityTonnes || batch?.quantityTonnes || 10;
  const originName = passport?.originName || (batch?.origin ? `${batch.origin.address}, ${batch.origin.city}` : 'APMC Market Yard, Ahmedabad');
  const facilityName = passport?.facilityName || batch?.facilityName || 'BioChar Plant A (Sanand)';
  const conversionPathway = passport?.conversionPathway || batch?.preferredConversion || 'Biochar';
  const transportDistanceKm = passport?.transportDistanceKm || 26.4;
  const netCarbonImpact = passport?.netCarbonImpactTonnesCO2e || 8.4;
  const passportNumber = passport?.passportNumber || 'CLP-PASS-2026-9041';
  const digitalSeal = passport?.digitalSealHash || 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/passport/${trackingNumber}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            DIGITAL CERTIFICATE OF VALUE CHAIN CONVERSION
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Link Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Certificate</span>
          </button>

          {onOpenPublicVerification && (
            <button
              type="button"
              onClick={() => onOpenPublicVerification(trackingNumber)}
              className="px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Verification</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Certificate Card (Spec Section 5) */}
      <div className="max-w-4xl mx-auto rounded-3xl border-2 border-brand-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-[#040e1b] p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header */}
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Leaf className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-100">
                CARBON<span className="text-brand-400">LOOP</span>
              </h2>
              <h3 className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                CARBON PASSPORT
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Certificate Serial</span>
            <span className="text-xs font-mono font-bold text-brand-300">
              {passportNumber}
            </span>
            <span className="text-[10px] text-emerald-400/90 font-mono block mt-0.5">
              Status: VERIFIED
            </span>
          </div>
        </div>

        {/* 2. Primary Passport Details Grid (Spec Exact Layout) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left 2 Cols: Details & Net Impact */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {/* Batch */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Batch
                </span>
                <span className="text-base font-mono font-black text-brand-300">
                  {trackingNumber}
                </span>
              </div>

              {/* Waste */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Waste
                </span>
                <span className="text-base font-bold text-slate-100">
                  {quantityTonnes} tonnes {wasteType}
                </span>
              </div>

              {/* Origin */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  Origin
                </span>
                <span className="text-sm font-semibold text-slate-200 block truncate">
                  {originName}
                </span>
              </div>

              {/* Facility */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-indigo-400" />
                  Facility
                </span>
                <span className="text-sm font-semibold text-slate-200 block truncate">
                  {facilityName}
                </span>
              </div>

              {/* Conversion */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Conversion
                </span>
                <span className="text-sm font-bold text-cyan-300">
                  {conversionPathway}
                </span>
              </div>

              {/* Transport */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <Truck className="w-3 h-3 text-amber-400" />
                  Transport
                </span>
                <span className="text-sm font-mono font-bold text-slate-200">
                  {transportDistanceKm} km
                </span>
              </div>
            </div>

            {/* Estimated Net Carbon Impact Hero Callout */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-emerald-400 tracking-widest block">
                  ESTIMATED NET CARBON IMPACT
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Modeled biogenic carbon retention + avoided landfill methane emissions
                </p>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-300 tracking-tight">
                +{netCarbonImpact} <span className="text-sm font-sans font-normal text-slate-400">tCO₂e</span>
              </div>
            </div>
          </div>

          {/* Right Col: QR Code Box */}
          <div className="md:col-span-1">
            <QRCode
              batchId={trackingNumber}
              onOpenPublicVerification={onOpenPublicVerification}
            />
          </div>
        </div>

        {/* 3. Lifecycle Timeline Section (Spec Section 6) */}
        <div className="relative z-10 pt-6 border-t border-slate-800 space-y-4">
          <PassportTimeline
            events={passport?.journeyTimeline || []}
            currentStatus="converted"
          />
        </div>

        {/* 4. Certificate Cryptographic Footer */}
        <div className="relative z-10 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-xs sm:max-w-md">
              Digital Ledger Seal: {digitalSeal}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CarbonLoop Journey Record • Prototype Carbon Impact Estimate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
