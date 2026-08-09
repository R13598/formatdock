'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Upload,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  GraduationCap,
  Zap,
  Lock,
  Clock,
  History,
  Calculator,
  Palette,
  Timer,
  X,
  Scissors,
  Layers,
  FileImage,
  EyeOff,
  Minimize2,
  Film,
  Image,
  Download,
  Search,
} from 'lucide-react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import TrustBadgeBar from '@/components/trust-badge-bar';
import ToolCard from '@/components/tool-card';
import { tools, type Tool } from '@/lib/tools';
import { setPendingFile } from '@/lib/file-store';

const RECENT_KEY = 'formatdock-recent-tools';

const POPULAR_PRESETS = [
  { name: 'UPSC Photo', slug: 'upsc-photo-resizer' },
  { name: 'Image → PDF', slug: 'image-to-pdf' },
  { name: 'PDF Compress', slug: 'pdf-compressor' },
  { name: 'Word Counter', slug: 'word-counter' },
];

interface RouterOption {
  title: string;
  desc: string;
  slug: string;
  icon: any;
  badge: string;
}

export default function HomePage() {
  const [dragActive, setDragActive] = useState(false);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('universal');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Intelligent File Router Modal State
  const [routedFile, setRoutedFile] = useState<File | null>(null);
  const [isRouterOpen, setIsRouterOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) {
        const parsed: string[] = JSON.parse(stored);
        setRecentSlugs(parsed);
        if (parsed.length > 0 && tools.some((t) => t.slug === parsed[0])) {
          setSelectedPreset(parsed[0]);
        }
      }
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const recentTools = useMemo(
    () =>
      recentSlugs
        .map((s) => tools.find((t) => t.slug === s))
        .filter((t): t is Tool => Boolean(t)),
    [recentSlugs]
  );

  const handleToolLaunch = (slug: string) => {
    try {
      const next = [slug, ...recentSlugs.filter((s) => s !== slug)].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Process dropped or selected files: Saves file locally before navigating
  const processFile = async (file: File) => {
    if (selectedPreset !== 'universal') {
      // 1. Save file in browser storage
      await setPendingFile(file);
      // 2. Save tool to history
      handleToolLaunch(selectedPreset);
      // 3. Navigate to workspace
      window.location.href = `/tools/${selectedPreset}`;
      return;
    }
    // Universal Mode: Open Intelligent Router Modal
    setRoutedFile(file);
    setIsRouterOpen(true);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Dynamic Router Options
  const routerOptions = useMemo<RouterOption[]>(() => {
    if (!routedFile) return [];

    const mime = routedFile.type.toLowerCase();
    const name = routedFile.name.toLowerCase();

    if (mime.includes('pdf') || name.endsWith('.pdf')) {
      return [
        {
          title: 'Compress PDF',
          desc: 'Shrink file size below 200 KB for online portal uploads.',
          slug: 'pdf-compressor',
          icon: Minimize2,
          badge: 'Most Popular',
        },
        {
          title: 'PDF Splitter',
          desc: 'Extract specific pages or separate pages into new files.',
          slug: 'pdf-split',
          icon: Scissors,
          badge: 'Page Tool',
        },
        {
          title: 'Merge with Other PDFs',
          desc: 'Combine multiple PDF documents into a single file.',
          slug: 'pdf-merger',
          icon: Layers,
          badge: 'Multi-Doc',
        },
        {
          title: 'Redact & Whiteout',
          desc: 'Conceal sensitive personal information before sharing.',
          slug: 'pdf-whiteout-redact',
          icon: EyeOff,
          badge: 'Security',
        },
      ];
    }

    if (mime.includes('webp') || name.endsWith('.webp')) {
      return [
        {
          title: 'Convert WebP to JPG / PNG',
          desc: 'Transform WebP to standard image formats required by forms.',
          slug: 'webp-to-jpg-png-converter',
          icon: FileImage,
          badge: 'Format Conversion',
        },
        {
          title: 'Strip EXIF & Metadata',
          desc: 'Remove GPS coordinates and camera data before posting.',
          slug: 'exif-data-remover',
          icon: ShieldCheck,
          badge: 'Privacy',
        },
      ];
    }

    return [
      {
        title: 'UPSC Passport Photo Resizer',
        desc: 'Enforce official 350×350 px and 20–300 KB limits.',
        slug: 'upsc-photo-resizer',
        icon: GraduationCap,
        badge: 'Exam Requirement',
      },
      {
        title: 'Convert Image to PDF',
        desc: 'Package your photo or document scan into a clean PDF.',
        slug: 'image-to-pdf',
        icon: FileText,
        badge: 'Doc Conversion',
      },
      {
        title: 'SSC Image Compressor',
        desc: 'Format specifically for SSC exam portals (200×230 px, 10–20 KB).',
        slug: 'ssc-image-compressor',
        icon: GraduationCap,
        badge: 'Exam Spec',
      },
      {
        title: 'Strip EXIF Metadata',
        desc: 'Wipe camera specs, location data, and date stamps.',
        slug: 'exif-data-remover',
        icon: ShieldCheck,
        badge: 'Privacy Tool',
      },
    ];
  }, [routedFile]);

  const activeTool = tools.find((t) => t.slug === selectedPreset);

  return (
    <div className="flex min-h-screen flex-col bg-background/80 text-foreground">
      <SiteHeader />
      <TrustBadgeBar />

      <main className="flex-1">
        {/* HERO WORKSPACE HUB */}
        <section className="relative border-b border-border/80 bg-gradient-to-b from-background via-card/20 to-background py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              
              {/* Left Column */}
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Fix it. Format it. Done. — Your Private Toolkit</span>
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-5xl lg:leading-[1.15]">
                  Instant utilities.{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400 bg-clip-text text-transparent">
                    Zero server uploads.
                  </span>
                </h1>

                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  Crop exam photos, compress PDFs, convert images, and run calculations — everything executes locally in your browser.
                </p>

                {/* Quick Select Target Utility */}
                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      {recentTools.length > 0 ? (
                        <>
                          <History className="h-3.5 w-3.5 text-primary" />
                          <span>Recently Used & Quick Presets:</span>
                        </>
                      ) : (
                        <span>Quick Select Target Utility:</span>
                      )}
                    </span>
                    {selectedPreset !== 'universal' && (
                      <button
                        onClick={() => setSelectedPreset('universal')}
                        className="text-[11px] font-semibold text-primary hover:underline"
                      >
                        Reset to Universal
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recentTools.slice(0, 3).map((tool) => (
                      <button
                        key={tool.slug}
                        onClick={() => setSelectedPreset(tool.slug)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
                          selectedPreset === tool.slug
                            ? 'border-primary bg-primary/20 text-primary shadow-sm scale-105'
                            : 'border-border/80 bg-card/60 backdrop-blur-md text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        ⚡ {tool.shortTitle}
                      </button>
                    ))}

                    {POPULAR_PRESETS.filter((p) => !recentSlugs.includes(p.slug)).map((p) => (
                      <button
                        key={p.slug}
                        onClick={() => setSelectedPreset(p.slug)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
                          selectedPreset === p.slug
                            ? 'border-primary bg-primary/20 text-primary shadow-sm scale-105'
                            : 'border-border/80 bg-card/60 backdrop-blur-md text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Dropzone Box */}
              <div className="lg:col-span-7">
                <div className="relative">
                  <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 opacity-20 dark:opacity-30 blur-2xl pointer-events-none" />

                  <div className="glass-panel relative rounded-3xl border border-border/80 p-6 shadow-2xl bg-card/70 backdrop-blur-xl specular-card">
                    <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500/80" />
                        <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                        <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                        <span className="ml-2 text-xs font-mono text-muted-foreground">
                          {selectedPreset === 'universal' ? (
                            <strong className="text-foreground">Universal Client Engine (Auto-Detect)</strong>
                          ) : (
                            <>Active Mode: <strong className="text-primary">{activeTool?.title}</strong></>
                          )}
                        </span>
                      </div>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Engine Ready
                      </span>
                    </div>

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                        dragActive
                          ? 'border-primary bg-primary/10 scale-[1.01]'
                          : 'border-border/80 hover:border-primary/50 hover:bg-primary/5'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm transition-transform group-hover:scale-110">
                        <Upload className="h-7 w-7" />
                      </div>
                      
                      <p className="mt-3 text-sm font-bold text-foreground">
                        {selectedPreset === 'universal' ? (
                          <span>Drop any file here to launch Intelligent Router</span>
                        ) : (
                          <span>Drop file to launch <span className="text-primary">{activeTool?.title}</span></span>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Supports PDF, JPG, PNG, WebP • Analyzed 100% locally
                      </p>
                      
                      <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-all">
                        {selectedPreset === 'universal' ? 'Choose File to Inspect' : `Open ${activeTool?.shortTitle} Workspace`} <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* BENTO DOMAIN SUITES */}
        <section className="bg-card/40 dark:bg-card/20 backdrop-blur-md border-b border-border/80 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-foreground">🎓 Exam Photo & Signature Suite</h2>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">UPSC • SSC • CTET • IBPS</span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-1 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 shadow-xl backdrop-blur-md flex flex-col justify-between specular-card">
                <div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Featured Student Utility
                  </span>
                  <h3 className="mt-3 text-xl font-black text-foreground">Exam Passport Photo Resizer</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Auto-adjusts photos and scanned signatures to meet official dimension and KB thresholds for government exams.
                  </p>
                </div>
                <Link
                  href="/tools/upsc-photo-resizer"
                  onClick={() => handleToolLaunch('upsc-photo-resizer')}
                  className="mt-6 inline-flex items-center justify-between rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-emerald-500"
                >
                  Launch UPSC Resizer <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
                {tools.filter((t) => t.group === 'Exam Photo Tools' && t.slug !== 'upsc-photo-resizer').map((t) => (
                  <div key={t.slug} onClick={() => handleToolLaunch(t.slug)}>
                    <ToolCard tool={t} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PDF Suite */}
        <section className="bg-background/80 backdrop-blur-md border-b border-border/80 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                <h2 className="text-lg font-bold text-foreground">📄 PDF & Document Utilities</h2>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">Merge • Compress • Split • Watermark</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.filter((t) => t.group === 'Document Utilities').map((t) => (
                <div key={t.slug} onClick={() => handleToolLaunch(t.slug)}>
                  <ToolCard tool={t} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculators Suite */}
        <section className="bg-card/40 dark:bg-card/20 backdrop-blur-md border-b border-border/80 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-foreground">🧮 Calculators & Exam Eligibility</h2>
              </div>
              <Link href="/calculators" className="text-xs font-semibold text-primary hover:underline">
                View All Calculators →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.filter((t) => t.group === 'Calculators').map((t) => (
                <div key={t.slug} onClick={() => handleToolLaunch(t.slug)}>
                  <ToolCard tool={t} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Creator Studio Suite */}
        <section className="bg-background/80 backdrop-blur-md border-b border-border/80 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
                <h2 className="text-lg font-bold text-foreground">🎨 Creator & Image Dev Studio</h2>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">Unicode Fonts • 3D Text • EXIF Strip • WebP</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.filter((t) => ['Creator Studio', 'Image & Dev Utilities'].includes(t.group)).map((t) => (
                <div key={t.slug} onClick={() => handleToolLaunch(t.slug)}>
                  <ToolCard tool={t} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Productivity Suite */}
        <section className="bg-card/40 dark:bg-card/20 backdrop-blur-md py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-lg font-bold text-foreground">⏱️ Productivity & Focus Dock</h2>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {tools.filter((t) => t.group === 'Productivity & Focus').map((t) => (
                <div key={t.slug} onClick={() => handleToolLaunch(t.slug)}>
                  <ToolCard tool={t} />
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Stock Videos Section */}
        <section className="bg-background/80 backdrop-blur-md border-b border-border/80 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-foreground">🎬 Stock Video Search Engine</h2>
              </div>
              <Link href="/stock-videos" className="text-xs font-semibold text-primary hover:underline">
                Open Full Search →
              </Link>
            </div>

            {/* Feature preview card */}
            <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-cyan-600/10 backdrop-blur-md p-6 sm:p-8">
              <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[100px]" />
              <div className="pointer-events-none absolute left-[-60px] bottom-[-60px] h-[250px] w-[250px] rounded-full bg-cyan-500/10 blur-[80px]" />

              <div className="grid gap-6 md:grid-cols-2 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4">
                    <Sparkles className="h-3.5 w-3.5" /> 3 Sources, 1 Search
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-foreground">
                    Royalty-Free Videos{' '}
                    <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                      In Seconds
                    </span>
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Search across <strong className="text-foreground">Pexels</strong>,{' '}
                    <strong className="text-foreground">Pixabay</strong>, and{' '}
                    <strong className="text-foreground">Coverr</strong> simultaneously.
                    Hover-to-play previews, multiple resolutions — 100% free.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {['nature', 'city', 'ocean', 'business', 'space'].map((tag) => (
                      <Link
                        key={tag}
                        href={`/stock-videos?q=${tag}`}
                        className="rounded-full border border-border/80 bg-card/60 px-3 py-1 text-xs font-semibold text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/stock-videos"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-md"
                  >
                    <Search className="h-4 w-4" /> Search Stock Videos
                  </Link>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Video Sources', value: '3', sub: 'Pexels · Pixabay · Coverr', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                    { label: 'Resolutions', value: '4K', sub: 'SD · HD · Full HD · 4K', color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                    { label: 'Caching', value: '18h', sub: 'Smart result cache', color: 'text-cyan-500 dark:text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
                    { label: 'Cost', value: 'Free', sub: 'Commercial use OK', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                  ].map((stat) => (
                    <div key={stat.label} className={`rounded-2xl border ${stat.border} ${stat.bg} p-4`}>
                      <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                      <div className="text-[11px] font-bold text-foreground mt-0.5">{stat.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wallpapers Section */}
        <section className="bg-card/40 dark:bg-card/20 backdrop-blur-md border-b border-border/80 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <h2 className="text-lg font-bold text-foreground">🖼️ Aesthetic Wallpapers</h2>
              </div>
              <Link href="/wallpapers" className="text-xs font-semibold text-primary hover:underline">
                Browse All →
              </Link>
            </div>

            {/* Wallpaper preview cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=600&q=80', title: 'Twilight Mountains', tag: 'Dark' },
                { url: 'https://images.unsplash.com/photo-1470770841072-f978cf4dabc8?auto=format&fit=crop&w=600&q=80', title: 'Aurora Lake', tag: 'Dark' },
                { url: 'https://images.unsplash.com/photo-1465101046534-3ad6c9702e26?auto=format&fit=crop&w=600&q=80', title: 'Forest Light', tag: 'Light' },
                { url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=600&q=80', title: 'Gradient Sky', tag: 'Light' },
              ].map((w, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1">
                  <img
                    src={w.url}
                    alt={w.title}
                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex items-start justify-between p-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold backdrop-blur ${
                        w.tag === 'Dark'
                          ? 'border-cyan-400/30 bg-cyan-500/20 text-cyan-300'
                          : 'border-amber-400/30 bg-amber-500/20 text-amber-300'
                      }`}>{w.tag}</span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-white">{w.title}</p>
                      <Link
                        href="/wallpapers"
                        className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur transition-all hover:bg-white/30"
                      >
                        <Download className="h-3 w-3" /> Download 4K
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-5 py-4">
              <div>
                <p className="text-sm font-bold text-foreground">12+ curated 4K wallpapers available</p>
                <p className="text-xs text-muted-foreground mt-0.5">Dark mode, Light mode, Desktop & Mobile. Free to download.</p>
              </div>
              <Link
                href="/wallpapers"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-cyan-500 hover:scale-105 active:scale-95 shadow-md"
              >
                <Image className="h-3.5 w-3.5" /> Browse All Wallpapers
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="border-t border-border/80 bg-muted/40 backdrop-blur-md py-12">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
            <div className="flex items-start gap-3.5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-5">
              <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-foreground">100% Client-Side Privacy</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">Files stay in browser memory. Zero server uploads.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-5">
              <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Instant Browser Execution</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">No upload waiting times. Canvas & WebAssembly powered.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-5">
              <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Always Free & Unlimited</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">No signups, paywalls, or hidden watermarks.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* INTELLIGENT FILE ROUTER MODAL */}
      {isRouterOpen && routedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in-up">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card/95 p-6 shadow-2xl glass-panel">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border/60 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary mb-1">
                  <Sparkles className="h-3 w-3" /> Intelligent File Router
                </div>
                <h3 className="text-base font-extrabold text-foreground truncate max-w-[320px]">
                  {routedFile.name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Size: {formatFileSize(routedFile.size)} • Type: {routedFile.type || 'Unknown Format'}
                </p>
              </div>
              <button
                onClick={() => setIsRouterOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Recommendations List */}
            <div className="mt-4 space-y-2.5">
              <p className="text-xs font-bold text-muted-foreground">
                Select target utility for this file:
              </p>

              {routerOptions.map((opt) => {
                const OptionIcon = opt.icon;
                return (
                  <button
                    key={opt.slug}
                    onClick={async () => {
                      if (routedFile) {
                        // 1. Save file in local browser storage
                        await setPendingFile(routedFile);
                      }
                      setIsRouterOpen(false);
                      handleToolLaunch(opt.slug);
                      // 2. Redirect to tool workspace
                      window.location.href = `/tools/${opt.slug}`;
                    }}
                    className="group flex w-full items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-3.5 text-left transition-all hover:border-primary/60 hover:bg-primary/10 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary group-hover:scale-105 transition-transform">
                        <OptionIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground group-hover:text-primary">
                            {opt.title}
                          </span>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Client-Side Privacy
              </span>
              <button
                onClick={() => setIsRouterOpen(false)}
                className="font-semibold text-muted-foreground hover:text-foreground underline"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}