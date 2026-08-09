'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FileValidationAlertProps = {
  message: string;
  className?: string;
};

export default function FileValidationAlert({ message, className }: FileValidationAlertProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5',
        className
      )}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
      <p className="flex-1 text-sm leading-relaxed text-amber-200">{message}</p>
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 rounded-md p-0.5 text-amber-400/70 transition-colors hover:text-amber-300"
        aria-label="Dismiss alert"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
