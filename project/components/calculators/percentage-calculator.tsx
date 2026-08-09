'use client';

import { useState } from 'react';
import { Percent, RotateCcw } from 'lucide-react';

export default function PercentageCalculator() {
  const [mode, setMode] = useState<'of' | 'increase' | 'isWhat'>('of');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [oldVal, setOldVal] = useState('');
  const [newVal, setNewVal] = useState('');

  const xn = parseFloat(x) || 0;
  const yn = parseFloat(y) || 0;
  const oldN = parseFloat(oldVal) || 0;
  const newN = parseFloat(newVal) || 0;

  let result: string = '';
  if (mode === 'of') {
    result = `${(xn / 100 * yn).toFixed(2)}`;
  } else if (mode === 'increase') {
    if (oldN !== 0) {
      result = `${(((newN - oldN) / Math.abs(oldN)) * 100).toFixed(2)}%`;
    }
  } else {
    if (yn !== 0) {
      result = `${((xn / yn) * 100).toFixed(2)}%`;
    }
  }

  const modes = [
    { key: 'of' as const, label: 'X% of Y' },
    { key: 'increase' as const, label: '% Increase/Decrease' },
    { key: 'isWhat' as const, label: 'X is what % of Y' },
  ];

  return (
    <div className="max-w-2xl rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
          <Percent className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Percentage Calculator</h2>
      </div>

      <div className="mt-6 inline-flex rounded-lg border border-[#1e293b] bg-[#020617] p-1">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              mode === m.key ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {mode === 'of' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="X (percentage)" value={x} onChange={setX} placeholder="e.g. 15" />
            <Field label="Y (value)" value={y} onChange={setY} placeholder="e.g. 200" />
          </div>
        )}
        {mode === 'increase' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Old value" value={oldVal} onChange={setOldVal} placeholder="e.g. 150" />
            <Field label="New value" value={newVal} onChange={setNewVal} placeholder="e.g. 180" />
          </div>
        )}
        {mode === 'isWhat' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="X (part)" value={x} onChange={setX} placeholder="e.g. 30" />
            <Field label="Y (whole)" value={y} onChange={setY} placeholder="e.g. 150" />
          </div>
        )}
      </div>

      {result && (
        <div className="mt-6 rounded-lg border border-[#2563EB]/30 bg-[#2563EB]/5 p-4 text-center">
          <div className="text-xs font-medium uppercase text-slate-400">Result</div>
          <div className="mt-1 text-3xl font-bold text-[#3B82F6]">{result}</div>
        </div>
      )}

      <button
        onClick={() => { setX(''); setY(''); setOldVal(''); setNewVal(''); }}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white"
      >
        <RotateCcw className="h-4 w-4" /> Reset
      </button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#1e293b] bg-[#020617] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
      />
    </label>
  );
}
