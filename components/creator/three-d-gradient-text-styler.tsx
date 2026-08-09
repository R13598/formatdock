'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Palette, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ThreeDGradientTextStyler() {
  const [text, setText] = useState('FORMAT');
  const [fontSize, setFontSize] = useState(120);
  const [color1, setColor1] = useState('#2563eb');
  const [color2, setColor2] = useState('#06b6d4');
  const [strokeColor, setStrokeColor] = useState('#1e3a8a');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [shadowDepth, setShadowDepth] = useState(6);
  const [shadowColor, setShadowColor] = useState('#1e293b');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const padding = 40;
    ctx.font = `900 ${fontSize}px sans-serif`;
    const metrics = ctx.measureText(text);
    const w = Math.ceil(metrics.width) + padding * 2;
    const h = fontSize * 1.6 + padding * 2;
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);

    // Draw layered shadows for 3D depth
    for (let i = shadowDepth; i > 0; i--) {
      ctx.fillStyle = shadowColor;
      ctx.globalAlpha = 1 - i / (shadowDepth + 2);
      ctx.fillText(text, padding + i * 2, fontSize + padding + i * 2);
    }
    ctx.globalAlpha = 1;

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;

    // Stroke
    if (strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.strokeText(text, padding, fontSize + padding);
    }

    ctx.fillText(text, padding, fontSize + padding);
  }, [text, fontSize, color1, color2, strokeColor, strokeWidth, shadowDepth, shadowColor]);

  useEffect(() => { render(); }, [render]);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${text || 'text'}-3d.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Downloaded', { description: 'Transparent PNG saved. 0 KB uploaded to servers.' });
    }, 'image/png');
  }, [text]);

  return (
    <div className="max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Palette className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-foreground">3D Gradient Text Styler</h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Text</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value.toUpperCase())} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Font size: {fontSize}px</label>
          <input type="range" min={40} max={200} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full accent-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shadow depth: {shadowDepth}</label>
          <input type="range" min={0} max={15} value={shadowDepth} onChange={(e) => setShadowDepth(+e.target.value)} className="w-full accent-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Gradient top</label>
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Gradient bottom</label>
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stroke width: {strokeWidth}px</label>
          <input type="range" min={0} max={10} value={strokeWidth} onChange={(e) => setStrokeWidth(+e.target.value)} className="w-full accent-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stroke color</label>
          <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shadow color</label>
          <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background" />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-muted/20 p-6">
        <canvas ref={canvasRef} className="mx-auto max-w-full" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={download} className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95">
          <Download className="h-4 w-4" /> Download PNG
        </button>
        <button onClick={() => { setText('FORMAT'); setFontSize(120); setShadowDepth(6); }} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>
    </div>
  );
}
