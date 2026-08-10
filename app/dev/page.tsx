import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import TrustBadgeBar from '@/components/trust-badge-bar';
import ToolCard from '@/components/tool-card';
import { tools } from '@/lib/tools';
import { Wrench, Terminal, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Image & Dev Utilities — FormatDock',
  description:
    'Free developer and image processing utilities — SVG optimizer, cryptographic hash generator, JSON formatter, WebP converter, QR generator, Base64 encoder, and image converters. 100% private, client-side execution.',
  alternates: { canonical: 'https://formatdocks.vercel.app/dev' },
};

export default function DevUtilitiesPage() {
  const devTools = tools.filter(
    (t) => t.group === 'Image & Dev Utilities' || t.category === 'dev'
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <TrustBadgeBar />

      <main className="flex-1">
        {/* Glassmorphic Header */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-card/20 to-background py-12 lg:py-16">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[250px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-4">
                <Terminal className="h-4 w-4" /> Developer &amp; Image Toolbox
              </div>

              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
                Image &amp; Dev{' '}
                <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 dark:from-cyan-400 dark:via-teal-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Utilities Suite
                </span>
              </h1>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Essential developer tools and image converters for modern workflows. Optimize SVGs, format &amp; validate JSON, generate SHA-256 hashes, encode Base64, and convert WebP images — processed 100% locally.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground pt-4 border-t border-border/40">
                <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Zero Server Uploads
                </span>
                <span className="flex items-center gap-1.5">
                  🔒 100% Local Browser Execution
                </span>
                <span className="flex items-center gap-1.5">
                  ⚡ WebAssembly &amp; Canvas Accelerated
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Image &amp; Developer Tools</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a developer utility to launch.
              </p>
            </div>
            <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              {devTools.length} Tools
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {devTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
