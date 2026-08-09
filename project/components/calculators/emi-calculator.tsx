'use client';

import { useState, useMemo } from 'react';
import { Landmark, RotateCcw } from 'lucide-react';

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState('500000');
  const [rate, setRate] = useState('9');
  const [tenure, setTenure] = useState('5');

  const result = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const annualRate = parseFloat(rate) || 0;
    const n = (parseFloat(tenure) || 0) * 12;
    const r = annualRate / 12 / 100;

    if (p <= 0 || n <= 0) return null;

    let emi: number;
    if (r === 0) {
      emi = p / n;
    } else {
      emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principal: p,
    };
  }, [principal, rate, tenure]);

  const fmt = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="max-w-2xl rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
          <Landmark className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">EMI Calculator</h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Field label="Loan Amount (₹)" value={principal} onChange={setPrincipal} placeholder="500000" />
        <Field label="Interest Rate (%/yr)" value={rate} onChange={setRate} placeholder="9" />
        <Field label="Tenure (years)" value={tenure} onChange={setTenure} placeholder="5" />
      </div>

      {result && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#2563EB]/30 bg-[#2563EB]/5 p-4 text-center sm:col-span-2">
            <div className="text-xs font-medium uppercase text-slate-400">Monthly EMI</div>
            <div className="mt-1 text-4xl font-bold text-[#3B82F6]">₹{fmt(result.emi)}</div>
          </div>
          <div className="rounded-lg border border-[#1e293b] bg-[#020617] p-4 text-center">
            <div className="text-xs font-medium uppercase text-slate-500">Principal</div>
            <div className="mt-1 text-2xl font-bold text-white">₹{fmt(result.principal)}</div>
          </div>
          <div className="rounded-lg border border-[#1e293b] bg-[#020617] p-4 text-center">
            <div className="text-xs font-medium uppercase text-slate-500">Total Interest</div>
            <div className="mt-1 text-2xl font-bold text-amber-400">₹{fmt(result.totalInterest)}</div>
          </div>
          <div className="rounded-lg border border-[#1e293b] bg-[#020617] p-4 text-center sm:col-span-2">
            <div className="text-xs font-medium uppercase text-slate-500">Total Payment</div>
            <div className="mt-1 text-2xl font-bold text-white">₹{fmt(result.totalPayment)}</div>
          </div>
        </div>
      )}

      <button
        onClick={() => { setPrincipal(''); setRate(''); setTenure(''); }}
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
