'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

type Mode = 'focus' | 'break';
const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>('focus');
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // Session ended
          if (mode === 'focus') setCompleted((c) => c + 1);
          const nextMode: Mode = mode === 'focus' ? 'break' : 'focus';
          setMode(nextMode);
          setRunning(false);
          return nextMode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode]);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setSecondsLeft(m === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS);
    setRunning(false);
  }, []);

  const reset = () => {
    setSecondsLeft(mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS);
    setRunning(false);
  };

  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const ss = (secondsLeft % 60).toString().padStart(2, '0');
  const progress = ((total - secondsLeft) / total) * 100;
  const circumference = 2 * Math.PI * 120;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[#1e293b] bg-[#0f172a] p-8 text-center">
      {/* Mode toggle */}
      <div className="mx-auto inline-flex rounded-lg border border-[#1e293b] bg-[#020617] p-1">
        <button
          onClick={() => switchMode('focus')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-all',
            mode === 'focus' ? 'bg-[#2563EB] text-white shadow-md' : 'text-slate-400 hover:text-white'
          )}
        >
          <Brain className="h-4 w-4" /> Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-all',
            mode === 'break' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
          )}
        >
          <Coffee className="h-4 w-4" /> Break
        </button>
      </div>

      {/* Circular progress */}
      <div className="relative mx-auto mt-8 h-[280px] w-[280px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 280 280">
          <circle cx="140" cy="140" r="120" fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle
            cx="140" cy="140" r="120" fill="none"
            stroke={mode === 'focus' ? '#2563EB' : '#10b981'}
            strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-extrabold tabular-nums text-white">
            {mm}:{ss}
          </span>
          <span className="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            {mode === 'focus' ? 'Focus Session' : 'Break Time'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-95"
        >
          {running ? <><Pause className="h-5 w-5" /> Pause</> : <><Play className="h-5 w-5" /> Start</>}
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Completed focus sessions: <span className="font-bold text-[#3B82F6]">{completed}</span>
      </p>
    </div>
  );
}
