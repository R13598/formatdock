'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0); // ms
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    setElapsed(Date.now() - startRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - elapsed;
      rafRef.current = requestAnimationFrame(tick);
      return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }
  }, [running, tick, elapsed]);

  const format = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return {
      h: h.toString().padStart(2, '0'),
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0'),
      cs: cs.toString().padStart(2, '0'),
    };
  };

  const f = format(elapsed);

  const reset = () => { setRunning(false); setElapsed(0); setLaps([]); };
  const addLap = () => setLaps((l) => [elapsed, ...l].slice(0, 12));

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-2xl border border-[#1e293b] bg-[#0f172a] p-8 text-center">
        {/* Big flip-clock display */}
        <div className="flex items-end justify-center gap-2 font-mono tabular-nums">
          <FlipDigit value={f.h} label="HRS" />
          <span className="pb-6 text-5xl font-bold text-slate-700">:</span>
          <FlipDigit value={f.m} label="MIN" />
          <span className="pb-6 text-5xl font-bold text-slate-700">:</span>
          <FlipDigit value={f.s} label="SEC" />
          <span className="pb-6 text-3xl font-bold text-[#3B82F6]">.{f.cs}</span>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all',
              running ? 'bg-amber-500 shadow-[0_4px_14px_-2px_rgba(245,158,11,0.5)] hover:bg-amber-600' : 'btn-primary-glow'
            )}
          >
            {running ? <><Pause className="h-5 w-5" /> Pause</> : <><Play className="h-5 w-5" /> Start</>}
          </button>
          <button
            onClick={addLap}
            disabled={!running}
            className="inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white disabled:opacity-40"
          >
            <Flag className="h-4 w-4" /> Lap
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="mt-4 rounded-2xl border border-[#1e293b] bg-[#0f172a] p-5">
          <h3 className="mb-3 text-sm font-bold text-white">Laps</h3>
          <ol className="space-y-1.5">
            {laps.map((lap, i) => {
              const lf = format(lap);
              const prev = laps[i + 1] ?? 0;
              const diff = format(lap - prev);
              return (
                <li key={i} className="flex items-center justify-between rounded-lg bg-[#020617] px-3 py-2 text-sm">
                  <span className="font-mono text-xs text-slate-500">Lap {laps.length - i}</span>
                  <span className="font-mono tabular-nums text-slate-300">
                    {lf.h}:{lf.m}:{lf.s}.{lf.cs}
                  </span>
                  <span className="font-mono text-xs text-[#3B82F6]">
                    +{diff.m}:{diff.s}.{diff.cs}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}

function FlipDigit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1">
        {value.split('').map((d, i) => (
          <span
            key={i}
            className="flex h-20 w-14 items-center justify-center rounded-lg border border-[#1e293b] bg-gradient-to-b from-[#1e293b] to-[#020617] text-5xl font-bold text-white shadow-inner sm:h-24 sm:w-16 sm:text-6xl"
          >
            {d}
          </span>
        ))}
      </div>
      <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">{label}</span>
    </div>
  );
}
