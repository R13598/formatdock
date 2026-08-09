'use client';

import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import type { Tool } from '@/lib/tools';
import { cn } from '@/lib/utils';

type BadgeStyle = {
  bg: string;
  border: string;
  text: string;
  glow: string;
};

const badgeStylesByGroup: Record<string, BadgeStyle> = {
  'Exam Photo Tools': {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    border: 'border-emerald-500/30 dark:border-emerald-400/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'shadow-[0_4px_16px_-2px_rgba(16,185,129,0.3)]',
  },
  'Document Utilities': {
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    border: 'border-rose-500/30 dark:border-rose-400/30',
    text: 'text-rose-600 dark:text-rose-400',
    glow: 'shadow-[0_4px_16px_-2px_rgba(244,63,94,0.3)]',
  },
  'Calculators': {
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    border: 'border-blue-500/30 dark:border-blue-400/30',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-[0_4px_16px_-2px_rgba(59,130,246,0.3)]',
  },
  'Productivity & Focus': {
    bg: 'bg-teal-500/10 dark:bg-teal-500/15',
    border: 'border-teal-500/30 dark:border-teal-400/30',
    text: 'text-teal-600 dark:text-teal-400',
    glow: 'shadow-[0_4px_16px_-2px_rgba(20,184,166,0.3)]',
  },
  'Creator Studio': {
    bg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/15',
    border: 'border-fuchsia-500/30 dark:border-fuchsia-400/30',
    text: 'text-fuchsia-600 dark:text-fuchsia-400',
    glow: 'shadow-[0_4px_16px_-2px_rgba(217,70,239,0.3)]',
  },
  'Image & Dev Utilities': {
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    border: 'border-cyan-500/30 dark:border-cyan-400/30',
    text: 'text-cyan-600 dark:text-cyan-400',
    glow: 'shadow-[0_4px_16px_-2px_rgba(6,182,212,0.3)]',
  },
};

export default function ToolCard({ tool }: { tool: Tool }) {
  const Icon = (Icons as Record<string, any>)[tool.icon] ?? Icons.Wrench;
  const style = badgeStylesByGroup[tool.group] ?? badgeStylesByGroup['Calculators'];

  return (
    <Link href={`/tools/${tool.slug}`} className="group block h-full">
      <div className="relative h-full overflow-hidden rounded-2xl border border-border/80 dark:border-white/10 bg-card/60 dark:bg-card/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1 group-hover:bg-card/80">
        
        {/* Glass Edge Specular Highlight */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent group-hover:via-primary/50" />

        <div className="flex h-full flex-col">
          {/* Top Row: Translucent Category Badge & Arrow */}
          <div className="mb-3.5 flex items-center justify-between">
            <div
              className={cn(
                'squircle-glow relative flex h-12 w-12 items-center justify-center rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.25)] dark:shadow-[inset_0px_1px_1px_rgba(255,255,255,0.15)]',
                style.bg,
                style.border,
                style.text,
                style.glow
              )}
            >
              <Icon className="h-5 w-5 stroke-[2.2] drop-shadow-sm" />
            </div>

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-all duration-300 group-hover:bg-primary/20 group-hover:text-primary group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {tool.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 flex-1 text-xs text-muted-foreground leading-relaxed">
            {tool.description}
          </p>

          {/* Preset Badges */}
          {tool.preset && (
            <div className="mt-3.5 flex flex-wrap gap-1.5 pt-2.5 border-t border-border/40 dark:border-white/5">
              <span className="rounded-md border border-border/60 dark:border-white/10 bg-muted/50 px-2 py-0.5 font-mono text-[9px] font-bold text-blue-500 dark:text-blue-400">
                {tool.preset.width}×{tool.preset.height}px
              </span>
              <span className="rounded-md border border-border/60 dark:border-white/10 bg-muted/50 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-500 dark:text-emerald-400">
                ≤{tool.preset.maxKb}KB
              </span>
              <span className="rounded-md border border-border/60 dark:border-white/10 bg-muted/50 px-2 py-0.5 font-mono text-[9px] font-bold text-purple-500 dark:text-purple-400">
                {tool.preset.format.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}