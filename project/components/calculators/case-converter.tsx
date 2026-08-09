'use client';

import { useState } from 'react';
import { CaseSensitive, Copy, RotateCcw, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const conversions = [
    { label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
    { label: 'lowercase', fn: (s: string) => s.toLowerCase() },
    {
      label: 'Title Case',
      fn: (s: string) => s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()),
    },
    {
      label: 'Sentence case',
      fn: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
    },
    {
      label: 'camelCase',
      fn: (s: string) =>
        s
          .replace(/[^a-zA-Z0-9\s]/g, ' ')
          .trim()
          .toLowerCase()
          .replace(/\s+(.)/g, (_, c) => c.toUpperCase()),
    },
    {
      label: 'snake_case',
      fn: (s: string) =>
        s
          .replace(/[^a-zA-Z0-9\s]/g, ' ')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_'),
    },
    {
      label: 'kebab-case',
      fn: (s: string) =>
        s
          .replace(/[^a-zA-Z0-9\s]/g, ' ')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-'),
    },
  ];

  const apply = (fn: (s: string) => string) => {
    setText(fn(text));
    setCopied(false);
  };

  const copy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy');
    }
  };

  return (
    <div className="max-w-2xl rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
          <CaseSensitive className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Case Converter</h2>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Type or paste text here…"
        className="mt-6 w-full resize-y rounded-lg border border-[#1e293b] bg-[#020617] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {conversions.map((c) => (
          <button
            key={c.label}
            onClick={() => apply(c.fn)}
            className="rounded-lg border border-[#1e293b] bg-[#020617] px-3 py-2 text-xs font-semibold text-slate-300 transition-all duration-300 hover:scale-105 hover:border-[#2563EB]/50 hover:bg-[#2563EB]/10 hover:text-[#3B82F6]"
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={copy}
          disabled={!text}
          className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
        >
          {copied ? <><Check className="h-4 w-4 text-emerald-400" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy to Clipboard</>}
        </button>
        <button
          onClick={() => setText('')}
          className="inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" /> Clear
        </button>
      </div>
    </div>
  );
}
