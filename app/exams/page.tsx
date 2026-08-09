import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import TrustBadgeBar from '@/components/trust-badge-bar';
import ToolCard from '@/components/tool-card';
import { tools } from '@/lib/tools';
import { GraduationCap, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Indian Exam Photo & Signature Resizer Hub — FormatDock',
  description:
    'Resize and compress passport photos and scanned signatures to official specifications for UPSC, SSC, CTET, IBPS, and Railway exams. 100% private, client-side execution.',
};

export default function ExamToolsPage() {
  const examTools = tools.filter((t) => t.group === 'Exam Photo Tools');

  return (
    <div className="flex min-h-screen flex-col bg-background/80 text-foreground">
      <SiteHeader />
      <TrustBadgeBar />

      <main className="flex-1">
        {/* Glassmorphic Domain Hero Header */}
        <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-background via-card/20 to-background py-12 lg:py-16">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[250px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
                <ShieldCheck className="h-4 w-4" /> Official 2026 Recruitment Portal Specs
              </div>

              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
                Exam Photo & Signature{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                  Resizer Hub
                </span>
              </h1>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Automatically crop, resize, and compress passport photos and scanned signatures to meet strict dimensional and KB thresholds required by UPSC, SSC, CTET, Bank, and Railway recruitment portals.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground pt-4 border-t border-border/40">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Guaranteed Portal Acceptance
                </span>
                <span className="flex items-center gap-1.5">
                  🔒 100% Client-Side Private
                </span>
                <span className="flex items-center gap-1.5">
                  ⚡ Instant Browser Encoding
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Exam Tools Grid */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-foreground">Available Exam Presets</h2>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {examTools.length} Official Presets Loaded
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {examTools.map((tool) => (
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