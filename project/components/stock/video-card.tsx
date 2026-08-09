'use client';

import { useRef, useState, useCallback } from 'react';
import { Download, Play, ExternalLink, ChevronDown, Clock, Image as ImageIcon, Film } from 'lucide-react';
import { toast } from 'sonner';
import type { NormalizedVideo, MediaFile } from '@/app/api/stock-videos/route';

const sourceColors: Record<string, string> = {
  pexels: 'text-emerald-500 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  pixabay: 'text-blue-500 dark:text-blue-400 border-blue-500/30 bg-blue-500/10',
  coverr: 'text-cyan-500 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoCard({ video }: { video: NormalizedVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isVideo = video.type === 'video' || (video.duration > 0 && Boolean(video.previewUrl));

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (!isVideo || !video.previewUrl) return;
    setTimeout(() => {
      const v = videoRef.current;
      if (v) {
        v.muted = true;
        v.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 50);
  }, [isVideo, video.previewUrl]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPlaying(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  }, []);

  const handleDownload = useCallback((file: MediaFile) => {
    const ext = isVideo ? 'mp4' : 'jpg';
    const a = document.createElement('a');
    a.href = file.url;
    a.download = `${video.source}-${video.id}-${file.width}x${file.height}.${ext}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Downloading ${file.quality} (${file.width}×${file.height})`);
    setShowDownloads(false);
  }, [video.id, video.source, isVideo]);

  const fallbackThumbnail = isVideo
    ? 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80';

  const displayImage = imgError
    ? fallbackThumbnail
    : (video.thumbnail || video.previewUrl || fallbackThumbnail);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md break-inside-avoid shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media Box */}
      <div className="relative overflow-hidden bg-muted/40 aspect-[4/3]">
        {/* Base Image Thumbnail - Guaranteed instant load for all media */}
        <img
          src={displayImage}
          alt={video.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Video Overlay - Only active when hovered */}
        {isVideo && isHovered && video.previewUrl && (
          <video
            ref={videoRef}
            src={video.previewUrl}
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Video Play indicator */}
        {isVideo && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-lg">
              <Play className="h-5 w-5 fill-white text-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Media Type & Source badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize backdrop-blur ${sourceColors[video.source]}`}>
            {video.source}
          </span>
          <span className="flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
            {isVideo ? <Film className="h-2.5 w-2.5 text-blue-400" /> : <ImageIcon className="h-2.5 w-2.5 text-emerald-400" />}
            {isVideo ? 'Video' : 'Photo'}
          </span>
        </div>

        {/* Duration badge if video */}
        {isVideo && video.duration > 0 && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 pointer-events-none">
            <span className="flex items-center gap-0.5 rounded-full border border-white/20 bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
              <Clock className="h-2.5 w-2.5" />
              {formatDuration(video.duration)}
            </span>
          </div>
        )}
      </div>

      {/* Info & Actions */}
      <div className="p-3">
        <p className="text-xs font-bold text-foreground line-clamp-1">{video.title}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">by {video.author}</span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {video.width > 0 ? `${video.width}×${video.height}` : ''}
          </span>
        </div>

        {/* Action buttons */}
        <div className="mt-2.5 flex items-center gap-1.5">
          {/* Download dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => setShowDownloads((s) => !s)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-bold text-primary-foreground transition-all hover:opacity-90"
            >
              <Download className="h-3 w-3" />
              Download
              <ChevronDown className={`h-3 w-3 transition-transform ${showDownloads ? 'rotate-180' : ''}`} />
            </button>

            {showDownloads && (
              <div className="absolute bottom-full left-0 right-0 mb-1 overflow-hidden rounded-lg border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl z-10 animate-fade-in-up">
                {video.files && video.files.length > 0 ? (
                  video.files.map((file, i) => (
                    <button
                      key={i}
                      onClick={() => handleDownload(file)}
                      className="flex w-full items-center justify-between px-3 py-2 text-[11px] font-semibold text-foreground transition-colors hover:bg-primary/15 hover:text-primary"
                    >
                      <span>{file.quality}</span>
                      <span className="font-mono text-muted-foreground">{file.width}×{file.height}</span>
                    </button>
                  ))
                ) : (
                  <a
                    href={video.previewUrl || video.thumbnail || video.pageUrl}
                    target="_blank"
                    download
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-primary hover:bg-primary/10"
                  >
                    <Download className="h-3 w-3" /> Direct Download
                  </a>
                )}
              </div>
            )}
          </div>

          {/* External link */}
          <a
            href={video.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-card/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Open original page"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
