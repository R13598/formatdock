'use client';

import { useCallback, useRef, useState } from 'react';
import { FileText, Upload, Download, RotateCcw, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageToPdfConverter() {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const loaded: HTMLImageElement[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith('image/')) continue;
      const url = URL.createObjectURL(f);
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = url;
      });
      loaded.push(img);
    }
    setImages((prev) => [...prev, ...loaded]);
  }, []);

  const buildPdf = useCallback(async () => {
    if (images.length === 0) return;
    setBusy(true);
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 24;
      images.forEach((img, idx) => {
        const maxW = pageW - margin * 2;
        const maxH = pageH - margin * 2;
        const r = Math.min(maxW / img.width, maxH / img.height);
        const w = img.width * r;
        const h = img.height * r;
        const x = (pageW - w) / 2;
        const y = (pageH - h) / 2;
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        if (idx > 0) pdf.addPage();
        pdf.addImage(dataUrl, 'JPEG', x, y, w, h);
      });
      pdf.save('formatdock-converted.pdf');
      toast.success('PDF created!', { description: `${images.length} page(s) — downloaded as formatdock-converted.pdf. 0 KB uploaded to servers.` });
    } catch {
      toast.error('Conversion failed', { description: 'Something went wrong while building the PDF.' });
    } finally {
      setBusy(false);
    }
  }, [images]);

  return (
    <div className="max-w-2xl rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
          <FileText className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Image to PDF Converter</h2>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`mt-6 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
          dragOver ? 'scale-[1.01] border-blue-500 bg-blue-500/10 shadow-[0_0_24px_-4px_rgba(37,99,235,0.4)]' : 'border-[#252D3D] bg-[#0B101E] hover:border-blue-500/50 hover:bg-blue-500/5'
        }`}
      >
        <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${dragOver ? 'scale-110 bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-400'}`}>
          <Upload className={`h-7 w-7 transition-transform ${dragOver ? 'scale-110' : ''}`} />
        </div>
        <p className="text-sm font-semibold text-white">
          {dragOver ? 'Release to drop file' : 'Drag & drop your file here or click to browse'}
        </p>
        <p className="mt-1.5 text-xs text-slate-400">JPG, PNG — multiple files supported</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {['JPG', 'PNG'].map((f) => (
            <span key={f} className="rounded-md border border-[#252D3D] bg-[#151B2B] px-2 py-0.5 font-mono text-[10px] text-slate-400">{f}</span>
          ))}
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div key={i} className="h-16 w-16 overflow-hidden rounded border border-[#1e293b] bg-white">
              <img src={img.src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
          <button
            onClick={() => inputRef.current?.click()}
            className="flex h-16 w-16 items-center justify-center rounded border border-dashed border-[#2563EB]/40 text-[#3B82F6] transition-colors hover:bg-[#2563EB]/10"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button
          onClick={buildPdf}
          disabled={images.length === 0 || busy}
          className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? (
            <>
              <RotateCcw className="h-4 w-4 animate-spin" /> Building…
            </>
          ) : (
            <>
              <Download className="h-4 w-4" /> Download PDF
            </>
          )}
        </button>
        <button
          onClick={() => setImages([])}
          disabled={images.length === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" /> Clear
        </button>
      </div>
    </div>
  );
}
