'use client';

import { useState, useMemo } from 'react';
import { RectangleHorizontal, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const presets = [
  { label: '16:9', w: 1920, h: 1080, name: 'YouTube / Widescreen' },
  { label: '9:16', w: 1080, h: 1920, name: 'TikTok / Reels / Shorts' },
  { label: '4:3', w: 1440, h: 1080, name: 'Classic TV / Slides' },
  { label: '1:1', w: 1080, h: 1080, name: 'Instagram Square' },
  { label: '21:9', w: 2560, h: 1080, name: 'Cinematic Ultra-wide' },
  { label: '3:2', w: 1440, h: 960, name: 'Photography' },
];

export default function AspectRatioFramingCalculator() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const ratio = useMemo(() => {
    if (width <= 0 || height <= 0) return { simple: '—', decimal: 0 };
    const g = gcd(width, height);
    return { simple: `${width / g}:${height / g}`, decimal: width / height };
  }, [width, height]);

  const orientation = width > height ? 'Landscape' : width < height ? 'Portrait' : 'Square';

  return (
    <div className="max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <RectangleHorizontal className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Aspect Ratio Framing Calculator</h2>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Width (px)</label>
              <input
                type="number"
                min={1}
                value={width}
                onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Height (px)</label>
              <input
                type="number"
                min={1}
                value={height}
                onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Results */}
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aspect Ratio</span>
              <span className="text-2xl font-extrabold text-primary">{ratio.simple}</span>
            </div>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>Decimal: <span className="font-mono text-foreground">{ratio.decimal.toFixed(3)}</span></p>
              <p>Orientation: <span className="text-foreground">{orientation}</span></p>
              <p>Total pixels: <span className="font-mono text-foreground">{(width * height).toLocaleString()}</span></p>
            </div>
          </div>

          {/* Presets */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Common Presets</p>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setWidth(p.w); setHeight(p.h); }}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-left transition-all',
                    width === p.w && height === p.h
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-muted/30 hover:border-primary/40'
                  )}
                >
                  <span className="block text-sm font-bold text-foreground">{p.label}</span>
                  <span className="block text-[10px] text-muted-foreground">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setWidth(1920); setHeight(1080); }}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>

        {/* Visualizer */}
        <div className="flex items-center justify-center rounded-xl border border-border bg-muted/20 p-6">
          <div
            className="relative flex items-center justify-center rounded-lg border-2 border-primary/40 bg-primary/10"
            style={{
              width: ratio.decimal >= 1 ? '100%' : `${ratio.decimal * 100}%`,
              aspectRatio: `${width} / ${height}`,
              maxWidth: '100%',
              maxHeight: '300px',
            }}
          >
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{ratio.simple}</p>
              <p className="text-xs text-muted-foreground">{width}×{height}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
