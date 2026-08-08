'use client';

import { useCallback, useState } from 'react';
import { ScanLine, Download, RotateCcw, Loader2, Upload, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import PDFWorkspace, { type WatermarkConfig, DEFAULT_WATERMARK, getWatermarkRgb } from '@/components/tools/PDFWorkspace';
import { cn } from '@/lib/utils';

type GrainLevel = 'low' | 'medium' | 'high';

export default function MakeItLookScanned() {
  const [file, setFile] = useState<File | null>(null);
  const [grayscale, setGrayscale] = useState(true);
  const [contrast, setContrast] = useState(120);
  const [grain, setGrain] = useState<GrainLevel>('medium');
  const [tilt, setTilt] = useState(true);
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [watermark, setWatermark] = useState<WatermarkConfig>(DEFAULT_WATERMARK);

  const selectedPages = new Set<number>();
  const rotations: Record<number, number> = {};

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setResultUrl(null);
    setPageCount(0);
    setProgress(0);
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

  const grainOpacity: Record<GrainLevel, number> = { low: 0.04, medium: 0.08, high: 0.14 };
  const grainBlur: Record<GrainLevel, number> = { low: 0.3, medium: 0.6, high: 1.0 };

  const generateNoisePattern = useCallback((width: number, height: number, opacity: number): HTMLCanvasElement => {
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = width;
    noiseCanvas.height = height;
    const noiseCtx = noiseCanvas.getContext('2d')!;
    const imageData = noiseCtx.createImageData(width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = Math.random() * 255 * opacity;
    }
    noiseCtx.putImageData(imageData, 0, 0);
    return noiseCanvas;
  }, []);

  const processPage = useCallback(
    async (
      pdf: { getPage: (n: number) => Promise<unknown> },
      pageNum: number,
      pdfDoc: { addPage: (size: [number, number]) => { drawImage: (img: unknown, opts: Record<string, unknown>) => void }; embedJpg: (bytes: Uint8Array) => Promise<unknown> }
    ) => {
      const page = (await pdf.getPage(pageNum)) as RenderPage;
      const baseViewport = page.getViewport({ scale: 1.5, rotation: 0 });
      const w = Math.ceil(baseViewport.width);
      const h = Math.ceil(baseViewport.height);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      // White background (scanner paper)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // Apply tilt rotation
      let tiltAngle = 0;
      if (tilt) {
        tiltAngle = (Math.random() - 0.5) * 1.2; // -0.6 to +0.6 degrees
      }
      if (tiltAngle !== 0) {
        ctx.translate(w / 2, h / 2);
        ctx.rotate((tiltAngle * Math.PI) / 180);
        ctx.translate(-w / 2, -h / 2);
      }

      // Render PDF page
      await page.render({ canvasContext: ctx, viewport: baseViewport });

      // Apply grayscale + contrast via filter
      const filterParts: string[] = [];
      if (grayscale) filterParts.push('grayscale(1)');
      filterParts.push(`contrast(${contrast}%)`);
      if (grain !== 'low') filterParts.push(`blur(${grainBlur[grain] * 0.5}px)`);

      // We need to re-draw with filter applied since pdf.js already rendered
      // Create a temp canvas with the filter applied
      const filteredCanvas = document.createElement('canvas');
      filteredCanvas.width = w;
      filteredCanvas.height = h;
      const fCtx = filteredCanvas.getContext('2d')!;
      fCtx.filter = filterParts.join(' ');
      fCtx.drawImage(canvas, 0, 0);
      fCtx.filter = 'none';

      // Add noise overlay
      const opacity = grainOpacity[grain];
      if (opacity > 0) {
        const noiseCanvas = generateNoisePattern(w, h, opacity);
        fCtx.globalCompositeOperation = 'multiply';
        fCtx.drawImage(noiseCanvas, 0, 0);
        fCtx.globalCompositeOperation = 'source-over';
      }

      // Convert to JPEG and embed in PDF
      const jpegBlob = await new Promise<Blob>((resolve) => {
        filteredCanvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.85);
      });
      const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
      const embedded = await pdfDoc.embedJpg(jpegBytes);
      const pdfPage = pdfDoc.addPage([w, h]);
      pdfPage.drawImage(embedded, {
        x: 0,
        y: 0,
        width: w,
        height: h,
      });

      // Cleanup canvases to free memory
      canvas.width = 0;
      canvas.height = 0;
      filteredCanvas.width = 0;
      filteredCanvas.height = 0;
    },
    [grayscale, contrast, grain, tilt, grainOpacity, grainBlur, generateNoisePattern]
  );

  const generate = useCallback(async () => {
    if (!file) return;
    setBusy(true);
    setProgress(0);
    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

      const { PDFDocument, degrees, rgb } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();

      // Load with pdf.js for rendering
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer.slice(0) });
      const pdf = await loadingTask.promise;

      // Load with pdf-lib for output
      const outPdf = await PDFDocument.create();
      const wmFont = await outPdf.embedFont('Helvetica-Bold');

      for (let i = 1; i <= pdf.numPages; i++) {
        await processPage(pdf, i, outPdf as unknown as { addPage: (size: [number, number]) => { drawImage: (img: unknown, opts: Record<string, unknown>) => void }; embedJpg: (bytes: Uint8Array) => Promise<unknown> });

        // Draw watermark on the last added page
        if (watermark.enabled && watermark.text) {
          const outPages = outPdf.getPages();
          const lastPage = outPages[outPages.length - 1];
          const { width, height } = lastPage.getSize();
          const wmRgb = getWatermarkRgb(watermark.color);
          const fontSize = Math.min(width, height) / 10;
          lastPage.drawText(watermark.text, {
            x: width / 2 - (watermark.text.length * fontSize * 0.3),
            y: height / 2,
            size: fontSize,
            font: wmFont,
            color: rgb(wmRgb[0], wmRgb[1], wmRgb[2]),
            opacity: watermark.opacity / 100,
            rotate: degrees(45),
          });
        }

        setProgress(Math.round((i / pdf.numPages) * 100));
        // Yield to main thread to keep UI responsive
        await new Promise((r) => setTimeout(r, 0));
      }

      const pdfBytes = await outPdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);

      // Auto-download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatdock-scanned.pdf';
      a.click();

      toast.success('Scanned PDF generated', {
        description: 'Processed 100% locally — 0 KB uploaded to servers.',
      });

      // Cleanup pdf.js document
      await pdf.destroy();
    } catch (e) {
      toast.error('Processing failed', { description: 'The PDF may be encrypted or corrupted.' });
    } finally {
      setBusy(false);
    }
  }, [file, processPage, watermark]);

  const reset = useCallback(() => {
    setFile(null);
    setResultUrl(null);
    setPageCount(0);
    setProgress(0);
    setWatermark(DEFAULT_WATERMARK);
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
            <ScanLine className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Make it Look Scanned</h2>
            <p className="text-xs text-slate-400">Transform a clean PDF into a realistic scanned document</p>
          </div>
        </div>

        {!file ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            onClick={() => document.getElementById('scan-file-input')?.click()}
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
            <p className="mt-1.5 text-xs text-slate-400">We&apos;ll make it look like it came straight from a scanner</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <span className="rounded-md border border-[#252D3D] bg-[#151B2B] px-2 py-0.5 font-mono text-[10px] text-slate-400">PDF</span>
            </div>
            <input
              id="scan-file-input"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
            {/* Workspace preview */}
            <div className="min-w-0">
              <PDFWorkspace
                file={file}
                selectedPages={selectedPages}
                onTogglePage={() => {}}
                onRotatePage={() => {}}
                onDeletePage={() => {}}
                showWatermarkBar
                watermark={watermark}
                onWatermarkChange={setWatermark}
              />
            </div>

            {/* Effect control panel */}
            <div className="flex flex-col gap-5 rounded-xl border border-[#1e293b] bg-[#0B101E] p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles className="h-4 w-4 text-blue-400" />
                Scanner Effects
              </div>

              {/* Grayscale toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Grayscale / B&amp;W</p>
                  <p className="text-[11px] text-slate-500">Remove all color</p>
                </div>
                <button
                  onClick={() => setGrayscale((v) => !v)}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-colors duration-200',
                    grayscale ? 'bg-blue-500' : 'bg-slate-600'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200',
                      grayscale ? 'translate-x-[22px]' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>

              {/* Contrast slider */}
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-200">Contrast Booster</p>
                  <span className="rounded-md bg-blue-500/15 px-2 py-0.5 font-mono text-xs font-bold text-blue-400">
                    {contrast}%
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={150}
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="mt-2 w-full accent-blue-500"
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                  <span>100%</span>
                  <span>150%</span>
                </div>
              </div>

              {/* Grain & blur slider */}
              <div>
                <p className="text-sm font-medium text-slate-200">Scanner Grain &amp; Blur</p>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {(['low', 'medium', 'high'] as GrainLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setGrain(level)}
                      className={cn(
                        'rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition-all',
                        grain === level
                          ? 'border-blue-500 bg-blue-500/15 text-blue-400 shadow-[0_0_12px_-4px_rgba(37,99,235,0.5)]'
                          : 'border-[#252D3D] bg-[#020617] text-slate-400 hover:border-blue-500/40 hover:text-slate-200'
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tilt toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Imperfect Page Tilt</p>
                  <p className="text-[11px] text-slate-500">Random -0.6° to +0.6° rotation</p>
                </div>
                <button
                  onClick={() => setTilt((v) => !v)}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-colors duration-200',
                    tilt ? 'bg-blue-500' : 'bg-slate-600'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200',
                      tilt ? 'translate-x-[22px]' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-[#1e293b]" />

              {/* Progress bar */}
              {busy && (
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-400">Processing page {Math.ceil((progress / 100) * pageCount)} of {pageCount}</span>
                    <span className="font-mono text-blue-400">{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#1e293b]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={generate}
                  disabled={busy}
                  className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing locally in browser…
                    </>
                  ) : (
                    <>
                      <ScanLine className="h-4 w-4" /> Generate Scanned PDF
                    </>
                  )}
                </button>
                {resultUrl && (
                  <a href={resultUrl} download="formatdock-scanned.pdf">
                    <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 px-5 py-2.5 text-sm font-semibold text-green-400 transition-colors hover:bg-green-500/20">
                      <Download className="h-4 w-4" /> Download Again
                    </button>
                  </a>
                )}
                <button
                  onClick={reset}
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-[#2563EB]/50 hover:text-white disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" /> New File
                </button>
              </div>

              <p className="text-center text-[10px] text-slate-500">
                All processing happens in your browser. No data is ever uploaded.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type RenderPage = {
  getViewport: (opts: { scale: number; rotation: number }) => { width: number; height: number };
  render: (opts: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => Promise<void>;
};
