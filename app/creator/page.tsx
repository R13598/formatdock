import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import TrustBadgeBar from '@/components/trust-badge-bar';
import ToolCard from '@/components/tool-card';
import { tools } from '@/lib/tools';
import { Palette, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Creator Studio — FormatDock',
  description:
    'Free AI & content generation tools for creators, bloggers, and copywriters — AI title generator, content summarizer, meta description writer, fancy unicode fonts, and 3D text styling.',
  alternates: { canonical: 'https://formatdocks.vercel.app/creator' },
};

export default function CreatorStudioPage() {
  const creatorTools = tools.filter(
    (t) => t.group === 'Creator Studio' || t.category === 'creator'
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <TrustBadgeBar />

      <main className="flex-1">
        {/* Glassmorphic Header */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-card/20 to-background py-12 lg:py-16">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[250px] w-[500px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[120px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3.5 py-1 text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-400 mb-4">
                <Sparkles className="h-4 w-4" /> AI-Powered Creator Tools
              </div>

              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
                Creator &amp; Content{' '}
                <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-600 dark:from-fuchsia-400 dark:via-pink-300 dark:to-purple-400 bg-clip-text text-transparent">
                  Studio Hub
                </span>
              </h1>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Supercharge your content workflow with instant AI writing assistants, headline generators, SEO meta tags, fancy unicode text, and 3D gradient text generators.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground pt-4 border-t border-border/40">
                <span className="flex items-center gap-1.5 text-fuchsia-600 dark:text-fuchsia-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Multi-Provider AI Fallback
                </span>
                <span className="flex items-center gap-1.5">
                  ⚡ High-Speed Title &amp; Summary Generation
                </span>
                <span className="flex items-center gap-1.5">
                  🎨 100% Free &amp; Browser-Based
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Creator Studio Utilities</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select an AI writing or visual styling tool to launch.
              </p>
            </div>
            <span className="rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400">
              {creatorTools.length} Tools
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {creatorTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
