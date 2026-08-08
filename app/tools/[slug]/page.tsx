import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import TrustBadgeBar from '@/components/trust-badge-bar';
import FaqSection from '@/components/faq-section';
import ToolCard from '@/components/tool-card';
import { getToolBySlug, getRelatedTools, tools } from '@/lib/tools';
import {
  CheckCircle2,
  Zap,
  Loader2,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Lock,
  FileCheck,
  Cpu,
  type LucideIcon,
} from 'lucide-react';
import * as Icons from 'lucide-react';

// Dynamic Tool Component Imports
const ImageResizer = dynamic(() => import('@/components/image-resizer'), {
  ssr: false,
  loading: () => <Loader />,
});
const ImageToPdfConverter = dynamic(() => import('@/components/document/image-to-pdf'), {
  ssr: false,
  loading: () => <Loader />,
});
const JpgToPngConverter = dynamic(() => import('@/components/document/jpg-to-png'), {
  ssr: false,
  loading: () => <Loader />,
});
const PdfCompressor = dynamic(() => import('@/components/document/pdf-compressor'), {
  ssr: false,
  loading: () => <Loader />,
});
const PdfMerger = dynamic(() => import('@/components/document/pdf-merger'), {
  ssr: false,
  loading: () => <Loader />,
});
const PdfSplit = dynamic(() => import('@/components/document/pdf-split'), {
  ssr: false,
  loading: () => <Loader />,
});
const MakeItLookScanned = dynamic(() => import('@/components/document/make-it-look-scanned'), {
  ssr: false,
  loading: () => <Loader />,
});
const QrGenerator = dynamic(() => import('@/components/document/qr-generator'), {
  ssr: false,
  loading: () => <Loader />,
});
const PomodoroTimer = dynamic(() => import('@/components/productivity/pomodoro-timer'), {
  ssr: false,
  loading: () => <Loader />,
});
const Stopwatch = dynamic(() => import('@/components/productivity/stopwatch'), {
  ssr: false,
  loading: () => <Loader />,
});
const MarkPercentageCalculator = dynamic(() => import('@/components/calculators/mark-percentage-calculator'), {
  ssr: false,
  loading: () => <Loader />,
});
const AgeCalculator = dynamic(() => import('@/components/calculators/age-calculator'), {
  ssr: false,
  loading: () => <Loader />,
});
const CgpaConverter = dynamic(() => import('@/components/calculators/cgpa-converter'), {
  ssr: false,
  loading: () => <Loader />,
});
const WordCounter = dynamic(() => import('@/components/calculators/word-counter'), {
  ssr: false,
  loading: () => <Loader />,
});
const PercentageCalculator = dynamic(() => import('@/components/calculators/percentage-calculator'), {
  ssr: false,
  loading: () => <Loader />,
});
const EmiCalculator = dynamic(() => import('@/components/calculators/emi-calculator'), {
  ssr: false,
  loading: () => <Loader />,
});
const CaseConverter = dynamic(() => import('@/components/calculators/case-converter'), {
  ssr: false,
  loading: () => <Loader />,
});
const UnitConverter = dynamic(() => import('@/components/calculators/unit-converter'), {
  ssr: false,
  loading: () => <Loader />,
});
const StandardCalculator = dynamic(() => import('@/components/calculators/standard-calculator'), {
  ssr: false,
  loading: () => <Loader />,
});
const DocScannerEnhancer = dynamic(() => import('@/components/document/doc-scanner-enhancer'), {
  ssr: false,
  loading: () => <Loader />,
});
const PdfWatermarkStudio = dynamic(() => import('@/components/document/pdf-watermark-studio'), {
  ssr: false,
  loading: () => <Loader />,
});
const PdfWhiteoutRedact = dynamic(() => import('@/components/document/pdf-whiteout-redact'), {
  ssr: false,
  loading: () => <Loader />,
});
const ClientSidePdfCompressor = dynamic(() => import('@/components/document/client-side-pdf-compressor'), {
  ssr: false,
  loading: () => <Loader />,
});
const FancyUnicodeFontGenerator = dynamic(() => import('@/components/creator/fancy-unicode-font-generator'), {
  ssr: false,
  loading: () => <Loader />,
});
const AnimatedTextGifMaker = dynamic(() => import('@/components/creator/animated-text-gif-maker'), {
  ssr: false,
  loading: () => <Loader />,
});
const ThreeDGradientTextStyler = dynamic(() => import('@/components/creator/three-d-gradient-text-styler'), {
  ssr: false,
  loading: () => <Loader />,
});
const ExifDataRemover = dynamic(() => import('@/components/dev/exif-data-remover'), {
  ssr: false,
  loading: () => <Loader />,
});
const WebpToJpgPngConverter = dynamic(() => import('@/components/dev/webp-to-jpg-png-converter'), {
  ssr: false,
  loading: () => <Loader />,
});
const AspectRatioFramingCalculator = dynamic(() => import('@/components/dev/aspect-ratio-framing-calculator'), {
  ssr: false,
  loading: () => <Loader />,
});

function Loader() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="text-xs font-semibold text-muted-foreground animate-pulse">
        Initializing Client Engine...
      </span>
    </div>
  );
}

// Dynamic Contextual Trust Badges per Category (Eliminates AI Copy Repetition)
const categoryTrustBadges: Record<
  string,
  Array<{ icon: LucideIcon; label: string; color: string }>
> = {
  'Exam Photo Tools': [
    { icon: FileCheck, label: 'Official 2026 Portal Guidelines', color: 'text-emerald-600 dark:text-emerald-400' },
    { icon: Lock, label: 'Photos processed in browser memory', color: 'text-blue-600 dark:text-blue-400' },
    { icon: CheckCircle2, label: 'Guaranteed recruitment portal acceptance', color: 'text-teal-600 dark:text-teal-400' },
  ],
  'Document Utilities': [
    { icon: Lock, label: 'Document text stays strictly in browser RAM', color: 'text-rose-600 dark:text-rose-400' },
    { icon: Cpu, label: 'WebAssembly & Canvas hardware execution', color: 'text-amber-600 dark:text-amber-400' },
    { icon: ShieldCheck, label: 'Zero server uploads or file logging', color: 'text-emerald-600 dark:text-emerald-400' },
  ],
  'Calculators': [
    { icon: CheckCircle2, label: '100% offline instant calculation', color: 'text-blue-600 dark:text-blue-400' },
    { icon: Lock, label: 'No financial or eligibility data saved', color: 'text-indigo-600 dark:text-indigo-400' },
    { icon: Zap, label: 'Precision Indian formula conversion', color: 'text-cyan-600 dark:text-cyan-400' },
  ],
  'Productivity & Focus': [
    { icon: Zap, label: 'Zero background battery drain', color: 'text-amber-600 dark:text-amber-400' },
    { icon: CheckCircle2, label: 'Local session tracking', color: 'text-emerald-600 dark:text-emerald-400' },
    { icon: Lock, label: '100% private study timer', color: 'text-blue-600 dark:text-blue-400' },
  ],
  'Creator Studio': [
    { icon: Sparkles, label: 'High-DPI vector & canvas rendering', color: 'text-fuchsia-600 dark:text-fuchsia-400' },
    { icon: CheckCircle2, label: 'Instant 1-click clipboard export', color: 'text-purple-600 dark:text-purple-400' },
    { icon: Lock, label: '100% private browser generation', color: 'text-emerald-600 dark:text-emerald-400' },
  ],
  'Image & Dev Utilities': [
    { icon: ShieldCheck, label: 'Strips GPS & EXIF camera metadata locally', color: 'text-cyan-600 dark:text-cyan-400' },
    { icon: Zap, label: 'Lossless browser canvas encoding', color: 'text-blue-600 dark:text-blue-400' },
    { icon: Lock, label: 'Zero network requests or telemetry', color: 'text-indigo-600 dark:text-indigo-400' },
  ],
};

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const tool = getToolBySlug(params.slug);
  if (!tool) return { title: 'Tool not found' };

  const title = `Free ${tool.title} — FormatDock`;
  const description = tool.description;
  const url = `https://formatdocks.vercel.app/tools/${tool.slug}`;

  return {
    title,
    description,
    keywords: [...tool.tags, 'client-side', 'free', 'online', 'no upload', 'FormatDock'],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'FormatDock',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

const SITE_URL = 'https://formatdocks.vercel.app';

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const IconComp = (Icons as unknown as Record<string, LucideIcon>)[tool.icon] ?? Icons.Wrench;
  const relatedTools = getRelatedTools ? getRelatedTools(tool.slug) : [];
  const badges = categoryTrustBadges[tool.group] ?? categoryTrustBadges['Document Utilities'];

  const toolUrl = `${SITE_URL}/tools/${tool.slug}`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url: toolUrl,
    description: tool.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: tool.tags,
    isAccessibleForFree: true,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: `${SITE_URL}/tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.title,
        item: toolUrl,
      },
    ],
  };

  const faqSchema =
    tool.faqs && tool.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: tool.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a,
            },
          })),
        }
      : null;

  const schemas = [webAppSchema, breadcrumbSchema, faqSchema].filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-background/80 text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <SiteHeader />
      <TrustBadgeBar />

      <main className="flex-1">
        {/* Workspace Hero Header */}
        <div className="relative overflow-hidden border-b border-border/60 bg-card/40 backdrop-blur-md py-10 sm:py-12">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[250px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <nav className="mb-4 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-primary flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Home
              </Link>
              <span>/</span>
              <Link href="/tools" className="transition-colors hover:text-primary">
                Tools
              </Link>
              <span>/</span>
              <span className="text-foreground">{tool.title}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="squircle-glow flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-600 text-white shadow-lg border border-white/20">
                <IconComp className="h-8 w-8 stroke-[2.2] drop-shadow-md" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-primary/20">
                    {tool.group}
                  </span>
                  {tool.preset && (
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Official Exam Spec
                    </span>
                  )}
                </div>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  {tool.title}
                </h1>
                <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            </div>

            {/* Contextual Category Trust Badges */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-muted-foreground pt-4 border-t border-border/40">
              {badges.map((b, i) => {
                const BIcon = b.icon;
                return (
                  <span key={i} className="flex items-center gap-1.5">
                    <BIcon className={`h-4 w-4 ${b.color}`} />
                    <span>{b.label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hero Tool Interactive Workspace Container */}
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Centerpiece: Official Specification Badge Card (Exam Resizers Only) */}
          {tool.preset && (
            <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-4 backdrop-blur-md specular-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Target Recruitment Portal Requirement
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs font-bold">
                  <span className="rounded-lg bg-background/80 px-2.5 py-1 border border-border/80 shadow-sm">
                    📏 Dimensions: <strong className="text-foreground">{tool.preset.width} × {tool.preset.height} px</strong>
                  </span>
                  <span className="rounded-lg bg-background/80 px-2.5 py-1 border border-border/80 shadow-sm">
                    📦 File Size: <strong className="text-foreground">{tool.preset.minKb ? `${tool.preset.minKb}–` : '≤ '}{tool.preset.maxKb} KB</strong>
                  </span>
                  <span className="rounded-lg bg-background/80 px-2.5 py-1 border border-border/80 shadow-sm">
                    🖼️ Format: <strong className="text-foreground">{tool.preset.format.toUpperCase()}</strong>
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="glass-panel relative rounded-3xl border border-border/80 p-4 sm:p-6 shadow-2xl overflow-hidden bg-card/70 specular-card">
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            
            {/* Dynamic Tool Component Render */}
            <div className="min-h-[300px]">
              {tool.category === 'photo' && tool.preset && (
                <ImageResizer preset={tool.preset} toolSlug={tool.slug} />
              )}
              {tool.slug === 'image-to-pdf' && <ImageToPdfConverter />}
              {tool.slug === 'jpg-to-png' && <JpgToPngConverter />}
              {tool.slug === 'pdf-compressor' && <PdfCompressor />}
              {tool.slug === 'pdf-merger' && <PdfMerger />}
              {tool.slug === 'pdf-split' && <PdfSplit />}
              {tool.slug === 'make-it-look-scanned' && <MakeItLookScanned />}
              {tool.slug === 'qr-generator' && <QrGenerator />}
              {tool.slug === 'pomodoro' && <PomodoroTimer />}
              {tool.slug === 'stopwatch' && <Stopwatch />}
              {tool.slug === 'mark-percentage-calculator' && (
                <MarkPercentageCalculator />
              )}
              {tool.slug === 'age-calculator' && <AgeCalculator />}
              {tool.slug === 'cgpa-to-percentage' && <CgpaConverter />}
              {tool.slug === 'word-counter' && <WordCounter />}
              {tool.slug === 'percentage-calculator' && <PercentageCalculator />}
              {tool.slug === 'emi-calculator' && <EmiCalculator />}
              {tool.slug === 'case-converter' && <CaseConverter />}
              {tool.slug === 'unit-converter' && <UnitConverter />}
              {tool.slug === 'standard-calculator' && <StandardCalculator />}
              {tool.slug === 'doc-scanner-pdf-enhancer' && <DocScannerEnhancer />}
              {tool.slug === 'pdf-watermark-studio' && <PdfWatermarkStudio />}
              {tool.slug === 'pdf-whiteout-redact' && <PdfWhiteoutRedact />}
              {tool.slug === 'client-side-pdf-compressor' && <ClientSidePdfCompressor />}
              {tool.slug === 'fancy-unicode-font-generator' && <FancyUnicodeFontGenerator />}
              {tool.slug === 'animated-text-gif-maker' && <AnimatedTextGifMaker />}
              {tool.slug === '3d-gradient-text-styler' && <ThreeDGradientTextStyler />}
              {tool.slug === 'exif-data-remover' && <ExifDataRemover />}
              {tool.slug === 'webp-to-jpg-png-converter' && <WebpToJpgPngConverter />}
              {tool.slug === 'aspect-ratio-framing-calculator' && <AspectRatioFramingCalculator />}
            </div>
          </div>

          {/* Smart Connected Next Steps */}
          {relatedTools && relatedTools.length > 0 && (
            <div className="mt-12 rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <h2 className="text-base font-bold text-foreground">Smart Next Steps</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Recommended tools commonly needed alongside {tool.shortTitle}
                  </p>
                </div>
                <Link
                  href="/tools"
                  className="text-xs font-semibold text-primary hover:underline transition-colors"
                >
                  View All Tools →
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {relatedTools.map((relTool) => (
                  <ToolCard key={relTool.slug} tool={relTool} />
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {tool.faqs && (
            <div className="mt-12">
              <FaqSection items={tool.faqs} />
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}