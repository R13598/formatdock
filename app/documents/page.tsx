import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import TrustBadgeBar from '@/components/trust-badge-bar';
import ToolCard from '@/components/tool-card';
import { getToolsByGroup } from '@/lib/tools';

export const metadata = {
  title: 'PDF & Image Conversion Hub — FormatDock',
  description:
    'Free PDF and document tools — image to PDF, JPG to PNG, format converters. 100% client-side, no uploads.',
};

export default function DocumentsHubPage() {
  const docs = getToolsByGroup('Document Utilities');

  return (
    <div className="flex min-h-screen flex-col bg-dock">
      <SiteHeader />
      <TrustBadgeBar />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[#1e293b] bg-gradient-to-b from-[#0f172a] to-[#020617]">
          <div className="absolute left-1/2 top-0 -z-10 h-[250px] w-[450px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              PDF &amp; Image Conversion Suite
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
              Convert and format documents without uploading them anywhere. All
              processing happens locally in your browser.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-white">Document Tools</h2>
            <p className="mt-1 text-sm text-slate-400">
              Convert and format documents without uploading them anywhere.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
