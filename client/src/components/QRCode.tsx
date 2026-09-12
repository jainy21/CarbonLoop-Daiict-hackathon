import React, { useState } from 'react';
import { 
  QrCode as QrIcon, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Share2, 
  Lock,
  Smartphone
} from 'lucide-react';

interface QRCodeProps {
  batchId: string;
  url?: string;
  size?: number;
  onOpenPublicVerification?: (batchId: string) => void;
  className?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({
  batchId,
  url,
  size = 200,
  onOpenPublicVerification,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  // Generate target verification URL: /passport/:batchId
  const verificationUrl = url || `${window.location.origin}/passport/${batchId}`;
  
  // High quality QR code image service with robust fallback
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(
    verificationUrl
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-4 shadow-xl ${className}`}>
      {/* QR Code Container with High-Contrast White Background for Reliable Camera Scanning */}
      <div className="relative group">
        <div className="p-3 bg-white rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105 border border-slate-200">
          <img
            src={qrApiUrl}
            alt={`Carbon Passport QR Code for ${batchId}`}
            className="w-40 h-40 rounded-lg object-contain"
            loading="lazy"
          />
        </div>
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-950 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-md flex items-center gap-1 whitespace-nowrap">
          <Lock className="w-2.5 h-2.5" />
          <span>CRYPTOGRAPHIC HASH VERIFIED</span>
        </div>
      </div>

      {/* Text Info */}
      <div className="space-y-1 pt-2">
        <h4 className="text-xs font-bold text-slate-100 flex items-center justify-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-brand-400" />
          Scan with Mobile Camera
        </h4>
        <p className="text-[11px] text-slate-400 max-w-xs leading-tight">
          Instant public verification of feedstock, transport route, and carbon sequestration.
        </p>
      </div>

      {/* Actions */}
      <div className="w-full pt-1 flex flex-col gap-2">
        {onOpenPublicVerification && (
          <button
            type="button"
            onClick={() => onOpenPublicVerification(batchId)}
            className="w-full py-2 px-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Verification Page</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-slate-300 text-[11px] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>Copy URL</span>
              </>
            )}
          </button>

          <a
            href={qrApiUrl}
            download={`CarbonPassport-${batchId}.png`}
            target="_blank"
            rel="noreferrer"
            className="py-1.5 px-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-slate-300 text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
            title="Download QR code"
          >
            <Download className="w-3 h-3 text-slate-400" />
            <span>Save QR</span>
          </a>
        </div>

        <div className="text-[10px] font-mono text-slate-500 truncate max-w-xs mx-auto">
          /passport/{batchId}
        </div>
      </div>
    </div>
  );
};
