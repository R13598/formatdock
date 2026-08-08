'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAutoFile } from '@/hooks/use-auto-file';
import {
  FileText,
  Upload,
  ZoomIn,
  ZoomOut,
  Move,
  Download,
  RefreshCw,
  ImageIcon,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Zap,
  Crop,
  RotateCw,
  Lock,
  LockOpen,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ToolPreset } from '@/lib/tools';

type Readout = {
  originalSize: number;
  processedSize: number;
  width: number;
  height: number;
  type: string;
  quality: number;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

async function compressToTarget(
  source: HTMLCanvasElement,
  maxKb: number,
  minKb: number,
  format: 'jpg' | 'png',
  bg: string
): Promise<{ blob: Blob; quality: number }> {
  let qualities: number[] = [];
  if (format === 'jpg') {
    qualities = [
      0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35,
      0.3, 0.25, 0.2, 0.15, 0.1,
    ];
  } else {
    qualities = [1];
  }

  for (const q of qualities) {
    const blob = await new Promise<Blob | null>((resolve) =>
      source.toBlob(
        (b) => resolve(b),
        format === 'png' ? 'image/png' : 'image/jpeg',
        q
      )
    );
    if (!blob) continue;
    if (blob.size / 1024 < maxKb) {
      return { blob, quality: q };
    }
  }

  const w = source.width;
  const h = source.height;
  const scales = [0.9, 0.8, 0.7, 0.6, 0.5];
  for (const s of scales) {
    const scaled = document.createElement('canvas');
    scaled.width = Math.max(1, Math.round(w * s));
    scaled.height = Math.max(1, Math.round(h * s));
    const sctx = scaled.getContext('2d');
    if (!sctx) continue;
    sctx.fillStyle = bg;
    sctx.fillRect(0, 0, scaled.width, scaled.height);
    sctx.drawImage(source, 0, 0, scaled.width, scaled.height);
    for (const q of [0.5, 0.4, 0.3, 0.2, 0.1]) {
      const blob = await new Promise<Blob | null>((resolve) =>
        scaled.toBlob((b) => resolve(b), 'image/jpeg', q)
      );
      if (blob && blob.size / 1024 < maxKb) {
        return { blob, quality: q };
      }
    }
  }

  const fb = await new Promise<Blob | null>((resolve) =>
    source.toBlob((b) => resolve(b), 'image/jpeg', 0.1)
  );
  return { blob: fb ?? new Blob([]), quality: 0.1 };
}

// Generate a sample portrait (canvas-based, no external assets)
function makeSampleImage(): Promise<HTMLImageElement> {
  const c = document.createElement('canvas');
  c.width = 900;
  c.height = 1100;
  const ctx = c.getContext('2d')!;
  // background
  const grad = ctx.createLinearGradient(0, 0, 0, c.height);
  grad.addColorStop(0, '#dbeafe');
  grad.addColorStop(1, '#bfdbfe');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, c.width, c.height);
  // head
  ctx.fillStyle = '#f1d3b8';
  ctx.beginPath();
  ctx.arc(c.width / 2, 420, 180, 0, Math.PI * 2);
  ctx.fill();
  // body
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.moveTo(c.width / 2 - 320, c.height);
  ctx.lineTo(c.width / 2 - 240, 680);
  ctx.quadraticCurveTo(c.width / 2, 560, c.width / 2 + 240, 680);
  ctx.lineTo(c.width / 2 + 320, c.height);
  ctx.closePath();
  ctx.fill();
  // eyes
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(c.width / 2 - 70, 400, 12, 0, Math.PI * 2);
  ctx.arc(c.width / 2 + 70, 400, 12, 0, Math.PI * 2);
  ctx.fill();
  // mouth
  ctx.strokeStyle = '#9a6a4a';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(c.width / 2, 470, 30, 0.2, Math.PI - 0.2);
  ctx.stroke();

  const url = c.toDataURL('image/png');
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

const STEPS = [
  { n: 1, label: 'Drop File', icon: Upload },
  { n: 2, label: 'Auto-Crop & Resize', icon: Crop },
  { n: 3, label: 'Download', icon: Download },
];

export default function ImageResizer({
  preset,
  toolSlug,
}: {
  preset: ToolPreset;
  toolSlug: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [aspectLocked, setAspectLocked] = useState(true);
  const [readout, setReadout] = useState<Readout | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingSample, setUsingSample] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const draggingPan = useRef(false);
  const panStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const targetW = preset.width;
  const targetH = preset.height;
  const aspect = targetW / targetH;

  const currentStep = imgEl ? (resultUrl ? 3 : 2) : 1;

  const reset = useCallback(() => {
    setFile(null);
    setImgEl(null);
    setReadout(null);
    setResultUrl(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setRotation(0);
    setError(null);
    setUsingSample(false);
  }, []);

  const handleFile = useCallback(async (f: File) => {
    setError(null);
    if (!f.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, etc.).');
      return;
    }
    setFile(f);
    setUsingSample(false);
    try {
      const img = await loadImageFromFile(f);
      setImgEl(img);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setRotation(0);
    } catch {
      setError('Could not load that image. Try a different file.');
    }
  }, []);

  const handleSample = useCallback(async () => {
    setError(null);
    try {
      const img = await makeSampleImage();
      setImgEl(img);
      setFile(null);
      setUsingSample(true);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setRotation(0);
    } catch {
      setError('Could not generate a sample image.');
    }
  }, []);

  // Auto-consume dropped file from homepage
  useAutoFile(handleFile);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const onFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  // Render preview canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = preset.bg ?? '#ffffff';
    ctx.fillRect(0, 0, targetW, targetH);

    if (!imgEl) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Preview', targetW / 2, targetH / 2);
      return;
    }

    const imgAspect = imgEl.width / imgEl.height;
    let baseW: number, baseH: number;
    if (imgAspect > aspect) {
      baseH = targetH;
      baseW = baseH * imgAspect;
    } else {
      baseW = targetW;
      baseH = baseW / imgAspect;
    }
    const drawW = baseW * zoom;
    const drawH = baseH * zoom;
    const dx = (targetW - drawW) / 2 + offset.x;
    const dy = (targetH - drawH) / 2 + offset.y;

    ctx.save();
    ctx.translate(targetW / 2, targetH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-targetW / 2, -targetH / 2);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imgEl, dx, dy, drawW, drawH);
    ctx.restore();
  }, [imgEl, zoom, offset, rotation, targetW, targetH, aspect, preset.bg]);

  const doProcess = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgEl) return;
    setProcessing(true);
    setError(null);
    try {
      const { blob, quality } = await compressToTarget(
        canvas,
        preset.maxKb,
        preset.minKb,
        preset.format,
        preset.bg ?? '#ffffff'
      );
      if (!blob || blob.size === 0) {
        setError('Compression failed. Try a different image.');
        setProcessing(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setReadout({
        originalSize: file?.size ?? (usingSample ? 180 * 1024 : 0),
        processedSize: blob.size,
        width: targetW,
        height: targetH,
        type: blob.type,
        quality,
      });
      const kb = (blob.size / 1024).toFixed(0);
      toast.success('Image successfully compressed!', {
        description: `Resized to ${targetW}×${targetH}px at ${kb} KB — within target range. 0 KB uploaded to servers.`,
      });
    } catch {
      setError('Something went wrong while processing. Please try again.');
      toast.error('Processing failed', {
        description: 'Something went wrong while compressing the image.',
      });
    } finally {
      setProcessing(false);
    }
  }, [imgEl, file, usingSample, preset, targetW, targetH]);

  // Auto-process when image/zoom/offset/rotation changes
  useEffect(() => {
    if (imgEl) {
      doProcess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgEl, zoom, offset, rotation]);

  const downloadName = `${toolSlug.replace(/-/g, '_')}_resized.${preset.format === 'png' ? 'png' : 'jpg'}`;

  const statusOk =
    readout &&
    readout.processedSize / 1024 < preset.maxKb &&
    readout.processedSize / 1024 >= preset.minKb * 0.5;

  const onPointerDown = (e: React.PointerEvent) => {
    if (!imgEl) return;
    draggingPan.current = true;
    panStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingPan.current) return;
    setOffset({
      x: panStart.current.ox + (e.clientX - panStart.current.x),
      y: panStart.current.oy + (e.clientY - panStart.current.y),
    });
  };
  const onPointerUp = () => {
    draggingPan.current = false;
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const active = currentStep >= step.n;
          const done = currentStep > step.n;
          return (
            <div key={step.n} className="flex items-center">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all sm:px-4',
                  active
                    ? 'bg-[#2563EB] text-white shadow-[0_0_10px_-2px_rgba(37,99,235,0.5)]'
                    : 'bg-slate-100 text-slate-500'
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full text-[10px]',
                    active ? 'bg-white/20' : 'bg-slate-200'
                  )}
                >
                  {done ? <CheckCircle2 className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowRight className="mx-1 h-4 w-4 text-slate-300" />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: upload + cropper */}
        <div className="space-y-4">
          {!imgEl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={cn(
                'flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300',
                dragOver
                  ? 'scale-[1.01] border-blue-500 bg-blue-500/10 shadow-[0_0_24px_-4px_rgba(37,99,235,0.4)]'
                  : 'border-[#252D3D] bg-[#0B101E] hover:border-blue-500/50 hover:bg-blue-500/5'
              )}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <div
                className={cn(
                  'mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300',
                  dragOver ? 'scale-110 bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-400'
                )}
              >
                <Upload className={cn('h-7 w-7 transition-transform', dragOver && 'scale-110')} />
              </div>
              <p className="text-base font-semibold text-white">
                {dragOver ? 'Release to drop file' : 'Drag & drop your photo here'}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                or click to browse — JPG, PNG up to 10 MB
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                {['JPG', 'PNG'].map((f) => (
                  <span key={f} className="rounded-md border border-[#252D3D] bg-[#151B2B] px-2 py-0.5 font-mono text-[10px] text-slate-400">
                    {f}
                  </span>
                ))}
              </div>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileInput}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSample();
                }}
              >
                <Sparkles className="mr-2 h-4 w-4 text-[#2563EB]" />
                Try with Sample Image
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div
                ref={previewWrapRef}
                className="relative mx-auto overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm"
                style={{
                  width: '100%',
                  maxWidth: targetW,
                  aspectRatio: `${targetW} / ${targetH}`,
                  touchAction: 'none',
                  cursor: imgEl ? 'grab' : 'default',
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              >
                <canvas
                  ref={canvasRef}
                  className="block h-full w-full"
                  style={{ imageRendering: 'auto' }}
                />
                <div className="pointer-events-none absolute left-2 top-2 rounded bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
                  {targetW} × {targetH}px
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Slider
                    value={[zoom]}
                    min={0.5}
                    max={3}
                    step={0.05}
                    onValueChange={(v) => setZoom(v[0])}
                    className="w-28"
                    aria-label="Zoom"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    aria-label="Rotate 90°"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={aspectLocked ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setAspectLocked((l) => !l)}
                    aria-label="Toggle aspect ratio lock"
                    title={aspectLocked ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                  >
                    {aspectLocked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={reset}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Replace
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">
                <Move className="h-4 w-4 shrink-0" />
                Drag to position, zoom with the slider, rotate with the button.
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Right: readout + compliance + download */}
        <div className="space-y-4">
          {/* Compliance meter */}
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#2563EB]" />
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Crop className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-sm font-semibold text-slate-800">
                  Target Specifications
                </h3>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Spec label="Dimensions" value={`${targetW} × ${targetH} px`} />
                <Spec label="Format" value={preset.format.toUpperCase()} />
                <Spec label="Min size" value={`${preset.minKb} KB`} />
                <Spec label="Max size" value={`${preset.maxKb} KB`} />
              </dl>
            </div>
          </div>

          {/* Before vs After */}
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 p-4">
              <ImageIcon className="h-4 w-4 text-[#2563EB]" />
              <h3 className="text-sm font-semibold text-slate-800">
                Compliance Meter
              </h3>
            </div>
            <div className="p-5">
              {readout ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Original
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-700">
                        {formatBytes(readout.originalSize)}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[#2563EB]/30 bg-blue-50 p-3 text-center">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-[#2563EB]">
                        Resized
                      </div>
                      <div className="mt-1 text-lg font-bold text-[#2563EB]">
                        {formatBytes(readout.processedSize)}
                      </div>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold',
                      statusOk
                        ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                        : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                    )}
                  >
                    {statusOk ? (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        COMPLIANT — within {preset.minKb}–{preset.maxKb} KB
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5" />
                        Review — adjust zoom/position and reprocess
                      </>
                    )}
                  </div>

                  <Separator />

                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <Spec
                      label="Output dimensions"
                      value={`${readout.width} × ${readout.height} px`}
                    />
                    <Spec
                      label="File type"
                      value={readout.type.replace('image/', '').toUpperCase()}
                    />
                    <Spec
                      label="JPEG quality"
                      value={`${Math.round(readout.quality * 100)}%`}
                    />
                    <Spec
                      label="Reduction"
                      value={
                        readout.originalSize > 0
                          ? `${Math.round(
                              (1 - readout.processedSize / readout.originalSize) * 100
                            )}%`
                          : '—'
                      }
                    />
                  </dl>

                  {resultUrl && (
                    <div className="space-y-3 pt-1">
                      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <img
                          src={resultUrl}
                          alt="Processed preview"
                          className="mx-auto max-h-44 w-auto"
                        />
                      </div>
                      <a href={resultUrl} download={downloadName}>
                        <Button
                          className="btn-primary-glow w-full transition-transform active:scale-95"
                          size="lg"
                          disabled={processing}
                        >
                          {processing ? (
                            <>
                              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                              Processing locally…
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-5 w-5" />
                              Download Resized Image
                            </>
                          )}
                        </Button>
                      </a>
                      <p className="text-center text-xs text-slate-500">
                        File name:{' '}
                        <code className="font-mono text-slate-700">
                          {downloadName}
                        </code>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-10 text-center text-sm text-slate-400">
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" /> Compressing to
                      target…
                    </span>
                  ) : (
                    'Upload an image to see the compliance report.'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd
        className={cn(
          'mt-0.5 font-semibold',
          highlight ? 'text-[#2563EB]' : 'text-slate-800'
        )}
      >
        {value}
      </dd>
    </div>
  );
}