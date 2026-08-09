'use client';

import { useState, useMemo } from 'react';
import { Ruler, ArrowLeftRight } from 'lucide-react';

type Category = 'length' | 'weight' | 'temperature' | 'data';

const units: Record<Category, { label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  length: [
    { label: 'Millimeter (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: 'Centimeter (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { label: 'Meter (m)', toBase: (v) => v, fromBase: (v) => v },
    { label: 'Kilometer (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: 'Inch (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { label: 'Foot (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { label: 'Yard (yd)', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { label: 'Mile (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  ],
  weight: [
    { label: 'Milligram (mg)', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { label: 'Gram (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: 'Kilogram (kg)', toBase: (v) => v, fromBase: (v) => v },
    { label: 'Metric Ton (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: 'Ounce (oz)', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { label: 'Pound (lb)', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
  ],
  temperature: [
    { label: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
    { label: 'Fahrenheit (°F)', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
    { label: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  data: [
    { label: 'Bit (b)', toBase: (v) => v / 8, fromBase: (v) => v * 8 },
    { label: 'Byte (B)', toBase: (v) => v, fromBase: (v) => v },
    { label: 'Kilobyte (KB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    { label: 'Megabyte (MB)', toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
    { label: 'Gigabyte (GB)', toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
    { label: 'Terabyte (TB)', toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
  ],
};

const categories: { key: Category; label: string; icon: string }[] = [
  { key: 'length', label: 'Length', icon: '📏' },
  { key: 'weight', label: 'Weight', icon: '⚖' },
  { key: 'temperature', label: 'Temperature', icon: '🌡' },
  { key: 'data', label: 'Data', icon: '💾' },
];

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('length');
  const [value, setValue] = useState('1');
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(2);

  const result = useMemo(() => {
    const v = parseFloat(value) || 0;
    const fromUnit = units[category][fromIdx];
    const toUnit = units[category][toIdx];
    const base = fromUnit.toBase(v);
    const out = toUnit.fromBase(base);
    return out;
  }, [value, category, fromIdx, toIdx]);

  const currentUnits = units[category];

  return (
    <div className="max-w-2xl rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
          <Ruler className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Unit Converter</h2>
      </div>

      {/* Category pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => { setCategory(c.key); setFromIdx(0); setToIdx(c.key === 'length' ? 2 : 1); }}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-300 hover:scale-105 ${
              category === c.key
                ? 'bg-[#2563EB] text-white shadow-[0_4px_14px_-2px_rgba(37,99,235,0.5)]'
                : 'border border-[#1e293b] bg-[#020617] text-slate-400 hover:border-[#2563EB]/50 hover:text-white'
            }`}
          >
            <span>{c.icon}</span> {c.label}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">From</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-lg border border-[#1e293b] bg-[#020617] px-3 py-2.5 text-sm text-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
          />
          <select
            value={fromIdx}
            onChange={(e) => setFromIdx(parseInt(e.target.value))}
            className="mt-2 w-full rounded-lg border border-[#1e293b] bg-[#020617] px-3 py-2.5 text-sm text-white focus:border-[#2563EB] focus:outline-none"
          >
            {currentUnits.map((u, i) => (
              <option key={u.label} value={i}>{u.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => { const t = fromIdx; setFromIdx(toIdx); setToIdx(t); }}
          className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#1e293b] bg-[#020617] text-[#3B82F6] transition-all duration-300 hover:scale-110 hover:border-[#2563EB]/50 hover:shadow-[0_0_16px_-2px_rgba(37,99,235,0.5)]"
          aria-label="Swap units"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">To</label>
          <div className="w-full rounded-lg border border-[#2563EB]/30 bg-[#2563EB]/5 px-3 py-2.5 text-sm font-bold text-[#3B82F6]">
            {result.toLocaleString('en-US', { maximumFractionDigits: 6 })}
          </div>
          <select
            value={toIdx}
            onChange={(e) => setToIdx(parseInt(e.target.value))}
            className="mt-2 w-full rounded-lg border border-[#1e293b] bg-[#020617] px-3 py-2.5 text-sm text-white focus:border-[#2563EB] focus:outline-none"
          >
            {currentUnits.map((u, i) => (
              <option key={u.label} value={i}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
