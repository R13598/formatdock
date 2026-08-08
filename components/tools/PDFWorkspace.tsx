'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCw, Trash2, Loader2, ChevronLeft, ChevronRight, Droplet, ChevronDown, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PdfPageData = {
  id: string;
  fileIndex: number;
  pageNumber: number;
  rotation: number;
  thumbnail: string | null;
};

export type WatermarkConfig = {
  enabled: boolean;
  text: string;
  opacity: number;
  color: 'white' | 'black' | 'red';
};

export const DEFAULT_WATERMARK: WatermarkConfig = {
  enabled: false,
  text: 'CONFIDENTIAL',
  opacity: 30,
  color: 'red',
};

export type PDFWorkspaceProps = {
  file?: File;
  files?: File[];
  selectedPages: Set<number>;
  onTogglePage: (pageNumber: number) => void;
  onRotatePage: (pageNumber: number) => void;
  onDeletePage: (pageNumber: number) => void;
  onReorderPages?: (fromId: string, toId: string) => void;
  watermark?: WatermarkConfig;
  onWatermarkChange?: (config: WatermarkConfig) => void;
  showWatermarkBar?: boolean;
  enableDragReorder?: boolean;
  className?: string;
};

const THUMBNAIL_SCALE = 0.4;
const PAGES_PER_BATCH = 6;
const MAX_VISIBLE_PAGES = 20;

const WATERMARK_COLOR_MAP: Record<WatermarkConfig['color'], { hex: string; rgb: [number, number, number] }> = {
  white: { hex: '#ffffff', rgb: [1, 1, 1] },
  black: { hex: '#000000', rgb: [0, 0, 0] },
  red: { hex: '#dc2626', rgb: [0.85, 0.15, 0.15] },
};

export function getWatermarkRgb(color: WatermarkConfig['color']): [number, number, number] {
  return WATERMARK_COLOR_MAP[color].rgb;
}

export default function PDFWorkspace({
  file,
  files,
  selectedPages,
  onTogglePage,
  onRotatePage,
  onDeletePage,
  onReorderPages,
  watermark = DEFAULT_WATERMARK,
  onWatermarkChange,
  showWatermarkBar = false,
  enableDragReorder = false,
  className,
}: PDFWorkspaceProps) {
  const [pages, setPages] = useState<PdfPageData[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [renderedUpTo, setRenderedUpTo] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: MAX_VISIBLE_PAGES });
  const [watermarkOpen, setWatermarkOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const pdfDocsRef = useRef<unknown[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const allFiles = files ?? (file ? [file] : []);

  useEffect(() => {
    let cancelled = false;

    async function loadPdfs() {
      setLoading(true);
      setPages([]);
      setRenderedUpTo(0);
      pdfDocsRef.current = [];

      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

        const allPages: PdfPageData[] = [];
        for (let fi = 0; fi < allFiles.length; fi++) {
          const f = allFiles[fi];
          const arrayBuffer = await f.arrayBuffer();
          const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          if (cancelled) return;
          pdfDocsRef.current.push(pdf);

          for (let p = 1; p <= pdf.numPages; p++) {
            allPages.push({
              id: `f${fi}-p${p}`,
              fileIndex: fi,
              pageNumber: p,
              rotation: 0,
              thumbnail: null,
            });
          }
        }

        if (cancelled) return;
        setPages(allPages);
        setPageCount(allPages.length);
      } catch {
        if (!cancelled) setLoading(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (allFiles.length > 0) loadPdfs();

    return () => {
      cancelled = true;
      pdfDocsRef.current.forEach((pdf) => {
        if (pdf && typeof (pdf as { destroy?: () => void }).destroy === 'function') {
          (pdf as { destroy: () => void }).destroy();
        }
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, files?.length]);

  const renderBatch = useCallback(
    async (startIndex: number) => {
      const docs = pdfDocsRef.current as Array<{ getPage: (n: number) => Promise<unknown> } | null>;
      if (docs.length === 0) return;

      const endIndex = Math.min(startIndex + PAGES_PER_BATCH, pageCount);

      for (let i = startIndex; i < endIndex; i++) {
        const pageData = pages[i];
        if (!pageData) continue;
        const doc = docs[pageData.fileIndex];
        if (!doc) continue;

        try {
          const page = (await doc.getPage(pageData.pageNumber)) as {
            getViewport: (opts: { scale: number; rotation: number }) => { width: number; height: number };
            render: (opts: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => Promise<void>;
          };
          const viewport = page.getViewport({ scale: THUMBNAIL_SCALE, rotation: 0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) continue;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport });
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);

          setPages((prev) =>
            prev.map((p) => (p.id === pageData.id ? { ...p, thumbnail: dataUrl } : p))
          );
        } catch {
          // skip failed page
        }
      }
      setRenderedUpTo(endIndex);
    },
    [pageCount, pages]
  );

  useEffect(() => {
    if (!loading && renderedUpTo < Math.min(MAX_VISIBLE_PAGES, pageCount)) {
      renderBatch(renderedUpTo);
    }
  }, [loading, renderedUpTo, pageCount, renderBatch]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const sentinel = container.querySelector('[data-load-more]');
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && renderedUpTo < pageCount) {
          renderBatch(renderedUpTo);
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [renderedUpTo, pageCount, renderBatch]);

  const visiblePages = pages.slice(visibleRange.start, visibleRange.end);
  const totalPages = pageCount;
  const currentStart = visibleRange.start + 1;
  const currentEnd = Math.min(visibleRange.end, totalPages);

  const handleDragStart = (id: string) => {
    if (!enableDragReorder) return;
    setDraggedId(id);
  };
  const handleDragOver = (e: React.DragEvent, id: string) => {
    if (!enableDragReorder || !draggedId) return;
    e.preventDefault();
    setDragOverId(id);
  };
  const handleDrop = (e: React.DragEvent, id: string) => {
    if (!enableDragReorder || !draggedId || !onReorderPages) return;
    e.preventDefault();
    e.stopPropagation();
    onReorderPages(draggedId, id);
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className={cn('rounded-2xl border border-[#1e293b] bg-[#0f172a] p-4 sm:p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
            <FileTextIcon />
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {allFiles.length === 1 ? allFiles[0].name : `${allFiles.length} files loaded`}
            </p>
            <p className="text-xs text-slate-400">
              {totalPages} pages · {selectedPages.size} selected
            </p>
          </div>
        </div>
        {totalPages > MAX_VISIBLE_PAGES && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={() => setVisibleRange((p) => ({ start: Math.max(0, p.start - MAX_VISIBLE_PAGES), end: Math.max(MAX_VISIBLE_PAGES, p.end - MAX_VISIBLE_PAGES) }))}
              disabled={visibleRange.start === 0}
              className="rounded-lg border border-[#252D3D] bg-[#0B101E] p-1.5 transition-colors hover:border-blue-500/50 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono">{currentStart}–{currentEnd} / {totalPages}</span>
            <button
              onClick={() => setVisibleRange((p) => ({ start: p.start + MAX_VISIBLE_PAGES, end: Math.min(totalPages, p.end + MAX_VISIBLE_PAGES) }))}
              disabled={visibleRange.end >= totalPages}
              className="rounded-lg border border-[#252D3D] bg-[#0B101E] p-1.5 transition-colors hover:border-blue-500/50 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Watermark control bar */}
      {showWatermarkBar && onWatermarkChange && (
        <div className="mb-4 rounded-xl border border-[#1e293b] bg-[#0B101E]">
          <button
            onClick={() => setWatermarkOpen((v) => !v)}
            className="flex w-full items-center justify-between p-3.5 text-left"
          >
            <div className="flex items-center gap-2">
              <Droplet className={cn('h-4 w-4', watermark.enabled ? 'text-blue-400' : 'text-slate-500')} />
              <span className="text-sm font-medium text-slate-200">Document Overlay &amp; Watermark</span>
              {watermark.enabled && (
                <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-400">ON</span>
              )}
            </div>
            <ChevronDown className={cn('h-4 w-4 text-slate-500 transition-transform', watermarkOpen && 'rotate-180')} />
          </button>
          {watermarkOpen && (
            <div className="border-t border-[#1e293b] p-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Enable toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onWatermarkChange({ ...watermark, enabled: !watermark.enabled })}
                    className={cn('relative h-6 w-11 rounded-full transition-colors', watermark.enabled ? 'bg-blue-500' : 'bg-slate-600')}
                  >
                    <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform', watermark.enabled ? 'translate-x-[22px]' : 'translate-x-0.5')} />
                  </button>
                  <span className="text-xs text-slate-400">Enable watermark</span>
                </div>

                {watermark.enabled && (
                  <>
                    {/* Text input */}
                    <div className="flex-1 min-w-[140px]">
                      <input
                        type="text"
                        value={watermark.text}
                        onChange={(e) => onWatermarkChange({ ...watermark, text: e.target.value })}
                        placeholder="Watermark text"
                        maxLength={40}
                        className="w-full rounded-lg border border-[#252D3D] bg-[#020617] px-3 py-1.5 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Color picker */}
                    <div className="flex items-center gap-1.5">
                      {(['white', 'black', 'red'] as const).map((c) => (
                        <button
                          key={c}
                          onClick={() => onWatermarkChange({ ...watermark, color: c })}
                          className={cn(
                            'h-7 w-7 rounded-full border-2 transition-all',
                            watermark.color === c ? 'border-blue-500 scale-110' : 'border-[#252D3D] hover:border-slate-500'
                          )}
                          style={{ backgroundColor: WATERMARK_COLOR_MAP[c].hex }}
                          aria-label={`${c} watermark color`}
                        />
                      ))}
                    </div>

                    {/* Opacity slider */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Opacity</span>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={watermark.opacity}
                        onChange={(e) => onWatermarkChange({ ...watermark, opacity: Number(e.target.value) })}
                        className="w-24 accent-blue-500"
                      />
                      <span className="font-mono text-xs text-blue-400">{watermark.opacity}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <p className="text-sm text-slate-400">Loading PDF…</p>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visiblePages.map((page) => {
            const isSelected = selectedPages.has(page.pageNumber);
            return (
              <div
                key={page.id}
                draggable={enableDragReorder}
                onDragStart={() => handleDragStart(page.id)}
                onDragOver={(e) => handleDragOver(e, page.id)}
                onDrop={(e) => handleDrop(e, page.id)}
                onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                onClick={() => onTogglePage(page.pageNumber)}
                className={cn(
                  'group relative cursor-pointer overflow-hidden rounded-lg border-2 bg-[#0B101E] transition-all duration-200',
                  isSelected
                    ? 'border-blue-500 shadow-[0_0_20px_-4px_rgba(37,99,235,0.6)]'
                    : 'border-[#252D3D] hover:border-blue-500/40',
                  enableDragReorder && 'cursor-grab active:cursor-grabbing',
                  dragOverId === page.id && draggedId !== page.id && 'border-blue-400 ring-2 ring-blue-400/50 scale-[1.03]'
                )}
              >
                {/* Drag handle */}
                {enableDragReorder && (
                  <div className="absolute left-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded bg-black/60 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical className="h-3 w-3" />
                  </div>
                )}

                {/* Page number badge */}
                <div className="absolute left-1.5 top-1.5 z-10 flex h-5 min-w-5 items-center justify-center rounded bg-black/60 px-1 text-[10px] font-bold text-white">
                  {page.pageNumber}
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.8)]">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                {/* Thumbnail */}
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden">
                  {page.thumbnail ? (
                    <img
                      src={page.thumbnail}
                      alt={`Page ${page.pageNumber}`}
                      className="h-full w-full object-contain"
                      style={{ transform: `rotate(${page.rotation}deg)` }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-800">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Hover overlay with controls */}
                <div className="absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-black/80 via-transparent to-transparent pb-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); onRotatePage(page.pageNumber); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-600 bg-slate-800/90 text-slate-200 transition-all hover:border-blue-500 hover:text-blue-400 active:scale-90"
                    aria-label="Rotate 90 degrees"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeletePage(page.pageNumber); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-600 bg-slate-800/90 text-slate-200 transition-all hover:border-red-500 hover:text-red-400 active:scale-90"
                    aria-label="Delete page"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {renderedUpTo < pageCount && (
            <div data-load-more className="col-span-full flex h-16 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FileTextIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
