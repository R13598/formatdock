import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import TrustBadgeBar from '@/components/trust-badge-bar';
import { ShieldCheck, Lock, EyeOff, ServerOff, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — FormatDock',
  description:
    'FormatDock is built on a 100% client-side execution model. Learn how your files and personal data never leave your browser.',
};

export default function PrivacyPage() {
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

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-500 dark:text-emerald-400 mb-3">
              <ShieldCheck className="h-4 w-4" /> 100% Zero-Server Upload Architecture
            </div>

            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: August 2026 • FormatDock Client-Side Guarantee
            </p>
          </div>

          {/* Privacy Guarantee Grid */}
          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-md">
              <ServerOff className="h-5 w-5 text-blue-500 mb-2" />
              <h3 className="text-xs font-bold text-foreground">Zero File Uploads</h3>
              <p className="mt-1 text-[11px] text-muted-foreground">Photos & PDFs are processed entirely in browser RAM using Canvas & WebAssembly.</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-md">
              <EyeOff className="h-5 w-5 text-emerald-500 mb-2" />
              <h3 className="text-xs font-bold text-foreground">Zero Tracking</h3>
              <p className="mt-1 text-[11px] text-muted-foreground">No user profiling, no cookies storing file data, and no third-party telemetry.</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-md">
              <Lock className="h-5 w-5 text-purple-500 mb-2" />
              <h3 className="text-xs font-bold text-foreground">Local Session Storage</h3>
              <p className="mt-1 text-[11px] text-muted-foreground">Tool preferences and recent shortcuts stay strictly inside your browser’s localStorage.</p>
            </div>
          </div>

          {/* Policy Document Body */}
          <div className="glass-panel rounded-3xl border border-border/80 p-6 sm:p-8 space-y-6 text-xs leading-relaxed text-muted-foreground">
            <section>
              <h2 className="text-sm font-bold text-foreground mb-2">1. Our Core Privacy Principle</h2>
              <p>
                At FormatDock, privacy is not a feature added after the fact—it is the foundational architecture of our platform. Every tool provided on FormatDock (including exam photo resizers, PDF compressors, image converters, and calculators) runs <strong>100% locally in your web browser</strong>. Your files, documents, images, and text inputs are never uploaded to any remote server or cloud database.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-foreground mb-2">2. How File Processing Works</h2>
              <p>
                When you drag and drop a passport photo, PDF, or document into FormatDock, the web browser utilizes client-side APIs (such as HTML5 Canvas, PDF-Lib, and Web Workers) to resize, compress, or convert the file in your device’s local memory. The moment you close or refresh the tab, all temporary memory allocations are cleared automatically by your browser.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-foreground mb-2">3. Information We Collect</h2>
              <p>
                We do not collect personal identifying information (PII), names, email addresses, or document metadata. We do not require account registration or login credentials to access any of our 33+ utilities.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-foreground mb-2">4. Local Storage Usage</h2>
              <p>
                FormatDock uses standard browser <code>localStorage</code> exclusively to save your UI preferences (such as your Light/Dark mode choice) and your recently accessed tool shortcuts for convenience. This data never leaves your device and can be cleared at any time via your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-foreground mb-2">5. Contact Us</h2>
              <p>
                If you have questions regarding our privacy architecture or client-side execution model, please reach out to us at <a href="mailto:support@formatdock.com" className="text-primary underline">support@formatdock.com</a>.
              </p>
            </section>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}