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
          const bytes = await f.arrayBuffer();
          const doc = await pdfjs.getDocument({ data: bytes }).promise;
          if (cancelled) return;
          pdfDocsRef.current.push(doc);

          for (let p = 1; p <= doc.numPages; p++) {
            allPages.push({
              id: `p-${fi}-${p}`,
              fileIndex: fi,
              pageNumber: allPages.length + 1,
              rotation: 0,
              thumbnail: null,
            });
          }
        }

        if (!cancelled) {
          setPages(allPages);
          setPageCount(allPages.length);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    if (allFiles.length > 0) {
      loadPdfs();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [allFiles.length]);

  const renderBatch = useCallback(async (startIdx: number) => {
    if (pdfDocsRef.current.length === 0) return;
    const pdfjs = await import('pdfjs-dist');
    const endIdx = Math.min(startIdx + PAGES_PER_BATCH, pages.length);

    setPages((prevPages) => {
      const updated = [...prevPages];
      for (let i = startIdx; i < endIdx; i++) {
        const p = updated[i];
        if (!p || p.thumbnail) continue;

        const doc = pdfDocsRef.current[p.fileIndex] as any;
        if (!doc) continue;

        doc.getPage(p.pageNumber).then((pdfPage: any) => {
          const viewport = pdfPage.getViewport({ scale: THUMBNAIL_SCALE });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          pdfPage.render({ canvasContext: ctx, viewport }).promise.then(() => {
            const thumb = canvas.toDataURL('image/png');
            setPages((latest) =>
              latest.map((item, idx) => (idx === i ? { ...item, thumbnail: thumb } : item))
            );
          });
        });
      }
      return updated;
    });

    setRenderedUpTo(endIdx);
  }, [pages.length]);

  useEffect(() => {
    if (!loading && pageCount > 0 && renderedUpTo < pageCount) {
      renderBatch(renderedUpTo);
    }
  }, [loading, pageCount, renderedUpTo, renderBatch]);

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
    <div className={cn('rounded-2xl border border-border bg-card p-4 sm:p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <FileTextIcon />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {allFiles.length === 1 ? allFiles[0].name : `${allFiles.length} files loaded`}
            </p>
            <p className="text-xs text-muted-foreground">
              {totalPages} pages · {selectedPages.size} selected
            </p>
          </div>
        </div>
        {totalPages > MAX_VISIBLE_PAGES && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <button
              onClick={() => setVisibleRange((p) => ({ start: Math.max(0, p.start - MAX_VISIBLE_PAGES), end: Math.max(MAX_VISIBLE_PAGES, p.end - MAX_VISIBLE_PAGES) }))}
              disabled={visibleRange.start === 0}
              className="rounded-lg border border-border bg-muted/40 p-1.5 transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono">{currentStart}–{currentEnd} / {totalPages}</span>
            <button
              onClick={() => setVisibleRange((p) => ({ start: p.start + MAX_VISIBLE_PAGES, end: Math.min(totalPages, p.end + MAX_VISIBLE_PAGES) }))}
              disabled={visibleRange.end >= totalPages}
              className="rounded-lg border border-border bg-muted/40 p-1.5 transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Watermark control bar */}
      {showWatermarkBar && onWatermarkChange && (
        <div className="mb-4 rounded-xl border border-border bg-muted/30">
          <button
            onClick={() => setWatermarkOpen((v) => !v)}
            className="flex w-full items-center justify-between p-3.5 text-left"
          >
            <div className="flex items-center gap-2">
              <Droplet className={cn('h-4 w-4', watermark.enabled ? 'text-primary' : 'text-muted-foreground')} />
              <span className="text-sm font-medium text-foreground">Document Overlay &amp; Watermark</span>
              {watermark.enabled && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">ON</span>
              )}
            </div>
            <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', watermarkOpen && 'rotate-180')} />
          </button>
          {watermarkOpen && (
            <div className="border-t border-border p-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Enable toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onWatermarkChange({ ...watermark, enabled: !watermark.enabled })}
                    className={cn('relative h-6 w-11 rounded-full transition-colors', watermark.enabled ? 'bg-primary' : 'bg-muted-foreground/30')}
                  >
                    <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow', watermark.enabled ? 'translate-x-[22px]' : 'translate-x-0.5')} />
                  </button>
                  <span className="text-xs text-muted-foreground">Enable watermark</span>
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
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
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
                            watermark.color === c ? 'border-primary scale-110' : 'border-border hover:border-muted-foreground'
                          )}
                          style={{ backgroundColor: WATERMARK_COLOR_MAP[c].hex }}
                          aria-label={`${c} watermark color`}
                        />
                      ))}
                    </div>

                    {/* Opacity slider */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Opacity</span>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={watermark.opacity}
                        onChange={(e) => onWatermarkChange({ ...watermark, opacity: Number(e.target.value) })}
                        className="w-24 accent-primary"
                      />
                      <span className="font-mono text-xs text-primary">{watermark.opacity}%</span>
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
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading PDF…</p>
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
                  'group relative cursor-pointer overflow-hidden rounded-lg border-2 bg-muted/20 transition-all duration-200',
                  isSelected
                    ? 'border-primary shadow-[0_0_20px_-4px_rgba(37,99,235,0.6)]'
                    : 'border-border hover:border-primary/40',
                  enableDragReorder && 'cursor-grab active:cursor-grabbing',
                  dragOverId === page.id && draggedId !== page.id && 'border-primary ring-2 ring-primary/50 scale-[1.03]'
                )}
              >
                {/* Drag handle */}
                {enableDragReorder && (
                  <div className="absolute left-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical className="h-3 w-3" />
                  </div>
                )}

                {/* Page number badge */}
                <div className="absolute left-1.5 top-1.5 z-10 flex h-5 min-w-5 items-center justify-center rounded bg-black/60 px-1 text-[10px] font-bold text-white">
                  {page.pageNumber}
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_10px_rgba(37,99,235,0.8)]">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                {/* Thumbnail */}
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-background">
                  {page.thumbnail ? (
                    <img
                      src={page.thumbnail}
                      alt={`Page ${page.pageNumber}`}
                      className="h-full w-full object-contain"
                      style={{ transform: `rotate(${page.rotation}deg)` }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Hover overlay with controls */}
                <div className="absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-black/80 via-transparent to-transparent pb-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); onRotatePage(page.pageNumber); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-black/70 text-white transition-all hover:border-primary hover:text-primary active:scale-90"
                    aria-label="Rotate 90 degrees"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeletePage(page.pageNumber); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-black/70 text-white transition-all hover:border-red-500 hover:text-red-400 active:scale-90"
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
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
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
