'use client';

import { useState, useMemo } from 'react';
import { Type, RotateCcw, Clock } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpace = text.replace(/\s/g, '').length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || 1 : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter((s) => s.trim()).length : 0;
    const readingTime = words > 0 ? Math.max(1, Math.round(words / 200)) : 0;
    return { words, characters, charactersNoSpace, sentences, paragraphs, readingTime };
  }, [text]);

  return (
    <div className="max-w-3xl rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
          <Type className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Word Counter</h2>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        rows={8}
        className="mt-6 w-full resize-y rounded-lg border border-[#1e293b] bg-[#020617] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Words" value={stats.words} highlight />
        <Stat label="Characters" value={stats.characters} />
        <Stat label="No Spaces" value={stats.charactersNoSpace} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Read Time" value={`${stats.readingTime}m`} icon={<Clock className="h-3 w-3" />} />
      </div>

      <button
        onClick={() => setText('')}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white"
      >
        <RotateCcw className="h-4 w-4" /> Clear
      </button>
    </div>
  );
}

function Stat({ label, value, highlight, icon }: { label: string; value: number | string; highlight?: boolean; icon?: React.ReactNode }) {
  return (
    <div className={`rounded-lg border p-3 text-center ${highlight ? 'border-[#2563EB]/40 bg-[#2563EB]/10' : 'border-[#1e293b] bg-[#020617]'}`}>
      <div className={`text-2xl font-bold tabular-nums ${highlight ? 'text-[#3B82F6]' : 'text-white'}`}>
        {value}
      </div>
      <div className="mt-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {icon}{label}
      </div>
    </div>
  );
}
