'use client';

import { useCallback, useRef, useState } from 'react';
import { Stamp, Upload, Download, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function PdfWatermarkStudio() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.25);
  const [color, setColor] = useState('#dc2626');
  const [fontSize, setFontSize] = useState(60);
  const [rotation, setRotation] = useState(-45);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    setFile(f);
    setResultUrl(null);
  }, []);

  const applyWatermark = useCallback(async () => {
    if (!file) return;
    setWorking(true);
    try {
      const { PDFDocument, rgb, degrees } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = pdf.getPages();
      const hex = color.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;

      const font = await pdf.embedFont('Helvetica-Bold');

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const x = (width - textWidth) / 2;
        const y = height / 2;
        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity,
          rotate: degrees(rotation),
        });
      });

      const out = await pdf.save();
      const blob = new Blob([out], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      toast.success('Watermark applied', { description: `Added to ${pages.length} page${pages.length !== 1 ? 's' : ''}. 0 KB uploaded to servers.` });
    } catch {
      toast.error('Watermark failed', { description: 'This PDF may be encrypted or corrupted.' });
    } finally {
      setWorking(false);
    }
  }, [file, text, opacity, color, fontSize, rotation]);

  return (
    <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Stamp className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-foreground">PDF Watermark Studio</h2>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'mt-6 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300',
          dragOver
            ? 'scale-[1.01] border-blue-500 bg-blue-500/10 shadow-[0_0_24px_-4px_rgba(37,99,235,0.4)]'
            : 'border-[#252D3D] bg-[#0B101E] hover:border-blue-500/50 hover:bg-blue-500/5'
        )}
      >
        <div className={cn(
          'mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300',
          dragOver ? 'scale-110 bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-400'
        )}>
          <Upload className={cn('h-7 w-7 transition-transform', dragOver && 'scale-110')} />
        </div>
        <p className="text-sm font-semibold text-white">
          {dragOver ? 'Release to drop file' : 'Drag & drop your file here or click to browse'}
        </p>
        <p className="mt-1.5 text-xs text-slate-400">PDF files only — processed locally</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {['PDF'].map((f) => (
            <span key={f} className="rounded-md border border-[#252D3D] bg-[#151B2B] px-2 py-0.5 font-mono text-[10px] text-slate-400">{f}</span>
          ))}
        </div>
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      {file && (
        <div className="mt-6 space-y-4 rounded-lg border border-border bg-muted/20 p-4">
          <p className="truncate text-sm font-medium text-foreground">{file.name}</p>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Watermark text</label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Opacity: {Math.round(opacity * 100)}%</label>
              <input type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(+e.target.value)} className="w-full accent-primary" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Font size: {fontSize}px</label>
              <input type="range" min={20} max={120} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full accent-primary" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rotation: {rotation}°</label>
              <input type="range" min={-90} max={90} value={rotation} onChange={(e) => setRotation(+e.target.value)} className="w-full accent-primary" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Color</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={applyWatermark} disabled={working} className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50">
              {working ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing locally…</> : <><Stamp className="h-4 w-4" /> Apply Watermark</>}
            </button>
            {resultUrl && (
              <a href={resultUrl} download={(file.name.replace(/\.pdf$/i, '-watermarked.pdf'))}>
                <button className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400">
                  <Download className="h-4 w-4" /> Download
                </button>
              </a>
            )}
            <button onClick={() => { setFile(null); setResultUrl(null); }} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
