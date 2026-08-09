import { NextRequest, NextResponse } from 'next/server';

// ─── Types ───────────────────────────────────────────────────────────────

export interface MediaFile {
  quality: string;       // e.g. "4K", "Full HD", "HD", "SD", "Original", "Large", "Medium"
  width: number;
  height: number;
  url: string;           // direct download link
  size_mb?: number;
}

export interface NormalizedVideo {
  id: string;             // unique composite id: "pexels-video-12345"
  type: 'video' | 'photo';
  source: 'pexels' | 'pixabay' | 'coverr';
  title: string;
  description: string;
  thumbnail: string;     // poster or photo image URL
  previewUrl: string;    // small/preview mp4 or photo URL
  duration: number;      // seconds (0 for photos)
  width: number;
  height: number;
  author: string;
  authorUrl?: string;
  pageUrl: string;       // link to original page
  tags: string[];
  files: MediaFile[];    // downloadable formats/resolutions
}

interface CacheEntry {
  timestamp: number;
  data: { media: NormalizedVideo[]; videos: NormalizedVideo[]; total: number };
}

// ─── In-Memory Cache ──────────────────────────────────────────────────────

const CACHE_TTL_MS = 18 * 60 * 60 * 1000; // 18 hours
const cache = new Map<string, CacheEntry>();

function getCached(key: string): CacheEntry | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry;
}

function setCached(key: string, data: CacheEntry['data']): void {
  cache.set(key, { timestamp: Date.now(), data });
  if (cache.size > 100) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }
}

// ─── Pexels ───────────────────────────────────────────────────────────────

async function fetchPexelsVideos(query: string, perPage: number): Promise<NormalizedVideo[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}`;
    const res = await fetch(url, {
      headers: { Authorization: apiKey },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const json = await res.json();

    return (json.videos ?? []).map((v: any): NormalizedVideo => {
      const files: MediaFile[] = (v.video_files ?? [])
        .filter((f: any) => f.file_type === 'video/mp4')
        .map((f: any) => ({
          quality: labelQuality(f.width, f.height),
          width: f.width,
          height: f.height,
          url: f.link,
        }))
        .sort((a: MediaFile, b: MediaFile) => b.width - a.width);

      const previewFile = files[files.length - 1];
      const previewUrl = previewFile?.url ?? files[0]?.url ?? '';

      return {
        id: `pexels-video-${v.id}`,
        type: 'video',
        source: 'pexels',
        title: `Pexels Video ${v.id}`,
        description: '',
        thumbnail: v.image || (previewFile ? `${previewFile.url}#t=0.5` : ''),
        previewUrl,
        duration: v.duration ?? 0,
        width: v.width ?? 0,
        height: v.height ?? 0,
        author: v.user?.name ?? 'Pexels',
        authorUrl: v.user?.url,
        pageUrl: v.url ?? '',
        tags: ['video', 'stock footage'],
        files,
      };
    });
  } catch {
    return [];
  }
}

async function fetchPexelsPhotos(query: string, perPage: number): Promise<NormalizedVideo[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`;
    const res = await fetch(url, {
      headers: { Authorization: apiKey },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const json = await res.json();

    return (json.photos ?? []).map((p: any): NormalizedVideo => {
      const src = p.src ?? {};
      const files: MediaFile[] = [
        src.original && { quality: 'Original (4K)', width: p.width, height: p.height, url: src.original },
        src.large2x && { quality: 'Large 2x', width: 1920, height: 1280, url: src.large2x },
        src.large && { quality: 'Large', width: 1280, height: 850, url: src.large },
        src.medium && { quality: 'Medium', width: 800, height: 533, url: src.medium },
      ].filter(Boolean) as MediaFile[];

      return {
        id: `pexels-photo-${p.id}`,
        type: 'photo',
        source: 'pexels',
        title: p.alt || `Pexels Photo ${p.id}`,
        description: p.alt || '',
        thumbnail: src.medium || src.large || src.original || '',
        previewUrl: src.large || src.original || '',
        duration: 0,
        width: p.width ?? 0,
        height: p.height ?? 0,
        author: p.photographer ?? 'Pexels',
        authorUrl: p.photographer_url,
        pageUrl: p.url ?? '',
        tags: (p.alt || '').split(' ').filter((t: string) => t.length > 2),
        files,
      };
    });
  } catch {
    return [];
  }
}

// ─── Pixabay ──────────────────────────────────────────────────────────────

async function fetchPixabayVideos(query: string, perPage: number): Promise<NormalizedVideo[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return [];

  try {
    const params = new URLSearchParams({
      key: apiKey,
      q: query,
      per_page: String(perPage),
      safesearch: 'true',
    });
    const res = await fetch(`https://pixabay.com/api/videos/?${params.toString()}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const json = await res.json();

    return (json.hits ?? []).map((v: any): NormalizedVideo => {
      const files: MediaFile[] = [
        v.videos?.large && { quality: 'Large (4K/HD)', width: v.videos.large.width, height: v.videos.large.height, url: v.videos.large.url, size_mb: v.videos.large.size_mb },
        v.videos?.medium && { quality: 'Medium', width: v.videos.medium.width, height: v.videos.medium.height, url: v.videos.medium.url, size_mb: v.videos.medium.size_mb },
        v.videos?.small && { quality: 'Small', width: v.videos.small.width, height: v.videos.small.height, url: v.videos.small.url, size_mb: v.videos.small.size_mb },
        v.videos?.tiny && { quality: 'Tiny', width: v.videos.tiny.width, height: v.videos.tiny.height, url: v.videos.tiny.url, size_mb: v.videos.tiny.size_mb },
      ].filter(Boolean) as MediaFile[];

      const previewUrl = v.videos?.tiny?.url ?? v.videos?.small?.url ?? files[0]?.url ?? '';
      
      // Fix Pixabay thumbnail: use Vimeo video poster URL or video thumbnail or user image
      const thumbnail = v.picture_id
        ? `https://i.vimeocdn.com/video/${v.picture_id}_640x360.jpg`
        : (v.userImageURL || v.videos?.small?.thumbnail || previewUrl);

      return {
        id: `pixabay-video-${v.id}`,
        type: 'video',
        source: 'pixabay',
        title: v.tags ? `Pixabay: ${v.tags}` : `Pixabay Video ${v.id}`,
        description: '',
        thumbnail,
        previewUrl,
        duration: v.duration ?? 0,
        width: v.videos?.large?.width ?? v.videos?.medium?.width ?? 0,
        height: v.videos?.large?.height ?? v.videos?.medium?.height ?? 0,
        author: v.user ?? 'Pixabay',
        pageUrl: v.pageURL ?? '',
        tags: (v.tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean),
        files,
      };
    });
  } catch {
    return [];
  }
}

async function fetchPixabayPhotos(query: string, perPage: number): Promise<NormalizedVideo[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return [];

  try {
    const params = new URLSearchParams({
      key: apiKey,
      q: query,
      per_page: String(perPage),
      image_type: 'photo',
      safesearch: 'true',
    });
    const res = await fetch(`https://pixabay.com/api/?${params.toString()}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const json = await res.json();

    return (json.hits ?? []).map((p: any): NormalizedVideo => {
      const files: MediaFile[] = [
        p.largeImageURL && { quality: 'Large HD', width: p.imageWidth, height: p.imageHeight, url: p.largeImageURL },
        p.webformatURL && { quality: 'Medium', width: 640, height: Math.round((640 * p.imageHeight) / (p.imageWidth || 1)), url: p.webformatURL },
      ].filter(Boolean) as MediaFile[];

      return {
        id: `pixabay-photo-${p.id}`,
        type: 'photo',
        source: 'pixabay',
        title: p.tags ? `Pixabay: ${p.tags}` : `Pixabay Photo ${p.id}`,
        description: '',
        thumbnail: p.webformatURL || p.previewURL || p.largeImageURL,
        previewUrl: p.largeImageURL || p.webformatURL,
        duration: 0,
        width: p.imageWidth ?? 0,
        height: p.imageHeight ?? 0,
        author: p.user ?? 'Pixabay',
        pageUrl: p.pageURL ?? '',
        tags: (p.tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean),
        files,
      };
    });
  } catch {
    return [];
  }
}

// ─── Coverr ────────────────────────────────────────────────────────────────

async function fetchCoverr(query: string, perPage: number): Promise<NormalizedVideo[]> {
  const apiKey = process.env.COVERR_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `https://api.coverr.co/api/v1/videos?query=${encodeURIComponent(query)}&page_size=${perPage}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const json = await res.json();

    const hits = json.hits ?? json.data ?? [];

    return hits.map((v: any): NormalizedVideo => {
      const downloadUrl = v.downloadUrl ?? v.url ?? '';
      const previewUrl = v.previewUrl ?? v.gifUrl ?? downloadUrl;

      const files: MediaFile[] = downloadUrl
        ? [{ quality: labelQuality(v.width ?? 1920, v.height ?? 1080), width: v.width ?? 1920, height: v.height ?? 1080, url: downloadUrl }]
        : [];

      return {
        id: `coverr-video-${v.id ?? v.title}`,
        type: 'video',
        source: 'coverr',
        title: v.title ?? 'Coverr Video',
        description: v.description ?? '',
        thumbnail: v.thumbnail ?? v.cover ?? previewUrl,
        previewUrl,
        duration: v.duration ?? 0,
        width: v.width ?? 0,
        height: v.height ?? 0,
        author: 'Coverr',
        pageUrl: v.shareUrl ?? `https://coverr.co/s/${encodeURIComponent(v.title ?? '')}`,
        tags: (v.tags ?? []).map((t: string) => String(t)),
        files,
      };
    });
  } catch {
    return [];
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function labelQuality(w: number, h: number): string {
  const min = Math.min(w, h);
  if (min >= 2160) return '4K';
  if (min >= 1080) return 'Full HD';
  if (min >= 720) return 'HD';
  return 'SD';
}

function dedupe(items: NormalizedVideo[]): NormalizedVideo[] {
  const seen = new Set<string>();
  return items.filter((v) => {
    const key = v.id || v.previewUrl || v.thumbnail;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Route Handler ─────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('q') ?? 'nature').trim().toLowerCase();
  const mediaType = (searchParams.get('type') ?? 'all').toLowerCase(); // 'all' | 'video' | 'photo'
  const perPage = Math.min(parseInt(searchParams.get('per_page') ?? '15', 10), 30);

  const cacheKey = `${query}:${mediaType}:${perPage}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached.data, {
      headers: { 'X-Cache': 'HIT' },
    });
  }

  let fetches: Promise<NormalizedVideo[]>[] = [];

  if (mediaType === 'video') {
    fetches = [
      fetchPexelsVideos(query, perPage),
      fetchPixabayVideos(query, perPage),
      fetchCoverr(query, perPage),
    ];
  } else if (mediaType === 'photo') {
    fetches = [
      fetchPexelsPhotos(query, perPage),
      fetchPixabayPhotos(query, perPage),
    ];
  } else {
    // 'all' -> both photos and videos
    fetches = [
      fetchPexelsVideos(query, perPage),
      fetchPixabayVideos(query, perPage),
      fetchPexelsPhotos(query, perPage),
      fetchPixabayPhotos(query, perPage),
      fetchCoverr(query, perPage),
    ];
  }

  const results = await Promise.all(fetches);
  const merged = dedupe(results.flat());

  const data = { media: merged, videos: merged, total: merged.length };

  setCached(cacheKey, data);

  return NextResponse.json(data, {
    headers: { 'X-Cache': 'MISS' },
  });
}
