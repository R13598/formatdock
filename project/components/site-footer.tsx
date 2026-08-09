import Link from 'next/link';
import { ShieldCheck, Heart } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-card/40 backdrop-blur-xl text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white shadow-md border border-white/20 transition-transform group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden="true">
                  <path d="M7 4h10v3H10v3h6v3h-6v7H7z" />
                </svg>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
                FormatDock
              </span>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Fix it. Format it. Done. A private, browser-based student & productivity dock. Zero uploads, zero tracking, zero paywalls.
            </p>

            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% Client-Side Processing</span>
            </div>
          </div>

          {/* Quick Tools Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Tools Directory
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/exams" className="hover:text-primary transition-colors">
                  Exam Photo Resizers
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-primary transition-colors">
                  PDF & Image Utilities
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="hover:text-primary transition-colors">
                  Calculators & Finance
                </Link>
              </li>
              <li>
                <Link href="/tools?cat=creator" className="hover:text-primary transition-colors">
                  Creator Studio
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-primary transition-colors font-semibold text-primary">
                  View All 33 Utilities →
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Connect
            </h4>
            <p className="text-xs text-muted-foreground mb-2">Have a question or preset request?</p>
            <a
              href="mailto:support@formatdock.com"
              className="font-mono text-xs font-bold text-primary hover:underline"
            >
              support@formatdock.com
            </a>
          </div>

        </div>

        <div className="mt-10 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© 2026 FormatDock. Built for speed and privacy.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for students worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}