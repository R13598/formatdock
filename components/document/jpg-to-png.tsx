'use client';

import { useCallback, useRef, useState } from 'react';
import { FileImage, Upload, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function JpgToPngConverter() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const i = await new Promise<HTMLImageElement>((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = url;
    });
    setImg(i);
    const canvas = document.createElement('canvas');
    canvas.width = i.width;
    canvas.height = i.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(i, 0, 0);
    const pngUrl = canvas.toDataURL('image/png');
    setResultUrl(pngUrl);
    toast.success('Conversion complete!', { description: 'Your JPG has been converted to PNG. 0 KB uploaded to servers.' });
  }, []);

  return (
    <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <FileImage className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-foreground">JPG to PNG Converter</h2>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        onClick={() => inputRef.current?.click()}
        className={`mt-6 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
          dragOver ? 'scale-[1.01] border-primary bg-primary/10 shadow-[0_0_24px_-4px_rgba(37,99,235,0.4)]' : 'border-border bg-card/60 hover:border-primary/50 hover:bg-primary/5'
        }`}
      >
        <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${dragOver ? 'scale-110 bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
          <Upload className={`h-7 w-7 transition-transform ${dragOver ? 'scale-110' : ''}`} />
        </div>
        <p className="text-sm font-semibold text-foreground">
          {dragOver ? 'Release to drop file' : 'Drag & drop your file here or click to browse'}
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">JPG / JPEG images</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {['JPG', 'JPEG'].map((f) => (
            <span key={f} className="rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{f}</span>
          ))}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {resultUrl && img && (
        <div className="mt-6 space-y-3">
          <div className="overflow-hidden rounded-lg border border-border bg-muted/30 p-4 text-center">
            <img src={resultUrl} alt="PNG preview" className="mx-auto max-h-48" />
          </div>
          <a href={resultUrl} download="formatdock-converted.png">
            <button className="btn-primary-glow inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-transform active:scale-95">
              <Download className="h-5 w-5" /> Download PNG
            </button>
          </a>
          <button
            onClick={() => { setImg(null); setResultUrl(null); }}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" /> Clear
          </button>
        </div>
      )}
    </div>
  );
}
