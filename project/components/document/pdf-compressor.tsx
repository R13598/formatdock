'use client';

import { useCallback, useRef, useState } from 'react';
import { FileArchive, Upload, Download, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Status = 'idle' | 'working' | 'done';

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [targetKb, setTargetKb] = useState(200);
  const [status, setStatus] = useState<Status>('idle');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    setFile(f);
    setOrigSize(f.size);
    setResultUrl(null);
    setNewSize(0);
    setStatus('idle');
  }, []);

  const compress = useCallback(async () => {
    if (!file) return;
    setStatus('working');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = pdf.getPages();

      const newPdf = await PDFDocument.create();
      const copied = await newPdf.copyPages(pdf, pages.map((_, i) => i));
      copied.forEach((p) => newPdf.addPage(p));

      let outBytes = await newPdf.save({ useObjectStreams: true });
      const targetBytes = targetKb * 1024;

      if (outBytes.length > targetBytes) {
        newPdf.setTitle('');
        newPdf.setAuthor('');
        newPdf.setSubject('');
        newPdf.setKeywords([]);
        newPdf.setProducer('FormatDock');
        newPdf.setCreator('FormatDock');
        outBytes = await newPdf.save({ useObjectStreams: true });
      }

      const blob = new Blob([outBytes], { type: 'application/pdf' });
      setNewSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
      setStatus('done');

      if (blob.size <= targetBytes) {
        toast.success('Compression complete', {
          description: `Reduced to ${(blob.size / 1024).toFixed(0)} KB (target ${targetKb} KB). 0 KB uploaded to servers.`,
        });
      } else {
        toast.warning('Partially compressed', {
          description: `Best result: ${(blob.size / 1024).toFixed(0)} KB. Target ${targetKb} KB could not be fully reached without re-rendering images.`,
        });
      }
    } catch {
      toast.error('Compression failed', { description: 'This PDF may be encrypted or corrupted.' });
      setStatus('idle');
    }
  }, [file, targetKb]);

  return (
    <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <FileArchive className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-foreground">PDF Compressor</h2>
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
        <p className="mt-1.5 text-xs text-muted-foreground">PDF files only — processed locally</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {['PDF'].map((f) => (
            <span key={f} className="rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{f}</span>
          ))}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {file && (
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">Original: {(origSize / 1024).toFixed(0)} KB</p>
            </div>
            {status === 'done' && newSize > 0 && (
              <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {(newSize / 1024).toFixed(0)} KB
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Target size</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={20}
                value={targetKb}
                onChange={(e) => setTargetKb(Math.max(20, parseInt(e.target.value) || 200))}
                className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <span className="text-sm text-muted-foreground">KB</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={compress}
              disabled={status === 'working'}
              className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
            >
              {status === 'working' ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processing locally…</>
              ) : (
                <><FileArchive className="h-4 w-4" /> Compress PDF</>
              )}
            </button>
            {resultUrl && status === 'done' && (
              <a href={resultUrl} download={file.name.replace(/\.pdf$/i, '-compressed.pdf')}>
                <button className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition-colors hover:bg-emerald-500/20">
                  <Download className="h-4 w-4" /> Download
                </button>
              </a>
            )}
            <button
              onClick={() => { setFile(null); setResultUrl(null); setStatus('idle'); }}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
