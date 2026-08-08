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
    <div className="max-w-2xl rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
          <QrCode className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">QR Code Generator</h2>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Text or URL
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Enter any text or URL…"
            className="w-full resize-y rounded-lg border border-[#1e293b] bg-[#020617] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
          />

          <label className="mb-1.5 mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Size: {size}px
          </label>
          <input
            type="range"
            min={128}
            max={512}
            step={32}
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full accent-[#2563EB]"
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
              className="inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-xl border border-[#1e293b] bg-white p-6">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
      </div>
    </div>
  );
}
