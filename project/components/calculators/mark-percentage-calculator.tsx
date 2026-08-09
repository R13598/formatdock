'use client';

import { useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

function getGrade(pct: number): { grade: string; color: string; pass: boolean } {
  if (pct >= 90) return { grade: 'A+', color: 'text-green-400 bg-green-500/10 border-green-500/30', pass: true };
  if (pct >= 80) return { grade: 'A', color: 'text-green-400 bg-green-500/10 border-green-500/30', pass: true };
  if (pct >= 70) return { grade: 'B+', color: 'text-[#3B82F6] bg-[#2563EB]/10 border-[#2563EB]/30', pass: true };
  if (pct >= 60) return { grade: 'B', color: 'text-[#3B82F6] bg-[#2563EB]/10 border-[#2563EB]/30', pass: true };
  if (pct >= 50) return { grade: 'C', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', pass: true };
  if (pct >= 40) return { grade: 'D', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', pass: true };
  return { grade: 'Fail', color: 'text-red-400 bg-red-500/10 border-red-500/30', pass: false };
}

export default function MarkPercentageCalculator() {
  const [obtained, setObtained] = useState('');
  const [maximum, setMaximum] = useState('');

  const obt = parseFloat(obtained) || 0;
  const max = parseFloat(maximum) || 0;
  const pct = max > 0 ? (obt / max) * 100 : 0;
  const valid = obtained && maximum && max > 0;
  const { grade, color, pass } = getGrade(pct);

  return (
    <div className="max-w-2xl rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
          <Calculator className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Mark Percentage Calculator</h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Marks Obtained
          </span>
          <input
            type="number"
            placeholder="e.g. 425"
            value={obtained}
            onChange={(e) => setObtained(e.target.value)}
            className="w-full rounded-lg border border-[#1e293b] bg-[#020617] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Maximum Marks
          </span>
          <input
            type="number"
            placeholder="e.g. 600"
            value={maximum}
            onChange={(e) => setMaximum(e.target.value)}
            className="w-full rounded-lg border border-[#1e293b] bg-[#020617] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
          />
        </label>
      </div>

      {valid && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[#1e293b] bg-[#020617] p-4 text-center">
            <div className="text-xs font-medium uppercase text-slate-500">Percentage</div>
            <div className="mt-1 text-3xl font-bold text-[#3B82F6]">{pct.toFixed(2)}%</div>
          </div>
          <div className={cn('rounded-lg border p-4 text-center', color)}>
            <div className="text-xs font-medium uppercase opacity-80">Grade</div>
            <div className="mt-1 text-3xl font-bold">{grade}</div>
          </div>
          <div className={cn('rounded-lg border p-4 text-center', pass ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-red-400 bg-red-500/10 border-red-500/30')}>
            <div className="text-xs font-medium uppercase opacity-80">Status</div>
            <div className="mt-1 text-2xl font-bold">{pass ? 'PASS' : 'FAIL'}</div>
          </div>
        </div>
      )}

      <button
        onClick={() => { setObtained(''); setMaximum(''); }}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white"
      >
        <RotateCcw className="h-4 w-4" /> Reset
      </button>
    </div>
  );
}
