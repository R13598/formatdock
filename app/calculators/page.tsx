import type { Metadata } from 'next';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import TrustBadgeBar from '@/components/trust-badge-bar';
import ToolCard from '@/components/tool-card';
import { tools } from '@/lib/tools';
import { Calculator, CheckCircle2, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Everyday Calculators & Finance Utilities — FormatDock',
  description:
    'Free client-side calculators for exam age eligibility, mark percentages, CGPA to percentage, GST splits, EMI, and unit conversion.',
};

export default function CalculatorsPage() {
  const calcTools = tools.filter((t) => t.group === 'Calculators');

  return (
    <div className="flex min-h-screen flex-col bg-background/80 text-foreground">
      <SiteHeader />
      <TrustBadgeBar />

      <main className="flex-1">
        {/* Glassmorphic Domain Hero Header */}
        <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-background via-card/20 to-background py-12 lg:py-16">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[250px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4">
                <ShieldCheck className="h-4 w-4" /> Instant Client-Side Computation
              </div>

              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
                Everyday Calculators &{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400 bg-clip-text text-transparent">
                  Finance Utilities
                </span>
              </h1>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Check exam age eligibility limits, convert CGPA using university formulas, calculate exam mark percentages, and run financial EMI estimations — completely private and offline.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground pt-4 border-t border-border/40">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 100% Offline Precision Math
                </span>
                <span className="flex items-center gap-1.5">
                  🔒 Zero Financial Data Saved
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Calculators Grid */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-foreground">Available Calculators</h2>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {calcTools.length} Utilities Available
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {calcTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}