'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Film, Download, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Effect = 'typewriter' | 'pulse' | 'slide';

export default function AnimatedTextGifMaker() {
  const [text, setText] = useState('Hello World');
  const [effect, setEffect] = useState<Effect>('typewriter');
  const [color, setColor] = useState('#2563eb');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparent, setTransparent] = useState(false);
  const [fontSize, setFontSize] = useState(48);
  const [speed, setSpeed] = useState(3);
  const [width, setWidth] = useState(480);
  const [working, setWorking] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const frameCount = 20;
  const delayMs = Math.round(1000 / speed);

  const drawFrame = useCallback((canvas: HTMLCanvasElement, frameIdx: number) => {
    const ctx = canvas.getContext('2d')!;
    const h = Math.round(width * 0.4);
    canvas.width = width;
    canvas.height = h;

    if (transparent) {
      ctx.clearRect(0, 0, width, h);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, h);
    }

    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const progress = frameIdx / frameCount;
    let displayText = text;

    if (effect === 'typewriter') {
      const chars = Math.ceil(text.length * progress);
      displayText = text.slice(0, chars);
    } else if (effect === 'pulse') {
      const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.15;
      ctx.save();
      ctx.translate(width / 2, h / 2);
      ctx.scale(scale, scale);
      ctx.fillText(text, 0, 0);
      ctx.restore();
      return;
    } else if (effect === 'slide') {
      const offset = (1 - progress) * width;
      ctx.fillText(text, width / 2 + offset - width / 2, h / 2);
      return;
    }

    ctx.fillText(displayText, width / 2, h / 2);
  }, [text, effect, color, bgColor, transparent, fontSize, width]);

  // Live preview animation
  useEffect(() => {
    let frame = 0;
    let raf: number;
    const animate = () => {
      if (previewRef.current) drawFrame(previewRef.current, frame);
      frame = (frame + 1) % frameCount;
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [drawFrame]);

  const generateGif = useCallback(async () => {
    setWorking(true);
    try {
      const gifshot = (await import('gifshot')).default;
      const h = Math.round(width * 0.4);

      const frames: string[] = [];
      for (let i = 0; i < frameCount; i++) {
        const canvas = document.createElement('canvas');
        drawFrame(canvas, i);
        frames.push(canvas.toDataURL());
      }

      gifshot.createGIF(
        {
          images: frames,
          gifWidth: width,
          gifHeight: h,
          interval: delayMs / 1000,
          transparent: transparent ? { r: 0, g: 0, b: 0, alpha: 0 } : undefined,
        },
        (obj: { error: boolean; image: string }) => {
          if (obj.error) {
            toast.error('GIF generation failed');
            setWorking(false);
            return;
          }
          const blob = dataUrlToBlob(obj.image);
          setResultUrl(URL.createObjectURL(blob));
          toast.success('GIF created', { description: 'Your animated text GIF is ready. 0 KB uploaded to servers.' });
          setWorking(false);
        }
      );
    } catch {
      toast.error('Could not load GIF encoder');
      setWorking(false);
    }
  }, [text, effect, color, bgColor, transparent, fontSize, width, speed, drawFrame, delayMs]);

  const effects: { v: Effect; label: string }[] = [
    { v: 'typewriter', label: 'Typewriter' },
    { v: 'pulse', label: 'Pulse' },
    { v: 'slide', label: 'Slide In' },
  ];

  return (
    <div className="max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Film className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Animated Text GIF Maker</h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Text</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Effect</label>
          <div className="flex gap-2">
            {effects.map((e) => (
              <button key={e.v} onClick={() => setEffect(e.v)} className={cn('rounded-lg px-3 py-2 text-sm font-medium transition-all', effect === e.v ? 'bg-primary text-primary-foreground' : 'border border-border bg-muted/30 text-muted-foreground hover:text-foreground')}>
                {e.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Speed: {speed} fps</label>
          <input type="range" min={1} max={10} value={speed} onChange={(e) => setSpeed(+e.target.value)} className="w-full accent-primary" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Font size: {fontSize}px</label>
          <input type="range" min={20} max={80} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full accent-primary" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Width: {width}px</label>
          <input type="range" min={240} max={640} step={40} value={width} onChange={(e) => setWidth(+e.target.value)} className="w-full accent-primary" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Text color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background" />
        </div>

        <div className="flex items-end gap-3">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Background</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} disabled={transparent} className="h-10 w-full rounded-lg border border-border bg-background disabled:opacity-40" />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="accent-primary" />
          Transparent background
        </label>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live Preview</p>
        <div className="overflow-hidden rounded-xl border border-border bg-muted/20 p-4">
          <canvas ref={previewRef} className="mx-auto" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={generateGif} disabled={working} className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50">
          {working ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing locally…</> : <><Film className="h-4 w-4" /> Generate GIF</>}
        </button>
        {resultUrl && (
          <a href={resultUrl} download="animated-text.gif">
            <button className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400">
              <Download className="h-4 w-4" /> Download GIF
            </button>
          </a>
        )}
        <button onClick={() => { setResultUrl(null); setText('Hello World'); }} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>
    </div>
  );
}

function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] ?? 'image/gif';
  const bstr = atob(arr[1]);
  const u8 = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i);
  return new Blob([u8], { type: mime });
}
