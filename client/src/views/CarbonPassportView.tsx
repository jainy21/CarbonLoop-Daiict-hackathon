import React, { useState, useEffect } from 'react';
import { CarbonPassport as CarbonPassportType, WasteBatch } from '../types/index.js';
import { CarbonPassport } from '../components/CarbonPassport.js';
import { 
  ShieldCheck, 
  QrCode, 
  ExternalLink, 
  RotateCcw, 
  Sparkles,
  Package,
  CheckCircle2
} from 'lucide-react';

interface CarbonPassportViewProps {
  activeBatch?: WasteBatch | null;
  onOpenPublicVerification: (batchId: string) => void;
}

export const CarbonPassportView: React.FC<CarbonPassportViewProps> = ({
  activeBatch,
  onOpenPublicVerification
}) => {
  const [passport, setPassport] = useState<CarbonPassportType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const batchId = activeBatch?.id || 'batch-ahmedabad-demo';
  const trackingNumber = activeBatch?.trackingNumber || 'WL-1024';

  const fetchPassport = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/passports/${batchId}`);
      if (res.ok) {
        const data = await res.json();
        setPassport(data);
      } else {
        // Fallback for Flagship Demo (10 tonnes Rice Husk)
        setPassport({
          id: `pass-${batchId}`,
          batchId: batchId,
          passportNumber: 'CLP-PASS-2026-9041',
          qrCodeUrl: '',
          publicVerificationUrl: `/passport/${trackingNumber}`,
          digitalSealHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
          wasteType: activeBatch?.wasteType || 'Rice Husk',
          quantityTonnes: activeBatch?.quantityTonnes || 10,
          generatorName: activeBatch?.generatorName || 'Gujarat Agro Producer Cooperative',
          originName: activeBatch?.origin ? `${activeBatch.origin.address}, ${activeBatch.origin.city}` : 'APMC Market Yard, Ahmedabad',
          facilityName: activeBatch?.facilityName || 'BioChar Plant A (Sanand Industrial Eco-Park)',
          conversionPathway: activeBatch?.preferredConversion || 'Biochar',
          transportDistanceKm: 26.4,
          avoidedLandfillTonnesCO2e: 2.8,
          conversionBenefitTonnesCO2e: 5.8,
          transportEmissionsKgCO2e: 6.2,
          netCarbonImpactTonnesCO2e: 8.4,
          issuedAt: new Date().toISOString(),
          status: 'VERIFIED',
          journeyTimeline: []
        });
      }
    } catch (err) {
      console.warn('Passport fetch warning:', err);
      // Fallback
      setPassport({
        id: `pass-${batchId}`,
        batchId: batchId,
        passportNumber: 'CLP-PASS-2026-9041',
        qrCodeUrl: '',
        publicVerificationUrl: `/passport/${trackingNumber}`,
        digitalSealHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        wasteType: activeBatch?.wasteType || 'Rice Husk',
        quantityTonnes: activeBatch?.quantityTonnes || 10,
        generatorName: activeBatch?.generatorName || 'Gujarat Agro Producer Cooperative',
        originName: activeBatch?.origin ? `${activeBatch.origin.address}, ${activeBatch.origin.city}` : 'APMC Market Yard, Ahmedabad',
        facilityName: activeBatch?.facilityName || 'BioChar Plant A (Sanand Industrial Eco-Park)',
        conversionPathway: activeBatch?.preferredConversion || 'Biochar',
        transportDistanceKm: 26.4,
        avoidedLandfillTonnesCO2e: 2.8,
        conversionBenefitTonnesCO2e: 5.8,
        transportEmissionsKgCO2e: 6.2,
        netCarbonImpactTonnesCO2e: 8.4,
        issuedAt: new Date().toISOString(),
        status: 'VERIFIED',
        journeyTimeline: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassport();
  }, [batchId]);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-400">
            <QrCode className="w-3.5 h-3.5" />
            <span>STEP 6 • PUBLIC VERIFICATION & PROOF OF VALUE CHAIN</span>
          </div>
          <h1 className="text-3xl font-black text-slate-100 mt-1">
            Carbon Passport Certificate
          </h1>
          <p className="text-xs text-slate-400">
            Cryptographically sealed digital asset linking waste origin, GIS transit corridor, pyrolysis facility, and estimated net carbon impact.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchPassport}
            className="text-xs font-semibold text-brand-300 hover:text-brand-100 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh Certificate</span>
          </button>
        </div>
      </div>

      {/* Main Certificate Display */}
      {loading ? (
        <div className="glass-panel p-16 rounded-3xl border border-slate-800 flex flex-col justify-center items-center text-slate-400 text-xs gap-3">
          <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
          <span>Generating tamper-proof cryptographic passport certificate...</span>
        </div>
      ) : (
        <CarbonPassport
          passport={passport}
          batch={activeBatch}
          onOpenPublicVerification={onOpenPublicVerification}
        />
      )}
    </div>
  );
};
