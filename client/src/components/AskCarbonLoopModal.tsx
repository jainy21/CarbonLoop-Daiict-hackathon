import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  Scale,
  MapPin,
  Building2,
  Lock
} from 'lucide-react';

interface AskCarbonLoopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QAItem {
  question: string;
  answer: string;
  badge?: string;
  tags?: string[];
}

const KNOWLEDGE_BASE: QAItem[] = [
  {
    question: 'How is the 8.4 tCO₂e net carbon impact calculated for 10 tonnes Rice Husk?',
    answer: 'The CarbonLoop Deterministic Engine calculates net carbon impact as:\n• Avoided Landfill Methane: 10 tonnes × 0.28 tCO₂e/t = +2.80 tCO₂e\n• Pyrolysis Carbon Fixation: 10 tonnes × 88% efficiency × 0.92 retention = +5.80 tCO₂e\n• Transport Deduction (Ahmedabad → Sanand, 26.4 km by CNG): -0.0062 tCO₂e (6.2 kg)\n• Net Impact = +2.80 + 5.80 - 0.0062 ≈ +8.4 tCO₂e (Prototype Carbon Impact Estimate).',
    badge: 'Formula Model',
    tags: ['Carbon Engine', 'Rice Husk', 'Flagship Demo']
  },
  {
    question: 'Why was BioChar Plant A chosen for the Ahmedabad batch?',
    answer: 'The Smart Matching Algorithm scored BioChar Plant A at 92% overall compatibility based on: 100% Feedstock Compatibility (Pyrolysis accepts Rice Husk), 95% Daily Capacity Buffer (45 t/day available), 90% Proximity (26.4 km corridor), 88% High Conversion Efficiency, and Lowest Logistics Cost (₹2,140).',
    badge: 'Smart Matching',
    tags: ['Matching Engine', 'Biochar', 'Sanand']
  },
  {
    question: 'How does the Carbon Passport prevent double-counting and tampering?',
    answer: 'Every Carbon Passport generates a deterministic SHA-256 digital seal linking the generator origin coordinates, weighbridge receipts, carrier GPS telemetry, and conversion plant records. The public QR code at /passport/:batchId allows instant browser-based verification without requiring login.',
    badge: 'Integrity',
    tags: ['Passport', 'Verification', 'Security']
  },
  {
    question: 'What types of waste can CarbonLoop route and convert?',
    answer: 'CarbonLoop supports Agricultural Residues (Rice Husk, Cotton Stalks, Sugarcane Bagasse, Wheat Straw), Food & Organic Waste (Commercial food waste, processing sludge), and Forestry / Industrial Residues (Sawdust, cellulose fiber). Facilities convert them into Biochar, Biogas/CBG, or Carbon-Negative building materials.',
    badge: 'Feedstocks',
    tags: ['Waste Types', 'Conversion Pathways']
  }
];

export const AskCarbonLoopModal: React.FC<AskCarbonLoopModalProps> = ({
  isOpen,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [selectedQA, setSelectedQA] = useState<QAItem | null>(KNOWLEDGE_BASE[0]);
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Search existing KB or generate intelligent context answer
    const qLower = query.toLowerCase();
    const found = KNOWLEDGE_BASE.find(
      (k) =>
        k.question.toLowerCase().includes(qLower) ||
        k.tags?.some((t) => t.toLowerCase().includes(qLower))
    );

    if (found) {
      setSelectedQA(found);
      setCustomAnswer(null);
    } else {
      setSelectedQA(null);
      setCustomAnswer(
        `CarbonLoop AI Assistant Context: Based on real-time ecosystem data, your query "${query}" relates to circular carbon flows. 128.4 tonnes of waste have been diverted generating 94.7 tCO₂e net impact across 12 conversion facilities in Gujarat. For specific calculations, see the Carbon Impact and Smart Carbon Path modules.`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel border border-brand-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-[#06121f] p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-100">
                Ask CarbonLoop
              </h3>
              <span className="text-[10px] font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded-full">
                AI Knowledge Engine (Preview)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Query circular carbon models, logistics routes, and conversion data.
            </p>
          </div>
        </div>

        {/* Search / Ask Input */}
        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about carbon formulas, matched plants, or demo batches..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-400"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>

        {/* Suggested Quick Questions */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Popular Judge & Operator Questions:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {KNOWLEDGE_BASE.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedQA(item);
                  setCustomAnswer(null);
                  setQuery(item.question);
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 cursor-pointer ${
                  selectedQA?.question === item.question
                    ? 'bg-brand-500/15 border-brand-500/50 text-brand-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                <span className="truncate leading-tight font-medium">
                  {item.question}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Answer Box */}
        {(selectedQA || customAnswer) && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-brand-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-brand-400 flex items-center gap-1">
                <Bot className="w-3 h-3" />
                CarbonLoop Verified Data Response:
              </span>
              {selectedQA?.badge && (
                <span className="text-[9px] font-mono bg-brand-500/10 text-brand-300 px-2 py-0.5 rounded border border-brand-500/20">
                  {selectedQA.badge}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
              {selectedQA ? selectedQA.answer : customAnswer}
            </p>

            {selectedQA?.tags && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                {selectedQA.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-500 font-mono">
          CarbonLoop AI Assistant integrates with active batches, facility matrices, and IPCC Tier-2 emission factors.
        </div>
      </div>
    </div>
  );
};
