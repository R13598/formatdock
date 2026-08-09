'use client';

import { useCallback, useState } from 'react';
import { FileImage, Upload, Download, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Format = 'jpeg' | 'png';

export default function WebpToJpgPngConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<Format>('png');
  const [quality, setQuality] = useState(95);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (!f.type.includes('webp') && !f.name.toLowerCase().endsWith('.webp')) {
      toast.error('Please upload a WebP image');
      return;
    }
    setFile(f);
    setResultUrl(null);
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setImgUrl(URL.createObjectURL(f));
  }, [imgUrl]);

  const convert = useCallback(async () => {
    if (!file) return;
    setWorking(true);
    try {
      const img = new Image();
      img.src = imgUrl!;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const q = format === 'png' ? undefined : quality / 100;

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Conversion failed');
          setWorking(false);
          return;
        }
        setResultUrl(URL.createObjectURL(blob));
        toast.success('Converted', { description: `Saved as ${format.toUpperCase()}. 0 KB uploaded to servers.` });
        setWorking(false);
      }, mime, q);
    } catch {
      toast.error('Conversion failed', { description: 'Could not process the WebP file.' });
      setWorking(false);
    }
  }, [file, imgUrl, format, quality]);

  return (
    <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <FileImage className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-foreground">WebP to JPG/PNG Converter</h2>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        onClick={() => { const el = document.createElement('input'); el.type = 'file'; el.accept = 'image/webp'; el.onchange = () => { const f = el.files?.[0]; if (f) handleFile(f); }; el.click(); }}
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
        <p className="mt-1.5 text-xs text-slate-400">WebP files — converted instantly in your browser</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {['WebP'].map((f) => (
            <span key={f} className="rounded-md border border-[#252D3D] bg-[#151B2B] px-2 py-0.5 font-mono text-[10px] text-slate-400">{f}</span>
          ))}
        </div>
      </div>

      {file && (
        <div className="mt-6 space-y-4 rounded-lg border border-border bg-muted/20 p-4">
          {imgUrl && <img src={imgUrl} alt="Preview" className="max-h-48 rounded-lg border border-border object-contain" />}
          <p className="truncate text-sm font-medium text-foreground">{file.name}</p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              {(['png', 'jpeg'] as Format[]).map((f) => (
                <button key={f} onClick={() => setFormat(f)} className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-all', format === f ? 'bg-primary text-primary-foreground' : 'border border-border bg-muted/30 text-muted-foreground hover:text-foreground')}>
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            {format === 'jpeg' && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quality: {quality}%</label>
                <input type="range" min={50} max={100} value={quality} onChange={(e) => setQuality(+e.target.value)} className="accent-primary" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={convert} disabled={working} className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50">
              {working ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing locally…</> : <><FileImage className="h-4 w-4" /> Convert to {format.toUpperCase()}</>}
            </button>
            {resultUrl && (
              <a href={resultUrl} download={file.name.replace(/\.webp$/i, `.${format === 'jpeg' ? 'jpg' : 'png'}`)}>
                <button className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400">
                  <Download className="h-4 w-4" /> Download
                </button>
              </a>
            )}
            <button onClick={() => { setFile(null); setImgUrl(null); setResultUrl(null); }} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
