'use client';

import { useCallback, useState } from 'react';
import { ShieldCheck, Upload, Download, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ExifInfo = { hasExif: boolean; details: string[] };

export default function ExifDataRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [exifInfo, setExifInfo] = useState<ExifInfo | null>(null);
  const [working, setWorking] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [newSize, setNewSize] = useState(0);

  const handleFile = useCallback(async (f: File) => {
    if (!f.type.startsWith('image/jpeg') && !f.type.startsWith('image/jpg')) {
      toast.error('Please upload a JPEG file');
      return;
    }
    setFile(f);
    setResultUrl(null);
    setNewSize(0);
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setImgUrl(URL.createObjectURL(f));

    // Read EXIF
    try {
      const piexif = (await import('piexifjs')).default;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const exif = piexif.load(reader.result as string);
          const details: string[] = [];
          if (exif['0th']) {
            const ImageIFD = piexif.ImageIFD;
            if (exif['0th'][ImageIFD.Make]) details.push(`Camera: ${exif['0th'][ImageIFD.Make]}`);
            if (exif['0th'][ImageIFD.Model]) details.push(`Model: ${exif['0th'][ImageIFD.Model]}`);
            if (exif['0th'][ImageIFD.DateTime]) details.push(`Date: ${exif['0th'][ImageIFD.DateTime]}`);
          }
          if (exif['Exif']) {
            const ExifIFD = piexif.ExifIFD;
            if (exif['Exif'][ExifIFD.LensModel]) details.push(`Lens: ${exif['Exif'][ExifIFD.LensModel]}`);
            if (exif['Exif'][ExifIFD.ISOSpeedRatings]) details.push(`ISO: ${exif['Exif'][ExifIFD.ISOSpeedRatings]}`);
          }
          if (exif['GPS']) {
            const gps = exif['GPS'];
            if (Object.keys(gps).length > 0) details.push('GPS location data found');
          }
          setExifInfo({ hasExif: details.length > 0, details });
        } catch {
          setExifInfo({ hasExif: false, details: ['No EXIF data found'] });
        }
      };
      reader.readAsDataURL(f);
    } catch {
      setExifInfo({ hasExif: false, details: ['Could not read EXIF'] });
    }
  }, [imgUrl]);

  const removeExif = useCallback(async () => {
    if (!file) return;
    setWorking(true);
    try {
      const piexif = (await import('piexifjs')).default;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const dataUrl = reader.result as string;
          // Insert empty EXIF to overwrite
          const exifBytes = piexif.dump({ '0th': {}, 'Exif': {}, 'GPS': {}, 'Interop': {}, '1st': {}, 'thumbnail': undefined });
          const newUrl = piexif.insert(exifBytes, dataUrl);
          const blob = dataUrlToBlob(newUrl);
          setNewSize(blob.size);
          setResultUrl(URL.createObjectURL(blob));
          toast.success('EXIF removed', { description: 'All metadata stripped from your image. 0 KB uploaded to servers.' });
        } catch {
          // Fallback: re-encode via canvas (strips all metadata)
          stripViaCanvas(file);
        }
        setWorking(false);
      };
      reader.onerror = () => { stripViaCanvas(file); setWorking(false); };
      reader.readAsDataURL(file);
    } catch {
      stripViaCanvas(file);
      setWorking(false);
    }
  }, [file]);

  const stripViaCanvas = (f: File) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        setNewSize(blob.size);
        setResultUrl(URL.createObjectURL(blob));
        toast.success('EXIF removed', { description: 'Metadata stripped via canvas re-encode.' });
      }, 'image/jpeg', 0.95);
    };
    img.src = URL.createObjectURL(f);
  };

  return (
    <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-foreground">EXIF Data Remover</h2>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        onClick={() => { const el = document.createElement('input'); el.type = 'file'; el.accept = 'image/jpeg'; el.onchange = () => { const f = el.files?.[0]; if (f) handleFile(f); }; el.click(); }}
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
        <p className="mt-1.5 text-xs text-slate-400">JPEG files only — strips GPS, camera & metadata locally</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {['JPG', 'JPEG'].map((f) => (
            <span key={f} className="rounded-md border border-[#252D3D] bg-[#151B2B] px-2 py-0.5 font-mono text-[10px] text-slate-400">{f}</span>
          ))}
        </div>
      </div>

      {file && (
        <div className="mt-6 space-y-4 rounded-lg border border-border bg-muted/20 p-4">
          {imgUrl && (
            <img src={imgUrl} alt="Preview" className="max-h-48 rounded-lg border border-border object-contain" />
          )}
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            {newSize > 0 && (
              <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {(newSize / 1024).toFixed(0)} KB
              </span>
            )}
          </div>

          {exifInfo && (
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Detected metadata</p>
              {exifInfo.details.length > 0 ? (
                <ul className="mt-1 space-y-0.5">
                  {exifInfo.details.map((d, i) => (
                    <li key={i} className="text-xs text-foreground">{d}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">No metadata found</p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button onClick={removeExif} disabled={working} className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50">
              {working ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing locally…</> : <><ShieldCheck className="h-4 w-4" /> Remove EXIF</>}
            </button>
            {resultUrl && (
              <a href={resultUrl} download={file.name.replace(/\.jpe?g$/i, '-clean.jpg')}>
                <button className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400">
                  <Download className="h-4 w-4" /> Download
                </button>
              </a>
            )}
            <button onClick={() => { setFile(null); setImgUrl(null); setResultUrl(null); setExifInfo(null); setNewSize(0); }} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  const bstr = atob(arr[1]);
  const u8 = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i);
  return new Blob([u8], { type: mime });
}
