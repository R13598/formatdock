'use client';

import { useCallback, useState } from 'react';
import { Scissors, Download, RotateCcw, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import FileDropzone from '@/components/ui/file-dropzone';
import PDFWorkspace from '@/components/tools/PDFWorkspace';

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [deletedPages, setDeletedPages] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setSelectedPages(new Set());
    setRotations({});
    setDeletedPages(new Set());
    setResultUrl(null);
    setPageCount(0);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    } catch {
      toast.error('Could not read PDF', { description: 'The file may be encrypted or corrupted.' });
      setFile(null);
    }
  }, []);

  const togglePage = useCallback((pageNumber: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageNumber)) next.delete(pageNumber);
      else next.add(pageNumber);
      return next;
    });
  }, []);

  const rotatePage = useCallback((pageNumber: number) => {
    setRotations((prev) => ({ ...prev, [pageNumber]: ((prev[pageNumber] ?? 0) + 90) % 360 }));
  }, []);

  const deletePage = useCallback((pageNumber: number) => {
    setDeletedPages((prev) => {
      const next = new Set(prev);
      next.add(pageNumber);
      return next;
    });
    setSelectedPages((prev) => {
      const next = new Set(prev);
      next.delete(pageNumber);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    const all = new Set<number>();
    for (let i = 1; i <= pageCount; i++) {
      if (!deletedPages.has(i)) all.add(i);
    }
    setSelectedPages(all);
  }, [pageCount, deletedPages]);

  const selectNone = useCallback(() => setSelectedPages(new Set()), []);

  const split = useCallback(async () => {
    if (!file || selectedPages.size === 0) return;
    setBusy(true);
    try {
      const { PDFDocument, degrees } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const outPdf = await PDFDocument.create();

      const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);
      const sourcePages = await outPdf.copyPages(sourcePdf, sortedPages.map((p) => p - 1));

      sourcePages.forEach((page, idx) => {
        const pageNum = sortedPages[idx];
        const rotation = rotations[pageNum] ?? 0;
        if (rotation !== 0) {
          page.setRotation(degrees(rotation));
        }
        outPdf.addPage(page);
      });

      const blob = new Blob([await outPdf.save({ useObjectStreams: true })], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      toast.success('PDF split complete', {
        description: `${selectedPages.size} page(s) extracted. 0 KB uploaded to servers.`,
      });
    } catch {
      toast.error('Split failed', { description: 'The PDF may be encrypted or corrupted.' });
    } finally {
      setBusy(false);
    }
  }, [file, selectedPages, rotations]);

  const reset = useCallback(() => {
    setFile(null);
    setSelectedPages(new Set());
    setRotations({});
    setDeletedPages(new Set());
    setResultUrl(null);
    setPageCount(0);
  }, []);

  return (
    <div className="max-w-4xl">
      <div className="rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
            <Scissors className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Split PDF</h2>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Drop a PDF, click pages to select them, then extract only the pages you need. Everything runs in your browser.
        </p>

        {!file ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            onClick={() => document.getElementById('split-file-input')?.click()}
            className={`mt-6 flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
              dragOver ? 'scale-[1.01] border-blue-500 bg-blue-500/10 shadow-[0_0_24px_-4px_rgba(37,99,235,0.4)]' : 'border-[#252D3D] bg-[#0B101E] hover:border-blue-500/50 hover:bg-blue-500/5'
            }`}
          >
            <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${dragOver ? 'scale-110 bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-400'}`}>
              <Upload className={`h-7 w-7 transition-transform ${dragOver ? 'scale-110' : ''}`} />
            </div>
            <p className="text-sm font-semibold text-white">
              {dragOver ? 'Release to drop your PDF' : 'Drag & drop your PDF here or click to browse'}
            </p>
            <p className="mt-1.5 text-xs text-slate-400">Select specific pages to extract into a new PDF</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <span className="rounded-md border border-[#252D3D] bg-[#151B2B] px-2 py-0.5 font-mono text-[10px] text-slate-400">PDF</span>
            </div>
            <input
              id="split-file-input"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
            />
          </div>
        ) : (
          <>
            <PDFWorkspace
              file={file}
              selectedPages={selectedPages}
              onTogglePage={togglePage}
              onRotatePage={rotatePage}
              onDeletePage={deletePage}
              className="mt-6"
            />

            {/* Selection controls */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={selectAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#252D3D] bg-[#0B101E] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-blue-500/50 hover:text-white"
              >
                Select All
              </button>
              <button
                onClick={selectNone}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#252D3D] bg-[#0B101E] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-blue-500/50 hover:text-white"
              >
                Deselect All
              </button>
              <span className="text-xs text-slate-400">
                {selectedPages.size} of {pageCount - deletedPages.size} pages selected
              </span>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={split}
                disabled={selectedPages.size === 0 || busy}
                className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Extracting pages…
                  </>
                ) : (
                  <>
                    <Scissors className="h-4 w-4" /> Extract {selectedPages.size} Page{selectedPages.size !== 1 ? 's' : ''}
                  </>
                )}
              </button>
              {resultUrl && (
                <a href={resultUrl} download="formatdock-split.pdf">
                  <button className="inline-flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 px-5 py-2.5 text-sm font-semibold text-green-400 transition-colors hover:bg-green-500/20">
                    <Download className="h-4 w-4" /> Download Split PDF
                  </button>
                </a>
              )}
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" /> New File
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
