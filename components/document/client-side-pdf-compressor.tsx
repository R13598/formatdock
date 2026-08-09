'use client';

import { useCallback, useState } from 'react';
import { FileArchive, Upload, Download, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ClientSidePdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const [working, setWorking] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    setFile(f);
    setOrigSize(f.size);
    setResultUrl(null);
    setNewSize(0);
  }, []);

  const compress = useCallback(async () => {
    if (!file) return;
    setWorking(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

      // Strip metadata
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setKeywords([]);
      pdf.setProducer('');
      pdf.setCreator('');

      const out = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([out], { type: 'application/pdf' });
      setNewSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));

      const saved = origSize - blob.size;
      if (saved > 0) {
        toast.success('Compression complete', { description: `Saved ${(saved / 1024).toFixed(0)} KB (${((saved / origSize) * 100).toFixed(0)}% smaller). 0 KB uploaded to servers.` });
      } else {
        toast.info('No size reduction', { description: 'This PDF is already well-optimized.' });
      }
    } catch {
      toast.error('Compression failed', { description: 'This PDF may be encrypted or corrupted.' });
    } finally {
      setWorking(false);
    }
  }, [file, origSize]);

  return (
    <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <FileArchive className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Client-Side PDF Compressor</h2>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        onClick={() => { const el = document.createElement('input'); el.type = 'file'; el.accept = 'application/pdf'; el.onchange = () => { const f = el.files?.[0]; if (f) handleFile(f); }; el.click(); }}
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
      </div>

      {file && (
        <div className="mt-6 rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">Original: {(origSize / 1024).toFixed(0)} KB</p>
            </div>
            {newSize > 0 && (
              <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {(newSize / 1024).toFixed(0)} KB
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={compress} disabled={working} className="btn-primary-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50">
              {working ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing locally…</> : <><FileArchive className="h-4 w-4" /> Compress PDF</>}
            </button>
            {resultUrl && (
              <a href={resultUrl} download={file.name.replace(/\.pdf$/i, '-compressed.pdf')}>
                <button className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400">
                  <Download className="h-4 w-4" /> Download
                </button>
              </a>
            )}
            <button onClick={() => { setFile(null); setResultUrl(null); setNewSize(0); }} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
