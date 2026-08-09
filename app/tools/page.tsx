import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import TrustBadgeBar from '@/components/trust-badge-bar';
import ToolCard from '@/components/tool-card';
import { tools, toolGroups } from '@/lib/tools';
import { Search } from 'lucide-react';

export const metadata = {
  title: 'All Tools — FormatDock',
  description:
    'Browse every free, browser-based tool on FormatDock — exam photo resizers, PDF & image converters, calculators, and focus timers. No uploads, no signup.',
  alternates: { canonical: 'https://formatdocks.vercel.app/tools' },
  openGraph: {
    title: 'All Tools — FormatDock',
    description:
      'Browse every free, browser-based tool on FormatDock — exam photo resizers, PDF & image converters, calculators, and focus timers.',
    url: 'https://formatdocks.vercel.app/tools',
    type: 'website',
    siteName: 'FormatDock',
  },
};

export default function ToolsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-dock">
      <SiteHeader />
      <TrustBadgeBar />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-muted/20">
          <div className="absolute left-1/2 top-0 -z-10 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-primary">
              <Search className="h-5 w-5" />
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                All Tools
              </h1>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Every utility on FormatDock, organized by category. Each tool runs
              entirely in your browser — nothing is uploaded, nothing is tracked.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {tools.length} free tools available. Use the search bar (Ctrl+K) to
              find one quickly.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
          {toolGroups.map((group) => {
            const groupTools = tools.filter((t) => t.group === group);
            return (
              <section key={group}>
                <div className="mb-5 flex items-baseline justify-between">
                  <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                    {group}
                  </h2>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {groupTools.length} tool{groupTools.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {groupTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
