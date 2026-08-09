import { ShieldCheck, Zap } from 'lucide-react';

export default function TrustBadgeBar() {
  return (
    <div className="border-b border-border bg-muted/20 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          100% Client-Side Processing — Your files never leave your browser.
        </span>
        <span className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-300">
          <Zap className="h-4 w-4 shrink-0" />
          Hardware-Accelerated — Instant browser-side execution.
        </span>
      </div>
    </div>
  );
}
