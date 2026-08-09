import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Image as ImageIcon, Sparkles, Download, Wand as Wand2, ArrowRight, Monitor, Smartphone } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata = {
  title: 'Aesthetic Wallpapers — FormatDock',
  description:
    'Curated 4K dark and light mode aesthetic wallpapers for your desktop and phone. Download free, high-resolution backgrounds.',
};

interface CloudinaryAsset {
  public_id: string;
  url: string;
  format: string;
  width?: number;
  height?: number;
  tags?: string[];
}

interface Wallpaper {
  url: string;
  title: string;
  res: string;
  tag: string;
  downloadUrl: string;
  width: number;
  height: number;
}

const FALLBACK_WALLPAPERS: Wallpaper[] = [
  { url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1600&q=80', title: 'Twilight Mountains', res: '3840×2160', tag: 'Dark', downloadUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=3840&q=100', width: 3840, height: 2160 },
  { url: 'https://images.unsplash.com/photo-1418065460480-0c0c2b67b4b8?auto=format&fit=crop&w=1600&q=80', title: 'Abstract Navy', res: '3840×2160', tag: 'Dark', downloadUrl: 'https://images.unsplash.com/photo-1418065460480-0c0c2b67b4b8?auto=format&fit=crop&w=3840&q=100', width: 3840, height: 2160 },
  { url: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=1600&q=80', title: 'Minimal Wave', res: '3840×2160', tag: 'Light', downloadUrl: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=3840&q=100', width: 3840, height: 2160 },
  { url: 'https://images.unsplash.com/photo-1502790671504-542ad42f80a6?auto=format&fit=crop&w=1600&q=80', title: 'Foggy Peaks', res: '3840×2160', tag: 'Dark', downloadUrl: 'https://images.unsplash.com/photo-1502790671504-542ad42f80a6?auto=format&fit=crop&w=3840&q=100', width: 3840, height: 2160 },
  { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1600&q=80', title: 'Ocean Depth', res: '3840×2160', tag: 'Dark', downloadUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=3840&q=100', width: 3840, height: 2160 },
  { url: 'https://images.unsplash.com/photo-1465101046534-3ad6c9702e26?auto=format&fit=crop&w=1600&q=80', title: 'Forest Light', res: '3840×2160', tag: 'Light', downloadUrl: 'https://images.unsplash.com/photo-1465101046534-3ad6c9702e26?auto=format&fit=crop&w=3840&q=100', width: 3840, height: 2160 },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80', title: 'Pine Valley', res: '3840×2160', tag: 'Light', downloadUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=3840&q=100', width: 3840, height: 2160 },
  { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80', title: 'Alpine Glow', res: '3840×2160', tag: 'Dark', downloadUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=3840&q=100', width: 3840, height: 2160 },
  { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80', title: 'Golden Field', res: '3840×2160', tag: 'Light', downloadUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=3840&q=100', width: 3840, height: 2160 },
  { url: 'https://images.unsplash.com/photo-1470770841072-f978cf4dabc8?auto=format&fit=crop&w=1600&q=80', title: 'Aurora Lake', res: '3840×2160', tag: 'Dark', downloadUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4dabc8?auto=format&fit=crop&w=3840&q=100', width: 3840, height: 2160 },
  { url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1600&q=80', title: 'Gradient Sky', res: '3840×2160', tag: 'Light', downloadUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=3840&q=100', width: 3840, height: 2160 },
  { url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1600&q=80', title: 'Starlit Ridge', res: '3840×2160', tag: 'Dark', downloadUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=3840&q=100', width: 3840, height: 2160 },
];

async function fetchWallpapers(): Promise<{ wallpapers: Wallpaper[]; source: 'cloudinary' | 'fallback' }> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (cloudName) {
    try {
      const res = await fetch(
        `https://res.cloudinary.com/${cloudName}/image/list/wallpaper.json`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) throw new Error('Cloudinary fetch failed');
      const json = await res.json();
      const assets: CloudinaryAsset[] = json.resources ?? [];

      const wallpapers: Wallpaper[] = assets.map((asset, i) => {
        const w = asset.width ?? 3840;
        const h = asset.height ?? 2160;
        const tag = (asset.tags && asset.tags.length > 0) ? asset.tags[0] : (i % 2 === 0 ? 'Dark' : 'Light');
        return {
          url: `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_800/${asset.public_id}.${asset.format}`,
          downloadUrl: `https://res.cloudinary.com/${cloudName}/image/upload/${asset.public_id}.${asset.format}`,
          title: asset.public_id.split('/').pop()?.replace(/[-_]/g, ' ') ?? `Wallpaper ${i + 1}`,
          res: `${w}×${h}`,
          tag,
          width: w,
          height: h,
        };
      });

      if (wallpapers.length > 0) return { wallpapers, source: 'cloudinary' };
    } catch {
      // Fall through to fallback
    }
  }

  return { wallpapers: FALLBACK_WALLPAPERS, source: 'fallback' };
}

export default async function WallpapersPage() {
  const { wallpapers, source } = await fetchWallpapers();

  return (
    <div className="flex min-h-screen flex-col bg-background/80 text-foreground">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60 bg-card/40 backdrop-blur-md py-12 sm:py-16">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />
          <div className="pointer-events-none absolute top-[30%] right-[-60px] -z-10 h-[280px] w-[280px] rounded-full bg-blue-600/10 blur-[120px]" />

          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-600 text-white shadow-lg border border-white/20">
              <ImageIcon className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Aesthetic{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400 bg-clip-text text-transparent">
                Wallpapers
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed sm:text-base">
              A curated collection of 4K dark and light wallpapers for your desktop and phone.
              Hover any wallpaper and click download to grab the full-resolution image.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                <Sparkles className="h-3.5 w-3.5" /> Free to download
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Monitor className="h-3.5 w-3.5" /> 4K Desktop
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <Smartphone className="h-3.5 w-3.5" /> Mobile
              </span>
            </div>
            {source === 'fallback' && (
              <p className="mt-3 text-[11px] text-muted-foreground/70">
                Showing curated fallback collection. Connect Cloudinary for live uploads.
              </p>
            )}
          </div>
        </section>

        {/* Masonry Grid */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4">
            {wallpapers.map((w, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md break-inside-avoid shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
              >
                <img
                  src={w.url}
                  alt={w.title}
                  className="w-full transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {/* Top badges */}
                  <div className="flex items-start justify-between p-3">
                    <span className="rounded-full border border-white/20 bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                      {w.res}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold backdrop-blur ${
                      w.tag === 'Dark'
                        ? 'border-cyan-400/30 bg-cyan-500/20 text-cyan-300'
                        : 'border-amber-400/30 bg-amber-500/20 text-amber-300'
                    }`}>
                      {w.tag}
                    </span>
                  </div>
                  {/* Bottom info + download */}
                  <div className="p-3">
                    <p className="text-sm font-bold text-white line-clamp-1">{w.title}</p>
                    <a
                      href={w.downloadUrl}
                      download={`${w.title.replace(/\s+/g, '-').toLowerCase()}-wallpaper.jpg`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#1d4ed8] hover:scale-105 active:scale-95"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download 4K
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cross-sell banner */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-cyan-600/10 backdrop-blur-md p-5 sm:p-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Wand2 className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Need a custom size?</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Resize and compress any wallpaper to exact pixel dimensions with our Image Resizer tool.
                  </p>
                </div>
              </div>
              <Link
                href="/tools/upsc-photo-resizer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-md"
              >
                Try Image Resizer
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            {source === 'cloudinary'
              ? 'Wallpapers served from Cloudinary. New uploads appear within an hour.'
              : 'Wallpapers sourced from Unsplash. Connect Cloudinary for dynamic uploads.'}
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
