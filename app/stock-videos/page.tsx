'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Film, Loader as Loader2, Sparkles, ShieldCheck, Zap, CircleAlert as AlertCircle, Frown, Image as ImageIcon, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import VideoCard from '@/components/stock/video-card';
import type { NormalizedVideo } from '@/app/api/stock-videos/route';

const POPULAR_SEARCHES = [
  'nature', 'city', 'ocean', 'business', 'technology', 'food',
  'travel', 'animals', 'fitness', 'space', 'coffee', 'rain',
];

const SOURCE_FILTERS = ['all', 'pexels', 'pixabay', 'coverr'] as const;
type SourceFilter = typeof SOURCE_FILTERS[number];

const MEDIA_TYPES = [
  { id: 'all', label: 'All Media', icon: Layers },
  { id: 'video', label: 'Videos', icon: Film },
  { id: 'photo', label: 'Photos', icon: ImageIcon },
] as const;
type MediaType = typeof MEDIA_TYPES[number]['id'];

export default function StockVideosPage() {
  const [query, setQuery] = useState('nature');
  const [activeQuery, setActiveQuery] = useState('nature');
  const [mediaType, setMediaType] = useState<MediaType>('all');
  const [mediaItems, setMediaItems] = useState<NormalizedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchMedia = useCallback(async (q: string, type: MediaType) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stock-videos?q=${encodeURIComponent(q)}&type=${type}`);
      if (!res.ok) throw new Error('Failed to fetch media');
      const data = await res.json();
      setMediaItems(data.media ?? data.videos ?? []);
    } catch {
      setError('Unable to load stock media right now. Please try again.');
      setMediaItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia(activeQuery, mediaType);
  }, [activeQuery, mediaType, fetchMedia]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) setActiveQuery(value.trim().toLowerCase());
    }, 500);
  };

  const handlePillClick = (term: string) => {
    setQuery(term);
    setActiveQuery(term);
  };

  const filteredItems = sourceFilter === 'all'
    ? mediaItems
    : mediaItems.filter((v) => v.source === sourceFilter);

  const sourceCounts = {
    pexels: mediaItems.filter((v) => v.source === 'pexels').length,
    pixabay: mediaItems.filter((v) => v.source === 'pixabay').length,
    coverr: mediaItems.filter((v) => v.source === 'coverr').length,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background/80 text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60 bg-card/40 backdrop-blur-md py-12 sm:py-16">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]" />
          <div className="pointer-events-none absolute top-[40%] right-[-50px] -z-10 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[120px]" />

          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-600 text-white shadow-lg border border-white/20">
              <Film className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Stock Media{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400 bg-clip-text text-transparent">
                Search Engine
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed sm:text-base">
              Search across Pexels, Pixabay, and Coverr for high-resolution <strong>Photos &amp; Stock Footages</strong> simultaneously. Free commercial use downloads in HD &amp; 4K.
            </p>

            {/* Media type toggle tabs */}
            <div className="mt-6 flex justify-center">
              <div className="inline-flex rounded-xl border border-border/80 bg-card/80 p-1 backdrop-blur-md shadow-sm">
                {MEDIA_TYPES.map((t) => {
                  const Icon = t.icon;
                  const active = mediaType === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setMediaType(t.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                        active
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search bar */}
            <div className="mx-auto mt-4 max-w-xl">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search photos & stock footages (e.g. nature, city, ocean)..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="h-12 border-border/80 bg-card/60 pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30"
                  aria-label="Search stock media"
                />
              </div>
            </div>

            {/* Popular searches */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-bold text-muted-foreground">Trending:</span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handlePillClick(term)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold border transition-all ${
                    activeQuery === term
                      ? 'border-primary bg-primary/20 text-primary shadow-sm scale-105'
                      : 'border-border/80 bg-card/60 backdrop-blur-md text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Source filter + stats bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {SOURCE_FILTERS.map((src) => (
                <button
                  key={src}
                  onClick={() => setSourceFilter(src)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                    sourceFilter === src
                      ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm'
                      : 'bg-card/60 backdrop-blur-md text-muted-foreground border border-border/80 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {src === 'all' ? 'All Sources' : src}
                  {src !== 'all' && sourceCounts[src as keyof typeof sourceCounts] !== undefined && (
                    <span className="ml-1 text-[10px] opacity-60">
                      ({sourceCounts[src as keyof typeof sourceCounts]})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              {!loading && !error && (
                <span className="font-semibold">
                  {filteredItems.length} media item{filteredItems.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-3 text-xs font-semibold text-muted-foreground animate-pulse">
                Searching photos &amp; videos across Pexels, Pixabay &amp; Coverr...
              </p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-500">
                <AlertCircle className="h-7 w-7" />
              </div>
              <p className="mt-3 text-sm font-bold text-foreground">{error}</p>
              <button
                onClick={() => fetchMedia(activeQuery, mediaType)}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
                <Frown className="h-7 w-7" />
              </div>
              <p className="mt-3 text-sm font-bold text-foreground">No media found for &ldquo;{activeQuery}&rdquo;</p>
              <p className="mt-1 text-xs text-muted-foreground">Try a different search term or browse trending topics above.</p>
            </div>
          )}

          {/* Masonry grid */}
          {!loading && !error && filteredItems.length > 0 && (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4">
              {filteredItems.map((item) => (
                <VideoCard key={item.id} video={item} />
              ))}
            </div>
          )}
        </section>

        {/* Trust badges */}
        <section className="border-t border-border/80 bg-muted/40 backdrop-blur-md py-10">
          <div className="mx-auto grid max-w-5xl gap-5 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
            <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4">
              <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Photos &amp; Videos Unified</h4>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">Search both stock photos and high definition videos in one place.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4">
              <Zap className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Smart Caching</h4>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">Searches cached for 18 hours to ensure instant results and high speeds.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-foreground">100% Free Downloads</h4>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">All photos and videos are free for commercial and personal projects.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
