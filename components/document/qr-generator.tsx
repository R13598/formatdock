'use client';

import { useState, useRef, useEffect } from 'react';
import { QrCode, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function QrGenerator() {
  const [text, setText] = useState('https://formatdock.com');
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;

    let active = true;
    (async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        await QRCode.toCanvas(canvas, text, {
          width: size,
          margin: 2,
          color: { dark: '#0f172a', light: '#ffffff' },
          errorCorrectionLevel: 'M',
        });
      } catch {
        if (active) toast.error('Could not generate QR code');
      }
    })();
    return () => { active = false; };
  }, [text, size]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatdock-qr.png';
    a.click();
    toast.success('QR code downloaded', { description: '0 KB uploaded to servers.' });
  };

  return (
    <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <QrCode className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-foreground">QR Code Generator</h2>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Text or URL
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Enter any text or URL…"
            className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <label className="mb-1.5 mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Size: {size}px
          </label>
          <input
            type="range"
            min={128}
            max={512}
            step={32}
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full accent-primary"
          />

          <div className="mt-4 flex gap-2">
            <button
              onClick={download}
              disabled={!text}
              className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> Download PNG
            </button>
            <button
              onClick={() => setText('')}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-xl border border-border bg-white p-6 shadow-sm">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
      </div>
    </div>
  );
}
