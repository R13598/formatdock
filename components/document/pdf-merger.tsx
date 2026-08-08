'use client';

import { useCallback, useRef, useState } from 'react';
import { Files, Download, RotateCcw, Loader2, Upload, Plus, Layers } from 'lucide-react';
import { toast } from 'sonner';
import PDFWorkspace, { type WatermarkConfig, DEFAULT_WATERMARK, getWatermarkRgb } from '@/components/tools/PDFWorkspace';

type MergePage = {
  id: string;
  fileIndex: number;
  pageNumber: number;
  rotation: number;
};

export default function PdfMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<MergePage[]>([]);
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [watermark, setWatermark] = useState<WatermarkConfig>(DEFAULT_WATERMARK);
  const idCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedPages = new Set<number>();

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList) return;
    const { PDFDocument } = await import('pdf-lib');
    const newFiles: File[] = [];
    const newPages: MergePage[] = [];
    for (const f of Array.from(fileList)) {
      if (f.type !== 'application/pdf') continue;
      try {
        const bytes = await f.arrayBuffer();
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const fi = files.length + newFiles.length;
        newFiles.push(f);
        for (let p = 1; p <= pdf.getPageCount(); p++) {
          newPages.push({
            id: `merge-${idCounter.current++}`,
            fileIndex: fi,
            pageNumber: p,
            rotation: 0,
          });
        }
      } catch {
        toast.error(`Could not read ${f.name}`);
      }
    }
    setFiles((prev) => [...prev, ...newFiles]);
    setPages((prev) => [...prev, ...newPages]);
    setResultUrl(null);
  }, [files.length]);

  const handleReorder = useCallback((fromId: string, toId: string) => {
    setPages((prev) => {
      const fromIdx = prev.findIndex((p) => p.id === fromId);
      const toIdx = prev.findIndex((p) => p.id === toId);
      if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, []);

  // PDFWorkspace callbacks use pageNumber; for merge we map to page id
  const onTogglePage = useCallback(() => {}, []);
  const onRotatePage = useCallback((pageNumber: number) => {
    // Find the page with this pageNumber in current visible set and rotate it
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.pageNumber === pageNumber);
      if (idx === -1) return prev;
      return prev.map((p, i) => i === idx ? { ...p, rotation: (p.rotation + 90) % 360 } : p);
    });
  }, []);
  const onDeletePage = useCallback((pageNumber: number) => {
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.pageNumber === pageNumber);
      if (idx === -1) return prev;
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const merge = useCallback(async () => {
    if (pages.length < 1) return;
    setBusy(true);
    try {
      const { PDFDocument, degrees, rgb } = await import('pdf-lib');
      const out = await PDFDocument.create();

      // Cache loaded source PDFs
      const sourcePdfs: Awaited<ReturnType<typeof PDFDocument.load>>[] = [];
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        sourcePdfs.push(await PDFDocument.load(bytes, { ignoreEncryption: true }));
      }

      for (const page of pages) {
        const srcPdf = sourcePdfs[page.fileIndex];
        if (!srcPdf) continue;
        const [copied] = await out.copyPages(srcPdf, [page.pageNumber - 1]);
        if (page.rotation !== 0) {
          copied.setRotation(degrees(page.rotation));
        }
        const outPage = out.addPage(copied);

        // Draw watermark
        if (watermark.enabled && watermark.text) {
          const { width, height } = outPage.getSize();
          const wmRgb = getWatermarkRgb(watermark.color);
          const fontSize = Math.min(width, height) / 10;
          const opacity = watermark.opacity / 100;
          outPage.drawText(watermark.text, {
            x: width / 2 - (watermark.text.length * fontSize * 0.3),
            y: height / 2,
            size: fontSize,
            font: await out.embedFont('Helvetica-Bold'),
            color: rgb(wmRgb[0], wmRgb[1], wmRgb[2]),
            opacity,
            rotate: degrees(45),
          });
        }
      }

      const blob = new Blob([await out.save({ useObjectStreams: true })], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      toast.success('PDFs merged', { description: 'Processed 100% locally — 0 KB uploaded to servers.' });
    } catch {
      toast.error('Merge failed', { description: 'One of the PDFs may be encrypted.' });
    } finally {
      setBusy(false);
    }
  }, [pages, files, watermark]);

  const reset = useCallback(() => {
    setFiles([]);
    setPages([]);
    setResultUrl(null);
    setWatermark(DEFAULT_WATERMARK);
  }, []);

  // Show dropzone when no files loaded
  if (files.length === 0) {
    return (
      <div className="max-w-2xl rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
            <Files className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-white">PDF Merger</h2>
        </div>
        <p className="mt-2 text-sm text-slate-400">Drop multiple PDFs to extract and visually rearrange all pages before merging.</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`mt-6 flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
            dragOver ? 'scale-[1.01] border-blue-500 bg-blue-500/10 shadow-[0_0_24px_-4px_rgba(37,99,235,0.4)]' : 'border-[#252D3D] bg-[#0B101E] hover:border-blue-500/50 hover:bg-blue-500/5'
          }`}
        >
          <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${dragOver ? 'scale-110 bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-400'}`}>
            <Upload className={`h-7 w-7 transition-transform ${dragOver ? 'scale-110' : ''}`} />
          </div>
          <p className="text-sm font-semibold text-white">
            {dragOver ? 'Release to drop your PDFs' : 'Drag & drop PDF files here or click to browse'}
          </p>
          <p className="mt-1.5 text-xs text-slate-400">Add 2 or more PDF files to merge</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            <span className="rounded-md border border-[#252D3D] bg-[#151B2B] px-2 py-0.5 font-mono text-[10px] text-slate-400">PDF</span>
          </div>
          <input ref={inputRef} type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">PDF Merger</h2>
              <p className="text-xs text-slate-400">{files.length} files · {pages.length} pages · Drag to reorder</p>
            </div>
          </div>

          {/* Add more files button */}
          <button
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#252D3D] bg-[#0B101E] px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-blue-500/50 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" /> Add more PDFs
          </button>
          <input ref={inputRef} type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </div>

        <PDFWorkspace
          files={files}
          selectedPages={selectedPages}
          onTogglePage={onTogglePage}
          onRotatePage={onRotatePage}
          onDeletePage={onDeletePage}
          onReorderPages={handleReorder}
          enableDragReorder
          showWatermarkBar
          watermark={watermark}
          onWatermarkChange={setWatermark}
          className="mt-6"
        />

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={merge}
            disabled={pages.length < 1 || busy}
            className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing locally in browser…</> : <><Files className="h-4 w-4" /> Merge {pages.length} Pages</>}
          </button>
          {resultUrl && (
            <a href={resultUrl} download="formatdock-merged.pdf">
              <button className="inline-flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 px-5 py-2.5 text-sm font-semibold text-green-400 transition-colors hover:bg-green-500/20">
                <Download className="h-4 w-4" /> Download
              </button>
            </a>
          )}
          <button
            onClick={reset}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}
