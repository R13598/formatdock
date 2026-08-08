'use client';

import { useState } from 'react';
import { CalendarDays, RotateCcw } from 'lucide-react';

export default function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [refDate, setRefDate] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const ref = refDate || today;

  let result: { years: number; months: number; days: number; totalDays: number } | null = null;
  if (dob) {
    const d1 = new Date(dob);
    const d2 = new Date(ref);
    if (d2 >= d1) {
      let years = d2.getFullYear() - d1.getFullYear();
      let months = d2.getMonth() - d1.getMonth();
      let days = d2.getDate() - d1.getDate();
      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      const totalDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      result = { years, months, days, totalDays };
    }
  }

  return (
    <div className="max-w-2xl rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
          <CalendarDays className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Age Calculator for Exams</h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Date of Birth</span>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-lg border border-[#1e293b] bg-[#020617] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Reference / Cutoff Date</span>
          <input
            type="date"
            value={refDate}
            placeholder={today}
            onChange={(e) => setRefDate(e.target.value)}
            className="w-full rounded-lg border border-[#1e293b] bg-[#020617] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
          />
        </label>
      </div>

      {result && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#1e293b] bg-[#020617] p-4 text-center">
            <div className="text-xs font-medium uppercase text-slate-500">Age</div>
            <div className="mt-1 text-2xl font-bold text-[#3B82F6]">
              {result.years}y {result.months}m {result.days}d
            </div>
          </div>
          <div className="rounded-lg border border-[#1e293b] bg-[#020617] p-4 text-center">
            <div className="text-xs font-medium uppercase text-slate-500">Total days</div>
            <div className="mt-1 text-2xl font-bold text-[#3B82F6]">
              {result.totalDays.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => { setDob(''); setRefDate(''); }}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white"
      >
        <RotateCcw className="h-4 w-4" /> Reset
      </button>
    </div>
  );
}
