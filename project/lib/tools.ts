export interface ToolPreset {
  width: number;
  height: number;
  maxKb: number;
  minKb: number;
  format: 'jpg' | 'png';
  bg?: string;
}

export interface FaqItem {
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
}

export interface Tool {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  category: 'creator' | 'dev' | 'document' | 'calculators' | 'productivity';
  group: string;
  icon: string;
  badge?: string;
  popular?: boolean;
  tags: string[];
  preset?: ToolPreset;
  faqs?: FaqItem[];
}

export const toolGroups = [
  'Exam Photo Tools',
  'Document Utilities',
  'Calculators',
  'Productivity & Focus',
  'Creator Studio',
  'Image & Dev Utilities',
] as const;

export type ToolGroup = (typeof toolGroups)[number];

export const TOOLS: Tool[] = [
  // --------------------------------------------------------------------------
  // EXAM & PHOTO RESIZERS
  // --------------------------------------------------------------------------
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    title: 'Universal Image Resizer & Compressor',
    shortTitle: 'Image Resizer',
    description: 'Resize, crop, and compress images to exact dimensions and file size limits.',
    category: 'document',
    group: 'Document Utilities',
    icon: 'Maximize',
    badge: '🛡️ 100% Local',
    popular: true,
    tags: ['image', 'resizer', 'crop', 'compress', 'photo'],
    preset: { width: 800, height: 600, minKb: 5, maxKb: 500, format: 'jpg' },
  },
  {
    id: 'upsc-photo-resizer',
    slug: 'upsc-photo-resizer',
    title: 'UPSC Photo & Signature Resizer',
    shortTitle: 'UPSC Resizer',
    description: 'Resize and compress photo to UPSC specifications: 350×350 px, 20–300 KB, JPG format.',
    category: 'document',
    group: 'Exam Photo Tools',
    icon: 'GraduationCap',
    badge: '🛡️ 100% Local',
    popular: true,
    tags: ['upsc', 'photo', 'signature', 'resizer', 'passport', 'exam'],
    preset: { width: 350, height: 350, minKb: 20, maxKb: 300, format: 'jpg' },
  },
  {
    id: 'ssc-image-compressor',
    slug: 'ssc-image-compressor',
    title: 'SSC Image & Signature Compressor',
    shortTitle: 'SSC Compressor',
    description: 'Compress your photo to SSC requirements: 200×230 px, 10–20 KB, JPG format.',
    category: 'document',
    group: 'Exam Photo Tools',
    icon: 'FileText',
    badge: '🛡️ 100% Local',
    popular: true,
    tags: ['ssc', 'photo', 'signature', 'compressor', 'exam'],
    preset: { width: 200, height: 230, minKb: 10, maxKb: 20, format: 'jpg' },
  },
  {
    id: 'ctet-photo-format',
    slug: 'ctet-photo-format',
    title: 'CTET Photo & Document Formatter',
    shortTitle: 'CTET Formatter',
    description: 'Format your photo for CTET: 300×300 px, 10–300 KB, JPG format.',
    category: 'document',
    group: 'Exam Photo Tools',
    icon: 'FileCheck',
    badge: '🛡️ 100% Local',
    tags: ['ctet', 'photo', 'formatter', 'exam'],
    preset: { width: 300, height: 300, minKb: 10, maxKb: 300, format: 'jpg' },
  },
  {
    id: 'bank-railway-photo-cropper',
    slug: 'bank-railway-photo-cropper',
    title: 'Bank & Railway Exam Photo Cropper',
    shortTitle: 'Bank & Railway Cropper',
    description: 'Crop and compress your photo for IBPS, SBI, RBI, and RRB exams.',
    category: 'document',
    group: 'Exam Photo Tools',
    icon: 'Scissors',
    badge: '🛡️ 100% Local',
    tags: ['bank', 'ibps', 'sbi', 'rrb', 'railway', 'cropper', 'exam'],
    preset: { width: 200, height: 230, minKb: 20, maxKb: 50, format: 'jpg' },
  },
  {
    id: 'gate-neet-jee-photo-resizer',
    slug: 'gate-neet-jee-photo-resizer',
    title: 'GATE, NEET & JEE Photo Resizer',
    shortTitle: 'GATE/NEET Resizer',
    description: 'Resize and format passport photos and signatures for engineering and medical entrances.',
    category: 'document',
    group: 'Exam Photo Tools',
    icon: 'Layers',
    badge: '🛡️ 100% Local',
    tags: ['gate', 'neet', 'jee', 'photo', 'resizer', 'exam'],
    preset: { width: 350, height: 450, minKb: 10, maxKb: 200, format: 'jpg' },
  },
  {
    id: 'passport-visa-photo-maker',
    slug: 'passport-visa-photo-maker',
    title: 'Passport & Visa Photo Maker',
    shortTitle: 'Passport Maker',
    description: 'Crop photos to official passport and visa photo dimensions with white backgrounds.',
    category: 'document',
    group: 'Exam Photo Tools',
    icon: 'Image',
    badge: '🛡️ 100% Local',
    tags: ['passport', 'visa', 'photo', 'maker', 'official'],
    preset: { width: 600, height: 600, minKb: 20, maxKb: 240, format: 'jpg', bg: '#ffffff' },
  },
  {
    id: 'signature-resizer-compressor',
    slug: 'signature-resizer-compressor',
    title: 'Signature Resizer & Compressor',
    shortTitle: 'Signature Resizer',
    description: 'Compress scanned candidate signatures to exact KB limits for application forms.',
    category: 'document',
    group: 'Exam Photo Tools',
    icon: 'FileImage',
    badge: '🛡️ 100% Local',
    tags: ['signature', 'resizer', 'compressor', 'form'],
    preset: { width: 140, height: 60, minKb: 10, maxKb: 20, format: 'jpg' },
  },

  // --------------------------------------------------------------------------
  // CREATOR & AI SUITE
  // --------------------------------------------------------------------------
  {
    id: 'ai-content-summarizer',
    slug: 'ai-content-summarizer',
    title: 'AI Content Summarizer',
    shortTitle: 'Content Summarizer',
    description: 'Summarize articles, PDFs, and notes instantly using high-speed Edge AI.',
    category: 'creator',
    group: 'Creator Studio',
    icon: 'FileText',
    badge: '⚡ AI Powered',
    popular: true,
    tags: ['ai', 'summarize', 'notes', 'content'],
  },
  {
    id: 'ai-meta-description-generator',
    slug: 'ai-meta-description-generator',
    title: 'AI Meta Description Generator',
    shortTitle: 'Meta Description Generator',
    description: 'Generate SEO-optimized meta descriptions tailored for maximum click-through rates.',
    category: 'creator',
    group: 'Creator Studio',
    icon: 'Search',
    badge: '⚡ AI Powered',
    tags: ['ai', 'seo', 'meta', 'description'],
  },
  {
    id: 'ai-title-generator',
    slug: 'ai-title-generator',
    title: 'AI Title Generator',
    shortTitle: 'Title Generator',
    description: 'Create high-converting blog headlines, video titles, and social captions.',
    category: 'creator',
    group: 'Creator Studio',
    icon: 'Sparkles',
    badge: '⚡ AI Powered',
    tags: ['ai', 'title', 'headline', 'generator'],
  },
  {
    id: 'animated-text-gif-maker',
    slug: 'animated-text-gif-maker',
    title: 'Animated Text GIF Maker',
    shortTitle: 'Text GIF Maker',
    description: 'Create custom typewriter and pulse animated text GIFs directly in your browser.',
    category: 'creator',
    group: 'Creator Studio',
    icon: 'Film',
    badge: '🛡️ 100% Local',
    tags: ['gif', 'text', 'animated', 'maker'],
  },
  {
    id: 'fancy-unicode-font-generator',
    slug: 'fancy-unicode-font-generator',
    title: 'Fancy Unicode Font Generator',
    shortTitle: 'Font Generator',
    description: 'Convert standard text into 30+ aesthetic Unicode styles for Instagram & social bios.',
    category: 'creator',
    group: 'Creator Studio',
    icon: 'Type',
    badge: '🛡️ 100% Local',
    popular: true,
    tags: ['font', 'unicode', 'fancy', 'instagram', 'bio'],
  },
  {
    id: 'three-d-gradient-text-styler',
    slug: 'three-d-gradient-text-styler',
    title: '3D Gradient Text Styler',
    shortTitle: '3D Text Styler',
    description: 'Render bold text with custom 3D gradient fills and transparent PNG exports.',
    category: 'creator',
    group: 'Creator Studio',
    icon: 'Layers',
    badge: '🛡️ 100% Local',
    tags: ['3d', 'gradient', 'text', 'styler'],
  },

  // --------------------------------------------------------------------------
  // DEVELOPER & UTILITY SUITE
  // --------------------------------------------------------------------------
  {
    id: 'aspect-ratio-framing-calculator',
    slug: 'aspect-ratio-framing-calculator',
    title: 'Aspect Ratio & Framing Calculator',
    shortTitle: 'Aspect Ratio Calculator',
    description: 'Calculate framing dimensions and preview live aspect ratios for responsive media.',
    category: 'dev',
    group: 'Image & Dev Utilities',
    icon: 'Maximize',
    badge: '🛡️ 100% Local',
    tags: ['aspect', 'ratio', 'framing', 'calculator'],
  },
  {
    id: 'exif-data-remover',
    slug: 'exif-data-remover',
    title: 'EXIF Data Remover',
    shortTitle: 'EXIF Remover',
    description: 'Strip GPS, device, and camera metadata from JPEG photos before sharing online.',
    category: 'dev',
    group: 'Image & Dev Utilities',
    icon: 'ShieldOff',
    badge: '🛡️ 100% Local',
    popular: true,
    tags: ['exif', 'metadata', 'privacy', 'gps', 'photo'],
  },
  {
    id: 'webp-to-jpg-png-converter',
    slug: 'webp-to-jpg-png-converter',
    title: 'WebP to JPG/PNG Converter',
    shortTitle: 'WebP Converter',
    description: 'Convert WebP images back into widely compatible JPG or transparent PNG formats.',
    category: 'dev',
    group: 'Image & Dev Utilities',
    icon: 'Image',
    badge: '🛡️ 100% Local',
    tags: ['webp', 'jpg', 'png', 'converter'],
  },

  // --------------------------------------------------------------------------
  // DOCUMENT & PDF SUITE
  // --------------------------------------------------------------------------
  {
    id: 'pdf-compressor',
    slug: 'pdf-compressor',
    title: 'Client-Side PDF Compressor',
    shortTitle: 'PDF Compressor',
    description: 'Shrink PDF file sizes instantly in the browser without uploading to any server.',
    category: 'document',
    group: 'Document Utilities',
    icon: 'FileArchive',
    badge: '🛡️ 100% Local',
    popular: true,
    tags: ['pdf', 'compress', 'shrink', 'document'],
  },
  {
    id: 'doc-scanner-enhancer',
    slug: 'doc-scanner-enhancer',
    title: 'Doc Scanner & Enhancer',
    shortTitle: 'Doc Scanner',
    description: 'Enhance photos of paper documents with high-contrast document scanning filters.',
    category: 'document',
    group: 'Document Utilities',
    icon: 'FileCheck',
    badge: '🛡️ 100% Local',
    tags: ['doc', 'scanner', 'enhance', 'contrast', 'pdf'],
  },
  {
    id: 'image-to-pdf',
    slug: 'image-to-pdf',
    title: 'Image to PDF Converter',
    shortTitle: 'Image to PDF',
    description: 'Convert PNG, JPG, and WebP images into a cleanly compiled PDF document.',
    category: 'document',
    group: 'Document Utilities',
    icon: 'FileImage',
    badge: '🛡️ 100% Local',
    tags: ['image', 'pdf', 'convert', 'png', 'jpg'],
  },
  {
    id: 'jpg-to-png',
    slug: 'jpg-to-png',
    title: 'JPG to PNG Converter',
    shortTitle: 'JPG to PNG',
    description: 'Convert standard JPEG images to PNG format with alpha channel support.',
    category: 'document',
    group: 'Document Utilities',
    icon: 'ArrowRightLeft',
    badge: '🛡️ 100% Local',
    tags: ['jpg', 'png', 'convert'],
  },
  {
    id: 'make-it-look-scanned',
    slug: 'make-it-look-scanned',
    title: 'Make It Look Scanned',
    shortTitle: 'Scanned Effect',
    description: 'Apply scan distortion, slight noise, and tilt effects to digital PDFs/images.',
    category: 'document',
    group: 'Document Utilities',
    icon: 'Printer',
    badge: '🛡️ 100% Local',
    tags: ['scanned', 'effect', 'noise', 'pdf'],
  },
  {
    id: 'pdf-merger',
    slug: 'pdf-merger',
    title: 'PDF Merger',
    shortTitle: 'PDF Merger',
    description: 'Combine multiple PDF files into a single structured document.',
    category: 'document',
    group: 'Document Utilities',
    icon: 'Combine',
    badge: '🛡️ 100% Local',
    tags: ['pdf', 'merge', 'combine'],
  },
  {
    id: 'pdf-split',
    slug: 'pdf-split',
    title: 'PDF Splitter',
    shortTitle: 'PDF Splitter',
    description: 'Extract specific pages or break a PDF down into individual single pages.',
    category: 'document',
    group: 'Document Utilities',
    icon: 'Scissors',
    badge: '🛡️ 100% Local',
    tags: ['pdf', 'split', 'extract'],
  },
  {
    id: 'pdf-watermark-studio',
    slug: 'pdf-watermark-studio',
    title: 'PDF Watermark Studio',
    shortTitle: 'PDF Watermark',
    description: 'Overlay custom text or image watermarks onto PDF pages locally.',
    category: 'document',
    group: 'Document Utilities',
    icon: 'Stamp',
    badge: '🛡️ 100% Local',
    tags: ['pdf', 'watermark', 'stamp'],
  },
  {
    id: 'pdf-whiteout-redact',
    slug: 'pdf-whiteout-redact',
    title: 'PDF Redact & Whiteout',
    shortTitle: 'PDF Redact',
    description: 'Permanently whiteout sensitive text or redact private data on PDFs.',
    category: 'document',
    group: 'Document Utilities',
    icon: 'Eraser',
    badge: '🛡️ 100% Local',
    tags: ['pdf', 'redact', 'whiteout', 'privacy'],
  },
  {
    id: 'qr-generator',
    slug: 'qr-generator',
    title: 'QR Code Generator',
    shortTitle: 'QR Generator',
    description: 'Generate high-resolution SVG and PNG QR codes for URLs and text.',
    category: 'document',
    group: 'Document Utilities',
    icon: 'QrCode',
    badge: '🛡️ 100% Local',
    tags: ['qr', 'code', 'generator', 'svg'],
  },

  // --------------------------------------------------------------------------
  // CALCULATORS SUITE
  // --------------------------------------------------------------------------
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    title: 'Age Calculator',
    shortTitle: 'Age Calculator',
    description: 'Calculate exact age in years, months, weeks, and days from date of birth.',
    category: 'calculators',
    group: 'Calculators',
    icon: 'Calendar',
    tags: ['age', 'dob', 'calculator', 'date'],
  },
  {
    id: 'case-converter',
    slug: 'case-converter',
    title: 'Case Converter',
    shortTitle: 'Case Converter',
    description: 'Switch text between UPPERCASE, lowercase, Title Case, camelCase, and snake_case.',
    category: 'calculators',
    group: 'Calculators',
    icon: 'CaseSensitive',
    tags: ['text', 'case', 'converter', 'uppercase', 'lowercase'],
  },
  {
    id: 'cgpa-converter',
    slug: 'cgpa-converter',
    title: 'CGPA to Percentage Converter',
    shortTitle: 'CGPA Converter',
    description: 'Convert academic CGPA scores into standard percentage values instantly.',
    category: 'calculators',
    group: 'Calculators',
    icon: 'GraduationCap',
    tags: ['cgpa', 'percentage', 'converter', 'marks'],
  },
  {
    id: 'emi-calculator',
    slug: 'emi-calculator',
    title: 'Loan EMI Calculator',
    shortTitle: 'EMI Calculator',
    description: 'Calculate monthly loan EMI repayments with interest breakdowns.',
    category: 'calculators',
    group: 'Calculators',
    icon: 'Calculator',
    tags: ['emi', 'loan', 'finance', 'calculator'],
  },
  {
    id: 'mark-percentage-calculator',
    slug: 'mark-percentage-calculator',
    title: 'Mark Percentage Calculator',
    shortTitle: 'Marks Calculator',
    description: 'Compute total marks percentage across multiple subjects easily.',
    category: 'calculators',
    group: 'Calculators',
    icon: 'Percent',
    tags: ['marks', 'percentage', 'calculator', 'exam'],
  },
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    shortTitle: 'Percentage Calculator',
    description: 'Calculate standard percentage increases, decreases, and fractions.',
    category: 'calculators',
    group: 'Calculators',
    icon: 'Percent',
    tags: ['percentage', 'math', 'calculator'],
  },
  {
    id: 'standard-calculator',
    slug: 'standard-calculator',
    title: 'Standard Scientific Calculator',
    shortTitle: 'Calculator',
    description: 'Perform basic and advanced mathematical calculations.',
    category: 'calculators',
    group: 'Calculators',
    icon: 'Calculator',
    tags: ['calculator', 'scientific', 'math'],
  },
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    title: 'Universal Unit Converter',
    shortTitle: 'Unit Converter',
    description: 'Convert length, mass, temperature, area, and speed measurements.',
    category: 'calculators',
    group: 'Calculators',
    icon: 'Scale',
    tags: ['unit', 'converter', 'length', 'mass'],
  },
  {
    id: 'word-counter',
    slug: 'word-counter',
    title: 'Word & Character Counter',
    shortTitle: 'Word Counter',
    description: 'Track word counts, character counts, reading time, and sentence frequency.',
    category: 'calculators',
    group: 'Calculators',
    icon: 'Hash',
    tags: ['word', 'counter', 'character', 'reading'],
  },

  // --------------------------------------------------------------------------
  // PRODUCTIVITY SUITE
  // --------------------------------------------------------------------------
  {
    id: 'pomodoro-timer',
    slug: 'pomodoro-timer',
    title: 'Pomodoro Focus Timer',
    shortTitle: 'Pomodoro Timer',
    description: 'Customizable work/break timer intervals for structured study sessions.',
    category: 'productivity',
    group: 'Productivity & Focus',
    icon: 'Timer',
    tags: ['pomodoro', 'timer', 'focus', 'study'],
  },
  {
    id: 'stopwatch',
    slug: 'stopwatch',
    title: 'Digital Stopwatch',
    shortTitle: 'Stopwatch',
    description: 'High-precision lap timer and browser stopwatch tool.',
    category: 'productivity',
    group: 'Productivity & Focus',
    icon: 'Watch',
    tags: ['stopwatch', 'timer', 'lap'],
  },
];

// Aliases and helper functions placed securely at the bottom
export const tools = TOOLS;

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByGroup(group: string): Tool[] {
  return tools.filter((t) => t.group === group);
}

export function getRelatedTools(slug: string, limit = 3): Tool[] {
  const current = getToolBySlug(slug);
  if (!current) return tools.slice(0, limit);
  return tools
    .filter((t) => t.slug !== slug && t.category === current.category)
    .slice(0, limit);
}