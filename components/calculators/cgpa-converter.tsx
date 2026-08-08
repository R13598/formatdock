'use client';

import { useState } from 'react';
import { Percent, RotateCcw } from 'lucide-react';

export default function CgpaConverter() {
  const [cgpa, setCgpa] = useState('8.4');
  const [multiplier, setMultiplier] = useState('9.5');

  const c = parseFloat(cgpa) || 0;
  const m = parseFloat(multiplier) || 9.5;
  const pct = c * m;

  return (
    <div className="max-w-2xl rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
          <Percent className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">CGPA to Percentage</h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">CGPA</span>
          <input
            type="number"
            step="0.01"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            className="w-full rounded-lg border border-[#1e293b] bg-[#020617] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Multiplier</span>
          <input
            type="number"
            step="0.01"
            value={multiplier}
            onChange={(e) => setMultiplier(e.target.value)}
            className="w-full rounded-lg border border-[#1e293b] bg-[#020617] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
          />
        </label>
      </div>

      <div className="mt-6 rounded-lg border border-[#2563EB]/30 bg-[#2563EB]/5 p-4 text-center">
        <div className="text-xs font-medium uppercase text-slate-400">Percentage</div>
        <div className="mt-1 text-3xl font-bold text-[#3B82F6]">{pct.toFixed(2)}%</div>
        <div className="mt-1 text-xs text-slate-500">Formula: CGPA × {m} (CBSE default is 9.5)</div>
      </div>

      <button
        onClick={() => { setCgpa(''); setMultiplier('9.5'); }}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white"
      >
        <RotateCcw className="h-4 w-4" /> Reset
      </button>
    </div>
  );
}
