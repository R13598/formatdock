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
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';

const Loader = () => (
  <div className="flex h-64 items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Unified dynamic component imports with safe fallback handling
const ImageResizer = dynamic(() => import('@/components/image-resizer'), { ssr: false, loading: () => <Loader /> });
const ImageToPdfConverter = dynamic(() => import('@/components/document/image-to-pdf'), { ssr: false, loading: () => <Loader /> });
const JpgToPngConverter = dynamic(() => import('@/components/document/jpg-to-png'), { ssr: false, loading: () => <Loader /> });
const PdfCompressor = dynamic(() => import('@/components/document/pdf-compressor'), { ssr: false, loading: () => <Loader /> });
const PdfMerger = dynamic(() => import('@/components/document/pdf-merger'), { ssr: false, loading: () => <Loader /> });
const PdfSplit = dynamic(() => import('@/components/document/pdf-split'), { ssr: false, loading: () => <Loader /> });
const QrGenerator = dynamic(() => import('@/components/document/qr-generator'), { ssr: false, loading: () => <Loader /> });
const MakeItLookScanned = dynamic(() => import('@/components/document/make-it-look-scanned'), { ssr: false, loading: () => <Loader /> });
const DocScannerEnhancer = dynamic(() => import('@/components/document/doc-scanner-enhancer'), { ssr: false, loading: () => <Loader /> });
const PdfWatermarkStudio = dynamic(() => import('@/components/document/pdf-watermark-studio'), { ssr: false, loading: () => <Loader /> });
const PdfWhiteoutRedact = dynamic(() => import('@/components/document/pdf-whiteout-redact'), { ssr: false, loading: () => <Loader /> });

const AgeCalculator = dynamic(() => import('@/components/calculators/age-calculator'), { ssr: false, loading: () => <Loader /> });
const WordCounter = dynamic(() => import('@/components/calculators/word-counter'), { ssr: false, loading: () => <Loader /> });
const PercentageCalculator = dynamic(() => import('@/components/calculators/percentage-calculator'), { ssr: false, loading: () => <Loader /> });
const CaseConverter = dynamic(() => import('@/components/calculators/case-converter'), { ssr: false, loading: () => <Loader /> });
const EmiCalculator = dynamic(() => import('@/components/calculators/emi-calculator'), { ssr: false, loading: () => <Loader /> });
const StandardCalculator = dynamic(() => import('@/components/calculators/standard-calculator'), { ssr: false, loading: () => <Loader /> });
const UnitConverter = dynamic(() => import('@/components/calculators/unit-converter'), { ssr: false, loading: () => <Loader /> });
const CgpaConverter = dynamic(() => import('@/components/calculators/cgpa-converter'), { ssr: false, loading: () => <Loader /> });
const MarkPercentageCalculator = dynamic(() => import('@/components/calculators/mark-percentage-calculator'), { ssr: false, loading: () => <Loader /> });

const PomodoroTimer = dynamic(() => import('@/components/productivity/pomodoro-timer'), { ssr: false, loading: () => <Loader /> });
const Stopwatch = dynamic(() => import('@/components/productivity/stopwatch'), { ssr: false, loading: () => <Loader /> });

const FancyUnicodeFontGenerator = dynamic(() => import('@/components/creator/fancy-unicode-font-generator'), { ssr: false, loading: () => <Loader /> });
const AnimatedTextGifMaker = dynamic(() => import('@/components/creator/animated-text-gif-maker'), { ssr: false, loading: () => <Loader /> });
const ThreeDGradientTextStyler = dynamic(() => import('@/components/creator/three-d-gradient-text-styler'), { ssr: false, loading: () => <Loader /> });
const AIContentSummarizer = dynamic(() => import('@/components/creator/ai-content-summarizer'), { ssr: false, loading: () => <Loader /> });
const AIMetaDescriptionGenerator = dynamic(() => import('@/components/creator/ai-meta-description-generator'), { ssr: false, loading: () => <Loader /> });
const AITitleGenerator = dynamic(() => import('@/components/creator/ai-title-generator'), { ssr: false, loading: () => <Loader /> });

const AspectRatioFramingCalculator = dynamic(() => import('@/components/dev/aspect-ratio-framing-calculator'), { ssr: false, loading: () => <Loader /> });
const ExifDataRemover = dynamic(() => import('@/components/dev/exif-data-remover'), { ssr: false, loading: () => <Loader /> });
const WebpToJpgPngConverter = dynamic(() => import('@/components/dev/webp-to-jpg-png-converter'), { ssr: false, loading: () => <Loader /> });

const componentMap: Record<string, React.ComponentType<any>> = {
  'image-resizer': ImageResizer,
  'upsc-photo-resizer': ImageResizer,
  'ssc-image-compressor': ImageResizer,
  'ctet-photo-format': ImageResizer,
  'bank-railway-photo-cropper': ImageResizer,
  'gate-neet-jee-photo-resizer': ImageResizer,
  'passport-visa-photo-maker': ImageResizer,
  'signature-resizer-compressor': ImageResizer,
  'image-to-pdf': ImageToPdfConverter,
  'jpg-to-png': JpgToPngConverter,
  'pdf-compressor': PdfCompressor,
  'pdf-merger': PdfMerger,
  'pdf-split': PdfSplit,
  'qr-generator': QrGenerator,
  'make-it-look-scanned': MakeItLookScanned,
  'doc-scanner-enhancer': DocScannerEnhancer,
  'pdf-watermark-studio': PdfWatermarkStudio,
  'pdf-whiteout-redact': PdfWhiteoutRedact,
  'age-calculator': AgeCalculator,
  'word-counter': WordCounter,
  'percentage-calculator': PercentageCalculator,
  'case-converter': CaseConverter,
  'emi-calculator': EmiCalculator,
  'standard-calculator': StandardCalculator,
  'unit-converter': UnitConverter,
  'cgpa-converter': CgpaConverter,
  'mark-percentage-calculator': MarkPercentageCalculator,
  'pomodoro-timer': PomodoroTimer,
  'stopwatch': Stopwatch,
  'fancy-unicode-font-generator': FancyUnicodeFontGenerator,
  'animated-text-gif-maker': AnimatedTextGifMaker,
  'three-d-gradient-text-styler': ThreeDGradientTextStyler,
  'ai-content-summarizer': AIContentSummarizer,
  'ai-meta-description-generator': AIMetaDescriptionGenerator,
  'ai-title-generator': AITitleGenerator,
  'aspect-ratio-framing-calculator': AspectRatioFramingCalculator,
  'exif-data-remover': ExifDataRemover,
  'webp-to-jpg-png-converter': WebpToJpgPngConverter,
};

export function generateStaticParams(): { slug: string }[] {
  return tools.map((tool) => ({
    slug: String(tool.slug),
  }));
}

type PageParams = { slug: string };

type PageProps = {
  params: Promise<PageParams> | PageParams;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    return { title: 'Tool Not Found — FormatDock' };
  }

  return {
    title: `${tool.title} — FormatDock`,
    description: tool.description,
  };
}

export default async function ToolPage(props: PageProps) {
  const params = await props.params;
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  // Safe Fallback: defaults to ImageResizer if slug is missing from componentMap
  const ToolComponent = componentMap[tool.slug] || ImageResizer;
  const relatedTools = getRelatedTools(tool.slug);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <TrustBadgeBar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to All Tools
          </Link>

          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {tool.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-6 backdrop-blur-sm">
            <ToolComponent preset={tool.preset} toolSlug={tool.slug} />
          </div>

          {relatedTools && relatedTools.length > 0 && (
            <div className="mt-12 rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <h2 className="text-base font-bold text-foreground">Smart Next Steps</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Recommended tools commonly needed alongside {tool.shortTitle || tool.title}
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