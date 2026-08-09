'use client';

import { useCallback, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  iconClassName?: string;
};

export default function CopyButton({
  text,
  label,
  copiedLabel = 'Copied!',
  className,
  iconClassName,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border transition-all active:scale-95',
        copied
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
          : 'border-[#252D3D] bg-[#0B101E] text-slate-400 hover:text-white',
        className
      )}
      aria-label={copied ? copiedLabel : label ?? 'Copy to clipboard'}
    >
      {copied ? (
        <Check className={cn('h-3.5 w-3.5', iconClassName)} />
      ) : (
        <Copy className={cn('h-3.5 w-3.5', iconClassName)} />
      )}
      {(label || copied) && (
        <span className="text-xs font-medium">{copied ? copiedLabel : label}</span>
      )}
    </button>
  );
}
