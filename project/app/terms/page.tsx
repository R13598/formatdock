import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import TrustBadgeBar from '@/components/trust-badge-bar';
import { FileCheck, ShieldAlert, Cpu, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — FormatDock',
  description:
    'FormatDock Terms of Service. Free, private, client-side web tools provided with zero data collection and zero server tracking.',
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background/80 text-foreground">
      <SiteHeader />
      <TrustBadgeBar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
              <FileCheck className="h-4 w-4" /> Usage & License Agreement
            </div>

            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: August 2026 • Free Client-Side Utility Agreement
            </p>
          </div>

          {/* Highlights Row */}
          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-md">
              <Cpu className="h-5 w-5 text-blue-500 mb-2" />
              <h3 className="text-xs font-bold text-foreground">Browser Execution</h3>
              <p className="mt-1 text-[11px] text-muted-foreground">All code runs locally on your client machine. No cloud queues or processing backends.</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-md">
              <FileCheck className="h-5 w-5 text-emerald-500 mb-2" />
              <h3 className="text-xs font-bold text-foreground">Free Commercial & Personal Use</h3>
              <p className="mt-1 text-[11px] text-muted-foreground">No paywalls, subscriptions, or hidden conversion watermarks on exported files.</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-md">
              <ShieldAlert className="h-5 w-5 text-amber-500 mb-2" />
              <h3 className="text-xs font-bold text-foreground">User File Responsibility</h3>
              <p className="mt-1 text-[11px] text-muted-foreground">Always double-check official exam notifications before submitting processed application photos.</p>
            </div>
          </div>

          {/* Terms Document Body */}
          <div className="glass-panel rounded-3xl border border-border/80 p-6 sm:p-8 space-y-6 text-xs leading-relaxed text-muted-foreground">
            <section>
              <h2 className="text-sm font-bold text-foreground mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing and using FormatDock (the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access or use the utilities offered on FormatDock.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-foreground mb-2">2. Description of Service</h2>
              <p>
                FormatDock provides web-based client utilities, including passport photo resizers, document/PDF converters, calculators, and focus timers. All operations execute strictly within the user&apos;s browser client using client-side technologies (Canvas, Web Workers, WebAssembly). FormatDock does not store, transmit, or inspect user files.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-foreground mb-2">3. User Responsibility for Official Portal Submissions</h2>
              <p>
                FormatDock provides presets based on official government notifications (such as UPSC, SSC, CTET, and IBPS). However, recruitment portals may update their dimension or KB file requirements without notice. Users are responsible for verifying that converted output files comply with the specific job recruitment notification prior to final submission.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-foreground mb-2">4. Intellectual Property & License</h2>
              <p>
                FormatDock grants you a personal, non-exclusive, non-transferable license to use all 33+ tools for both personal and commercial purposes at no charge. You retain 100% ownership of any file, document, or image processed using our platform.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-foreground mb-2">5. Disclaimer of Warranties</h2>
              <p>
                The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, express or implied. FormatDock shall not be liable for technical rejections on third-party application portals or data loss resulting from browser refreshes.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-foreground mb-2">6. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of FormatDock following updates constitutes acceptance of the modified Terms of Service.
              </p>
            </section>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}