'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, FileArchive, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import FileValidationAlert from '@/components/ui/file-validation-alert';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function fileIcon(type: string) {
  if (type.startsWith('image/')) return ImageIcon;
  if (type === 'application/pdf') return FileArchive;
  return FileText;
}

const LARGE_FILE_THRESHOLD = 100 * 1024 * 1024;

export type DropzoneProps = {
  accept: string;
  acceptLabel: string;
  onFile: (file: File) => void;
  file: File | null;
  onClear: () => void;
  minH?: string;
  className?: string;
  disabled?: boolean;
};

function matchesAccept(file: File, accept: string): boolean {
  if (!accept || accept === '*/*' || accept === '*') return true;
  const patterns = accept.split(',').map((p) => p.trim().toLowerCase());
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  for (const pattern of patterns) {
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -1);
      if (fileType.startsWith(prefix)) return true;
    } else if (pattern.startsWith('.')) {
      if (fileName.endsWith(pattern)) return true;
    } else if (fileType === pattern) {
      return true;
    }
  }
  return false;
}

export default function FileDropzone({
  accept,
  acceptLabel,
  onFile,
  file,
  onClear,
  minH = 'min-h-[200px]',
  className,
  disabled = false,
}: DropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAccept = useCallback(
    (f: File) => {
      if (disabled) return;
      if (!matchesAccept(f, accept)) {
        const expected = acceptLabel || accept;
        setValidationError(`Invalid file format. Please upload a valid ${expected} file.`);
        return;
      }
      setValidationError(null);
      onFile(f);
    },
    [onFile, disabled, accept, acceptLabel]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) validateAndAccept(f);
    },
    [validateAndAccept]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) validateAndAccept(f);
      e.target.value = '';
    },
    [validateAndAccept]
  );

  if (file) {
    const Icon = fileIcon(file.type);
    const isLarge = file.size >= LARGE_FILE_THRESHOLD;
    return (
      <div
        className={cn(
          'rounded-xl border border-[#252D3D] bg-[#151B2B] p-4 transition-all',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{file.name}</p>
            <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
          </div>
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 sm:inline-flex">
            <CheckCircle2 className="h-3 w-3" /> Ready for local processing
          </span>
          <button
            onClick={onClear}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#252D3D] bg-[#0B101E] text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-400"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 sm:hidden">
          <CheckCircle2 className="h-3 w-3" /> Ready for local processing
        </span>
        {isLarge && (
          <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-blue-500/20 bg-blue-500/5 px-3.5 py-2.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
            <p className="text-xs leading-relaxed text-slate-300">
              Large file detected: Processing happens locally in browser memory and may take a few seconds.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {validationError && (
        <div className="mb-3">
          <FileValidationAlert message={validationError} />
        </div>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300',
          minH,
          disabled && 'cursor-not-allowed opacity-50',
          dragOver
            ? 'scale-[1.01] border-blue-500 bg-blue-500/10 shadow-[0_0_24px_-4px_rgba(37,99,235,0.4)]'
            : 'border-[#252D3D] bg-[#0B101E] hover:border-blue-500/50 hover:bg-blue-500/5',
          className
        )}
      >
        <div
          className={cn(
            'mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300',
            dragOver
              ? 'scale-110 bg-blue-500/20 text-blue-400'
              : 'bg-blue-500/10 text-blue-400'
          )}
        >
          <Upload className={cn('h-7 w-7 transition-transform', dragOver && 'scale-110')} />
        </div>
        <p className="text-sm font-semibold text-white">
          {dragOver ? 'Release to drop file' : 'Drag & drop your file here or click to browse'}
        </p>
        <p className="mt-1.5 text-xs text-slate-400">{acceptLabel}</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {acceptLabel.split(/[,/]/).map((fmt) => {
            const f = fmt.trim();
            if (!f) return null;
            return (
              <span
                key={f}
                className="rounded-md border border-[#252D3D] bg-[#151B2B] px-2 py-0.5 font-mono text-[10px] text-slate-400"
              >
                {f}
              </span>
            );
          })}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
