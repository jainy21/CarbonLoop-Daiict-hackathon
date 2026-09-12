import React from 'react';
import { Scale } from 'lucide-react';

interface QuantityInputProps {
  quantity: number | '';
  unit: 'kg' | 'tonnes';
  onChangeQuantity: (val: number | '') => void;
  onChangeUnit: (unit: 'kg' | 'tonnes') => void;
  error?: string;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  quantity,
  unit,
  onChangeQuantity,
  onChangeUnit,
  error
}) => {
  const quickPresets = [
    { label: '5 t', tonnes: 5 },
    { label: '10 t (Demo)', tonnes: 10 },
    { label: '25 t', tonnes: 25 },
    { label: '50 t', tonnes: 50 },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      onChangeQuantity('');
      return;
    }
    const num = parseFloat(rawVal);
    if (!isNaN(num) && num >= 0) {
      onChangeQuantity(num);
    }
  };

  const handlePreset = (presetTonnes: number) => {
    if (unit === 'kg') {
      onChangeQuantity(presetTonnes * 1000);
    } else {
      onChangeQuantity(presetTonnes);
    }
  };

  const calculatedTonnes =
    quantity === ''
      ? 0
      : unit === 'kg'
      ? (quantity as number) / 1000
      : (quantity as number);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-brand-400" />
          Batch Quantity <span className="text-rose-400">*</span>
        </label>
        {quantity !== '' && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            = {calculatedTonnes.toLocaleString()} Tonnes (Metric)
          </span>
        )}
      </div>

      <div className="flex rounded-lg shadow-sm border border-slate-700 bg-slate-900/90 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 overflow-hidden">
        <input
          type="number"
          min="0.1"
          step={unit === 'kg' ? '10' : '0.1'}
          placeholder={unit === 'kg' ? 'e.g. 10000' : 'e.g. 10'}
          value={quantity}
          onChange={handleInputChange}
          className="w-full bg-transparent px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
        />

        <div className="flex border-l border-slate-700 bg-slate-800/80 p-1 gap-1 items-center">
          <button
            type="button"
            onClick={() => onChangeUnit('tonnes')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              unit === 'tonnes'
                ? 'bg-brand-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tonnes
          </button>
          <button
            type="button"
            onClick={() => onChangeUnit('kg')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              unit === 'kg'
                ? 'bg-brand-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            kg
          </button>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex items-center gap-1.5 pt-1">
        <span className="text-[11px] text-slate-500">Presets:</span>
        {quickPresets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => handlePreset(p.tonnes)}
            className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
};
