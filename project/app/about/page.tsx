import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Boxes, ShieldCheck, Zap, Lock, Target, Users } from 'lucide-react';

export const metadata = {
  title: 'About Us — FormatDock',
  description:
    'FormatDock provides fast, free, browser-based student and productivity tools. Learn about our mission to make utilities private, instant, and accessible.',
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-dock">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[#1e293b]">
          <div className="absolute left-1/2 top-0 -z-10 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[#2563EB]/15 blur-[120px]" />
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563EB]/15 text-[#3B82F6] shadow-[0_0_20px_-4px_rgba(37,99,235,0.6)]">
              <Boxes className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
              About FormatDock
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
              FormatDock is a free, private hub of student and productivity
              utilities that run entirely in your browser. No uploads, no
              signups, no tracking — just fast tools that work.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <Value icon={<Lock className="h-5 w-5" />} title="Privacy First">
              Every tool runs client-side. Your files and data never leave your
              device, ever.
            </Value>
            <Value icon={<Zap className="h-5 w-5" />} title="Instant & Free">
              No installs, no waiting, no paywalls. Results appear the moment you
              need them.
            </Value>
            <Value icon={<Target className="h-5 w-5" />} title="Built for Students">
              Exam specs, calculators, and focus tools — tailored for the way
              students actually work.
            </Value>
          </div>

          <div className="mt-12 space-y-6 text-slate-300">
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            <p className="text-sm leading-relaxed sm:text-base">
              FormatDock was built on a simple idea: utility tools should be
              fast, private, and genuinely pleasant to use. Too many free tool
              sites are cluttered with ads, require signups, or quietly upload
              your files to a server. We do the opposite.
            </p>
            <p className="text-sm leading-relaxed sm:text-base">
              Every tool on FormatDock runs entirely in your browser using modern
              web technologies like the Canvas API and WebAssembly. That means
              your photos, documents, and calculations never leave your device.
              There&apos;s no server processing, no storage, and no tracking of
              your inputs.
            </p>
            <p className="text-sm leading-relaxed sm:text-base">
              We started with exam photo resizers for Indian exam applicants —
              UPSC, SSC, CTET, Bank, and Railway — and are expanding into PDF &amp;
              image conversion, everyday finance calculators, productivity &amp;
              focus tools, and aesthetic wallpapers. Everything stays free and
              client-side.
            </p>
          </div>

          <div className="mt-12 rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6">
            <div className="flex items-center gap-2 text-[#3B82F6]">
              <Users className="h-5 w-5" />
              <h2 className="text-lg font-bold text-white">Who we serve</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Students preparing for competitive exams, professionals who need a
              quick file conversion, freelancers calculating GST, and anyone who
              values their privacy. If you want a tool that just works — without
              giving up your data — FormatDock is for you.
            </p>
          </div>

          <div className="mt-12 flex items-center gap-3 rounded-xl border border-[#2563EB]/30 bg-[#2563EB]/5 p-5">
            <ShieldCheck className="h-6 w-6 shrink-0 text-[#3B82F6]" />
            <p className="text-sm text-slate-300">
              FormatDock is an independent project and is not affiliated with any
              government body or exam authority. Always verify specifications
              against the official exam notification.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Value({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#3B82F6]">
        {icon}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 text-xs text-slate-400">{children}</p>
    </div>
  );
}
