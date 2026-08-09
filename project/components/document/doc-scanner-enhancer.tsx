'use client';

import { useCallback, useRef, useState } from 'react';
import { ScanLine, Upload, Download, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Mode = 'grayscale' | 'contrast' | 'threshold';

export default function DocScannerEnhancer() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('grayscale');
  const [contrast, setContrast] = useState(140);
  const [brightness, setBrightness] = useState(110);
  const [working, setWorking] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    setFile(f);
    setResultUrl(null);
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setImgUrl(URL.createObjectURL(f));
  }, [imgUrl]);

  const renderPreview = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxW = 1400;
    const scale = Math.min(1, maxW / img.naturalWidth);
    canvas.width = img.naturalWidth * scale;
    canvas.height = img.naturalHeight * scale;

    ctx.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imageData.data;

    if (mode === 'grayscale') {
      for (let i = 0; i < d.length; i += 4) {
        const g = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
        d[i] = d[i + 1] = d[i + 2] = g;
      }
    } else if (mode === 'threshold') {
      for (let i = 0; i < d.length; i += 4) {
        const g = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
        const v = g > 128 ? 255 : 0;
        d[i] = d[i + 1] = d[i + 2] = v;
      }
    }
    // 'contrast' mode: no pixel manipulation needed, filter already applied

    ctx.putImageData(imageData, 0, 0);
  }, [mode, contrast, brightness]);

  const exportPdf = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setWorking(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const base64 = dataUrl.split(',')[1];
      const jpgBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

      const pdf = await PDFDocument.create();
      const img = await pdf.embedJpg(jpgBytes);
      const page = pdf.addPage([canvas.width, canvas.height]);
      page.drawImage(img, { x: 0, y: 0, width: canvas.width, height: canvas.height });

      const bytes = await pdf.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      toast.success('PDF created', { description: 'Your enhanced document is ready to download. 0 KB uploaded to servers.' });
    } catch {
      toast.error('Export failed', { description: 'Could not generate the PDF.' });
    } finally {
      setWorking(false);
    }
  }, []);

  const modes: { v: Mode; label: string }[] = [
    { v: 'grayscale', label: 'Grayscale' },
    { v: 'contrast', label: 'High Contrast' },
    { v: 'threshold', label: 'B/W Threshold' },
  ];

  return (
    <div className="max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <ScanLine className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Doc Scanner &amp; PDF Enhancer</h2>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'mt-6 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300',
          dragOver
            ? 'scale-[1.01] border-primary bg-primary/10 shadow-[0_0_24px_-4px_rgba(37,99,235,0.4)]'
            : 'border-border bg-card/60 hover:border-primary/50 hover:bg-primary/5'
        )}
      >
        <div className={cn(
          'mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300',
          dragOver ? 'scale-110 bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
        )}>
          <Upload className={cn('h-7 w-7 transition-transform', dragOver && 'scale-110')} />
        </div>
        <p className="text-sm font-semibold text-foreground">
          {dragOver ? 'Release to drop file' : 'Drag & drop your file here or click to browse'}
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">JPG, PNG, WebP — processed locally</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {['JPG', 'PNG', 'WebP'].map((f) => (
            <span key={f} className="rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{f}</span>
          ))}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      {imgUrl && (
        <div className="mt-6 space-y-4">
          <img ref={imgRef} src={imgUrl} alt="Source" onLoad={renderPreview} className="hidden" />

          <div className="flex flex-wrap gap-2">
            {modes.map((m) => (
              <button
                key={m.v}
                onClick={() => { setMode(m.v); setTimeout(renderPreview, 0); }}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  mode === m.v ? 'bg-primary text-primary-foreground' : 'border border-border bg-muted/40 text-muted-foreground hover:text-foreground'
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contrast: {contrast}%</label>
              <input type="range" min={50} max={300} value={contrast} onChange={(e) => { setContrast(+e.target.value); renderPreview(); }} className="w-full accent-primary" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Brightness: {brightness}%</label>
              <input type="range" min={50} max={200} value={brightness} onChange={(e) => { setBrightness(+e.target.value); renderPreview(); }} className="w-full accent-primary" />
            </div>
          </div>

          <canvas ref={canvasRef} className="w-full rounded-xl border border-border" />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportPdf}
              disabled={working}
              className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
            >
              {working ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing locally…</> : <><ScanLine className="h-4 w-4" /> Export as PDF</>}
            </button>
            {resultUrl && (
              <a href={resultUrl} download={(file?.name ?? 'scanned').replace(/\.[^.]+$/, '') + '-scanned.pdf'}>
                <button className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400">
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              </a>
            )}
            <button
              onClick={() => { setFile(null); setImgUrl(null); setResultUrl(null); if (imgUrl) URL.revokeObjectURL(imgUrl); }}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
