import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Aesthetic Wallpapers — FormatDock',
  description:
    'Curated 4K dark and light mode aesthetic wallpapers for your desktop and phone. Download free, high-resolution backgrounds.',
};

const wallpapers = [
  { url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=800&q=80', title: 'Twilight Mountains', res: '4K', tag: 'Dark' },
  { url: 'https://images.unsplash.com/photo-1418065460480-0c0c2b67b4b8?auto=format&fit=crop&w=800&q=80', title: 'Abstract Navy', res: '4K', tag: 'Dark' },
  { url: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=800&q=80', title: 'Minimal Wave', res: '4K', tag: 'Light' },
  { url: 'https://images.unsplash.com/photo-1502790671504-542ad42f80a6?auto=format&fit=crop&w=800&q=80', title: 'Foggy Peaks', res: '4K', tag: 'Dark' },
  { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80', title: 'Ocean Depth', res: '4K', tag: 'Dark' },
  { url: 'https://images.unsplash.com/photo-1465101046534-3ad6c9702e26?auto=format&fit=crop&w=800&q=80', title: 'Forest Light', res: '4K', tag: 'Light' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80', title: 'Pine Valley', res: '4K', tag: 'Light' },
  { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80', title: 'Alpine Glow', res: '4K', tag: 'Dark' },
  { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80', title: 'Golden Field', res: '4K', tag: 'Light' },
];

export default function WallpapersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-dock">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[#1e293b]">
          <div className="absolute left-1/2 top-0 -z-10 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
              <ImageIcon className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
              Aesthetic Wallpapers
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
              A curated collection of 4K dark and light wallpapers for your
              desktop and phone. Hover and click download to grab any image.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" /> Free to download
            </span>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Masonry grid */}
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {wallpapers.map((w, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl border border-[#1e293b] bg-[#0f172a] break-inside-avoid"
              >
                <img
                  src={w.url}
                  alt={w.title}
                  className="w-full transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-start justify-between p-3">
                    <span className="rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                      {w.res}
                    </span>
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 backdrop-blur">
                      {w.tag}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-white">{w.title}</p>
                    <a
                      href={w.url}
                      download={`${w.title.replace(/\s+/g, '-').toLowerCase()}-wallpaper.jpg`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Wallpapers sourced from Unsplash. More collections coming soon.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
