import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0B101E] px-4 text-center">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 -z-10 h-[200px] w-[200px] rounded-full bg-blue-500/5 blur-[80px]" />

      {/* Glowing squircle with 404 */}
      <div className="relative">
        <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-600/20 to-blue-500/5 shadow-[0_0_60px_-8px_rgba(37,99,235,0.5)] ring-1 ring-blue-500/30 transition-transform duration-500 hover:scale-105">
          <span className="text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
            404
          </span>
        </div>
        {/* Floating compass */}
        <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#252D3D] bg-[#151B2B] text-blue-400 shadow-lg">
          <Compass className="h-5 w-5" />
        </div>
      </div>

      <h1 className="mt-8 text-3xl font-extrabold text-white sm:text-4xl">
        Lost in the Dock?
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
        The tool or page you are looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/">
          <Button className="btn-primary-glow inline-flex items-center gap-2 transition-transform active:scale-95">
            <Home className="h-4 w-4" />
            Back to Home Dock
          </Button>
        </Link>
        <Link href="/tools">
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 border-[#252D3D] bg-[#151B2B] text-slate-200 transition-transform hover:border-blue-500/50 hover:text-blue-400 active:scale-95"
          >
            <Search className="h-4 w-4" />
            Browse Tool Directory
          </Button>
        </Link>
      </div>

      {/* Subtle grid pattern at bottom */}
      <div className="mt-12 flex items-center gap-2 text-xs text-slate-600">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#252D3D]" />
        <span className="font-mono">FormatDock</span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#252D3D]" />
      </div>
    </div>
  );
}
