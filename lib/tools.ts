export type ToolCategory =
  | 'photo'
  | 'document'
  | 'calculator'
  | 'productivity'
  | 'wallpaper'
  | 'creator'
  | 'dev';

export type ToolPreset = {
  width: number;
  height: number;
  minKb: number;
  maxKb: number;
  format: 'jpg' | 'png';
  bg?: string; // background fill for transparency
};

export type FaqItem = {
  q: string;
  a: string;
};

export type Tool = {
  slug: string;
  title: string;
  shortTitle: string;
  category: ToolCategory;
  group:
    | 'Exam Photo Tools'
    | 'Document Utilities'
    | 'Calculators'
    | 'Productivity & Focus'
    | 'Creator Studio'
    | 'Image & Dev Utilities';
  icon: string; // lucide icon name
  description: string;
  tags: string[];
  preset?: ToolPreset;
  faqs?: FaqItem[];
  relatedSlugs?: string[]; // Smart Next Steps connectivity
};

export const tools: Tool[] = [
  {
    slug: 'upsc-photo-resizer',
    title: 'UPSC Photo Resizer',
    shortTitle: 'UPSC Photo',
    category: 'photo',
    group: 'Exam Photo Tools',
    icon: 'GraduationCap',
    description:
      'Resize and compress your photo to UPSC specifications: 350×350 px, 20–300 KB, JPG format.',
    tags: ['UPSC', 'Photo', '350x350', 'JPG'],
    relatedSlugs: ['signature-resizer', 'image-to-pdf', 'exif-data-remover'],
    preset: {
      width: 350,
      height: 350,
      minKb: 20,
      maxKb: 300,
      format: 'jpg',
      bg: '#ffffff',
    },
    faqs: [
      {
        q: 'What are the official UPSC photo specifications?',
        a: 'The UPSC Online Recruitment Application (ORA) requires a recent passport-size photograph of maximum size 300 KB, with minimum dimensions of 350×350 pixels. The photo must be in JPG/JPEG format. The photograph should ideally be between 20 KB and 300 KB. A photograph smaller than 20 KB may be rejected by the system.',
      },
      {
        q: 'Why does the portal say "Photo size must be less than 300 KB"?',
        a: 'This error appears when your image file exceeds the 300 KB limit. Use the resizer above and the compression engine will automatically reduce the file below 300 KB while keeping the exact 350×350 px dimensions required by UPSC.',
      },
      {
        q: 'What should I do if my photo is smaller than 20 KB?',
        a: 'A photo below 20 KB is usually rejected because it has too little detail. Re-take a clear, well-lit passport photo with a camera or phone, upload it here, and the tool will produce a file within the required 20–300 KB range.',
      },
      {
        q: 'Is my photo uploaded to a server?',
        a: 'No. This tool runs entirely in your browser using the HTML5 Canvas API. Your photo never leaves your device, which makes it safe and instant.',
      },
      {
        q: 'What background and pose are required for the UPSC photo?',
        a: 'Use a plain light-colored (preferably white) background, looking straight into the camera with a neutral expression. Avoid glasses, hats, and shadows. The face should occupy roughly 70–80% of the photo.',
      },
    ],
  },
  {
    slug: 'ssc-image-compressor',
    title: 'SSC Image Compressor',
    shortTitle: 'SSC Photo',
    category: 'photo',
    group: 'Exam Photo Tools',
    icon: 'FileImage',
    description:
      'Compress your photo to SSC requirements: 200×230 px, 10–20 KB, JPG format.',
    tags: ['SSC', 'Photo', '200x230', 'JPG'],
    relatedSlugs: ['signature-resizer', 'image-to-pdf', 'exif-data-remover'],
    preset: {
      width: 200,
      height: 230,
      minKb: 10,
      maxKb: 20,
      format: 'jpg',
      bg: '#ffffff',
    },
    faqs: [
      {
        q: 'What are the official SSC photograph specifications?',
        a: 'For SSC (Staff Selection Commission) online applications the photograph must be between 10 KB and 20 KB, with dimensions of 200×230 pixels. The resolution should be at least 200×230 and the file must be in JPG/JPEG format.',
      },
      {
        q: 'Why is my SSC photo being rejected for being "below 10 KB"?',
        a: 'SSC requires the photo to be at least 10 KB. If your file is too small, the compression engine here will raise the JPEG quality until the output is within the 10–20 KB window automatically.',
      },
      {
        q: 'Why is my SSC photo being rejected for being "above 20 KB"?',
        a: 'SSC strictly limits the photo to 20 KB. The iterative compression loop above will reduce the JPEG quality step-by-step until the file is strictly below 20 KB while staying at or above 10 KB.',
      },
      {
        q: 'Does SSC require the same photo format for signature?',
        a: 'No. SSC signature specifications are different: 20–50 KB with dimensions between 1–3.5 cm width and 1–3 cm height, typically digitized at around 200×60 pixels. Use a dedicated signature tool for that.',
      },
      {
        q: 'Can I use a selfie for the SSC photo?',
        a: 'It is not recommended. SSC expects a formal passport-size photograph with a plain background. A selfie may be flagged during scrutiny. Take a proper passport photo and upload it here.',
      },
    ],
  },
  {
    slug: 'ctet-photo-format',
    title: 'CTET Photo Format',
    shortTitle: 'CTET Photo',
    category: 'photo',
    group: 'Exam Photo Tools',
    icon: 'BookOpenCheck',
    description:
      'Format your photo for CTET: 300×300 px, 10–300 KB, JPG format.',
    tags: ['CTET', 'Photo', '300x300', 'JPG'],
    relatedSlugs: ['signature-resizer', 'image-to-pdf', 'age-calculator'],
    preset: {
      width: 300,
      height: 300,
      minKb: 10,
      maxKb: 300,
      format: 'jpg',
      bg: '#ffffff',
    },
    faqs: [
      {
        q: 'What are the official CTET photograph specifications?',
        a: 'CTET (Central Teacher Eligibility Test) requires the candidate\'s photograph to be in JPG/JPEG format with dimensions of 300×300 pixels and a file size between 10 KB and 300 KB.',
      },
      {
        q: 'Why does the CTET portal show "Invalid Image"?',
        a: '"Invalid Image" usually means the file is the wrong format (e.g. PNG, HEIC, or WebP) or outside the allowed size range. The tool above outputs a standard JPG at exactly 300×300 px within the 10–300 KB range, which the CTET portal accepts.',
      },
      {
        q: 'My photo is a PNG — will CTET accept it?',
        a: 'No. CTET only accepts JPG/JPEG. Upload your PNG here and the tool will convert it to JPG and apply the correct compression automatically.',
      },
      {
        q: 'How do I fix a blurry CTET photo?',
        a: 'Start with a high-resolution original (at least 600×600). The resizer will downscale it cleanly to 300×300. If the original is already blurry, no compressor can restore detail — retake the photo.',
      },
      {
        q: 'Is it safe to upload my photo to this site?',
        a: 'Nothing is uploaded. The entire resizing and compression process happens in your browser. Your photo stays on your device.',
      },
    ],
  },
  {
    slug: 'bank-railway-cropper',
    title: 'Bank & Railway Photo Cropper',
    shortTitle: 'Bank/Railway',
    category: 'photo',
    group: 'Exam Photo Tools',
    icon: 'Crop',
    description:
      'Crop and compress your photo for IBPS, SBI and Railway exams: 200×230 px, 20–50 KB, JPG.',
    tags: ['Bank', 'Railway', 'IBPS', '200x230', 'JPG'],
    relatedSlugs: ['signature-resizer', 'mark-percentage-calculator', 'image-to-pdf'],
    preset: {
      width: 200,
      height: 230,
      minKb: 20,
      maxKb: 50,
      format: 'jpg',
      bg: '#ffffff',
    },
    faqs: [
      {
        q: 'What are the photo specifications for IBPS Bank exams?',
        a: 'IBPS requires a recent passport-size photograph of 200×230 pixels, file size between 20 KB and 50 KB, in JPG/JPEG format. The same dimensions are accepted by most SBI and other bank recruitment portals.',
      },
      {
        q: 'What are the photo specifications for Railway (RRB) exams?',
        a: 'RRB recruitment typically requires a passport-size colour photograph of 200×230 pixels with file size between 20 KB and 50 KB in JPG format. Check the specific notification for any minor variations.',
      },
      {
        q: 'Why is my bank exam photo rejected as "size too large"?',
        a: 'Your file is above 50 KB. The compression engine above will automatically reduce the quality in steps until the file is strictly below 50 KB while staying at or above 20 KB.',
      },
      {
        q: 'Why is my photo rejected as "size too small"?',
        a: 'Files below 20 KB are rejected because they lack enough detail. Upload a clearer, higher-resolution original and the tool will produce a file in the 20–50 KB range.',
      },
      {
        q: 'Can I crop my photo to the exact aspect ratio here?',
        a: 'Yes. The cropper above is pre-set to the 200×230 aspect ratio. Use the zoom and pan controls to position your face within the frame before downloading.',
      },
    ],
  },
  {
    slug: 'image-to-pdf',
    title: 'Image to PDF Converter',
    shortTitle: 'Image → PDF',
    category: 'document',
    group: 'Document Utilities',
    icon: 'FileText',
    description:
      'Convert JPG and PNG images into a single PDF document, client-side. No uploads.',
    tags: ['PDF', 'Convert', 'JPG', 'PNG'],
    relatedSlugs: ['pdf-compressor', 'pdf-merger', 'doc-scanner-pdf-enhancer'],
    faqs: [
      {
        q: 'Is the Image to PDF conversion done on a server?',
        a: 'No. The conversion happens entirely in your browser. Your images never leave your device.',
      },
      {
        q: 'Can I combine multiple images into one PDF?',
        a: 'Yes. Select multiple images and they will be combined into a single multi-page PDF in the order you select them.',
      },
      {
        q: 'What image formats are supported?',
        a: 'JPG, JPEG, and PNG are supported. For best quality, use high-resolution originals.',
      },
    ],
  },
  {
    slug: 'signature-resizer',
    title: 'Signature Resizer',
    shortTitle: 'Signature',
    category: 'photo',
    group: 'Exam Photo Tools',
    icon: 'PenLine',
    description:
      'Resize and compress your scanned signature for exam forms. Common spec: 200×60 px, 5–20 KB, JPG.',
    tags: ['Signature', '200x60', 'JPG'],
    relatedSlugs: ['upsc-photo-resizer', 'ssc-image-compressor', 'image-to-pdf'],
    preset: {
      width: 200,
      height: 60,
      minKb: 5,
      maxKb: 20,
      format: 'jpg',
      bg: '#ffffff',
    },
    faqs: [
      {
        q: 'What are the common signature specifications for Indian exam forms?',
        a: 'Most portals (UPSC, SSC, CTET, IBPS) require the signature to be in JPG format with dimensions around 200×60 pixels and file size between 5 KB and 20 KB. Always confirm against the specific exam notification.',
      },
      {
        q: 'Why is my signature being rejected as too small?',
        a: 'A signature below 5 KB is usually rejected. Sign on clean white paper with a black or blue ink pen, scan or photograph it in good light, and upload it here to reach the required size.',
      },
      {
        q: 'Why is my signature rejected as too large?',
        a: 'The compression loop will automatically reduce the file below 20 KB. If it is still rejected, make sure you are uploading the downloaded file, not the original.',
      },
      {
        q: 'Should I sign in black or blue ink?',
        a: 'Either is usually accepted, but black ink on white paper gives the best contrast and compresses cleanly. Avoid signing in pencil or red ink.',
      },
    ],
  },
  {
    slug: 'jpg-to-png',
    title: 'JPG to PNG Converter',
    shortTitle: 'JPG → PNG',
    category: 'document',
    group: 'Document Utilities',
    icon: 'FileImage',
    description:
      'Convert JPG/JPEG images to PNG format with transparency support, fully client-side.',
    tags: ['JPG', 'PNG', 'Convert'],
    relatedSlugs: ['webp-to-jpg-png-converter', 'image-to-pdf', 'exif-data-remover'],
    faqs: [
      {
        q: 'Does this converter upload my images?',
        a: 'No. Everything happens in your browser using the Canvas API.',
      },
      {
        q: 'Does the PNG keep transparency?',
        a: 'Yes. JPG sources do not have transparency, but the converter outputs a standard PNG. For transparent PNGs from a photo, use the background remover preset.',
      },
    ],
  },
  {
    slug: 'pdf-compressor',
    title: 'PDF Compressor',
    shortTitle: 'PDF → <200KB',
    category: 'document',
    group: 'Document Utilities',
    icon: 'FileArchive',
    description:
      'Compress a PDF file to under 200 KB (or a custom target) entirely in your browser. No uploads.',
    tags: ['PDF', 'Compress', '200KB'],
    relatedSlugs: ['pdf-merger', 'pdf-split', 'image-to-pdf'],
    faqs: [
      {
        q: 'Is my PDF uploaded to a server?',
        a: 'No. The compression runs entirely in your browser using the pdf-lib library. Your file never leaves your device.',
      },
      {
        q: 'How does PDF compression work here?',
        a: 'The compressor re-renders each page and applies image downsampling and quality reduction to embedded images until the output meets your target size.',
      },
    ],
  },
  {
    slug: 'pdf-merger',
    title: 'PDF Merger',
    shortTitle: 'Merge PDFs',
    category: 'document',
    group: 'Document Utilities',
    icon: 'Files',
    description:
      'Drag and drop multiple PDFs, reorder them, and merge into a single downloadable file — all client-side.',
    tags: ['PDF', 'Merge', 'Combine'],
    relatedSlugs: ['pdf-split', 'pdf-compressor', 'pdf-watermark-studio'],
    faqs: [
      {
        q: 'Are my PDFs uploaded anywhere?',
        a: 'No. Merging happens entirely in your browser with the pdf-lib library. Your files stay on your device.',
      },
      {
        q: 'Can I reorder pages before merging?',
        a: 'Yes. After adding PDFs you can drag them to reorder, then click Merge to produce a single combined PDF.',
      },
    ],
  },
  {
    slug: 'pdf-split',
    title: 'PDF Splitter',
    shortTitle: 'Split PDF',
    category: 'document',
    group: 'Document Utilities',
    icon: 'Scissors',
    description:
      'Visually select pages from a PDF and extract only the ones you need into a new file. See thumbnails, rotate, and delete pages — all client-side.',
    tags: ['PDF', 'Split', 'Extract', 'Pages'],
    relatedSlugs: ['pdf-merger', 'pdf-compressor', 'pdf-whiteout-redact'],
    faqs: [
      {
        q: 'Is my PDF uploaded to a server?',
        a: 'No. The entire splitting process runs in your browser using pdf-lib and pdf.js. Your file never leaves your device.',
      },
      {
        q: 'Can I select individual pages instead of a range?',
        a: 'Yes. Click on any page thumbnail to select or deselect it. You can pick any combination of pages — they do not need to be consecutive.',
      },
      {
        q: 'Can I rotate or delete pages before splitting?',
        a: 'Yes. Hover over any thumbnail to reveal rotate and delete buttons. Rotations are applied to the extracted PDF.',
      },
    ],
  },
  {
    slug: 'make-it-look-scanned',
    title: 'Make it Look Scanned',
    shortTitle: 'Scan Effect',
    category: 'document',
    group: 'Document Utilities',
    icon: 'ScanLine',
    description:
      'Transform a clean digital PDF into a realistic scanned document with grayscale, contrast boost, toner grain, and imperfect page tilt — all client-side.',
    tags: ['PDF', 'Scan', 'Grayscale', 'Effect'],
    relatedSlugs: ['doc-scanner-pdf-enhancer', 'pdf-compressor', 'pdf-watermark-studio'],
    faqs: [
      {
        q: 'Is my PDF uploaded anywhere?',
        a: 'No. The entire scanning effect is applied in your browser using Canvas filters and pdf-lib. Your file never leaves your device.',
      },
      {
        q: 'What effects are applied to make it look scanned?',
        a: 'Grayscale conversion, contrast boosting (100–150%), toner grain noise overlay with adjustable intensity, and a subtle random page tilt between -0.6° and +0.6° per page.',
      },
      {
        q: 'Can I adjust the intensity of the scan effect?',
        a: 'Yes. You can toggle grayscale on/off, adjust the contrast slider, choose between Low/Medium/High grain levels, and enable or disable the imperfect page tilt.',
      },
    ],
  },
  {
    slug: 'pomodoro',
    title: 'Pomodoro Timer',
    shortTitle: 'Pomodoro',
    category: 'productivity',
    group: 'Productivity & Focus',
    icon: 'Timer',
    description:
      'A clean 25/5 Pomodoro focus timer with a circular progress indicator and play/pause/reset controls.',
    tags: ['Pomodoro', 'Focus', 'Timer', 'Productivity'],
    relatedSlugs: ['stopwatch', 'word-counter', 'case-converter'],
  },
  {
    slug: 'stopwatch',
    title: 'Stopwatch & Flip Clock',
    shortTitle: 'Stopwatch',
    category: 'productivity',
    group: 'Productivity & Focus',
    icon: 'Watch',
    description:
      'A minimalist large-typography stopwatch with start/stop/lap controls. Perfect for timing study sessions.',
    tags: ['Stopwatch', 'Clock', 'Timer', 'Productivity'],
    relatedSlugs: ['pomodoro', 'word-counter', 'standard-calculator'],
  },
  {
    slug: 'qr-generator',
    title: 'QR Code Generator',
    shortTitle: 'QR Code',
    category: 'document',
    group: 'Document Utilities',
    icon: 'QrCode',
    description:
      'Convert any text or URL into a downloadable QR code. Customize size and download as PNG — all in your browser.',
    tags: ['QR', 'Code', 'Generator', 'Download'],
    relatedSlugs: ['fancy-unicode-font-generator', 'image-to-pdf', 'jpg-to-png'],
    faqs: [
      {
        q: 'Is my data sent to a server?',
        a: 'No. QR codes are generated entirely in your browser using a client-side library. Your text never leaves your device.',
      },
      {
        q: 'What format can I download?',
        a: 'QR codes can be downloaded as PNG images at your chosen size.',
      },
    ],
  },
  {
    slug: 'case-converter',
    title: 'Case Converter',
    shortTitle: 'Case Convert',
    category: 'calculator',
    group: 'Calculators',
    icon: 'CaseSensitive',
    description:
      'Instantly convert text to UPPERCASE, lowercase, Title Case, camelCase, and more. One-click copy to clipboard.',
    tags: ['Text', 'Case', 'Convert', 'Copy'],
    relatedSlugs: ['word-counter', 'fancy-unicode-font-generator', '3d-gradient-text-styler'],
    faqs: [
      {
        q: 'Is my text stored anywhere?',
        a: 'No. All conversion happens in your browser. Nothing is uploaded.',
      },
    ],
  },
  {
    slug: 'unit-converter',
    title: 'Unit Converter',
    shortTitle: 'Unit Convert',
    category: 'calculator',
    group: 'Calculators',
    icon: 'Ruler',
    description:
      'Convert between units of length, weight, temperature, and digital storage (MB, GB, TB) with a clean interface.',
    tags: ['Unit', 'Convert', 'Length', 'Weight', 'Temperature'],
    relatedSlugs: ['standard-calculator', 'percentage-calculator', 'aspect-ratio-framing-calculator'],
    faqs: [
      {
        q: 'What units are supported?',
        a: 'Length (m, km, cm, mm, mile, yard, foot, inch), Weight (kg, g, mg, ton, lb, oz), Temperature (Celsius, Fahrenheit, Kelvin), and Data (bit, byte, KB, MB, GB, TB).',
      },
    ],
  },
  {
    slug: 'standard-calculator',
    title: 'Standard Calculator',
    shortTitle: 'Calculator',
    category: 'calculator',
    group: 'Calculators',
    icon: 'Calculator',
    description:
      'A beautiful iOS/macOS-style grid calculator for everyday math. Keyboard-friendly with a clean, tactile interface.',
    tags: ['Calculator', 'Math', 'Standard', 'Basic'],
    relatedSlugs: ['percentage-calculator', 'unit-converter', 'emi-calculator'],
    faqs: [
      {
        q: 'Can I use my keyboard?',
        a: 'Yes. Number keys, operators (+, -, *, /), Enter (=), Escape (C), and Backspace all work.',
      },
    ],
  },
  {
    slug: 'word-counter',
    title: 'Word Counter',
    shortTitle: 'Word Count',
    category: 'calculator',
    group: 'Calculators',
    icon: 'Type',
    description:
      'Real-time word, character, sentence and paragraph counter with reading-time estimate. Perfect for essays and assignments.',
    tags: ['Word Count', 'Characters', 'Reading Time', 'Text'],
    relatedSlugs: ['case-converter', 'pomodoro', 'fancy-unicode-font-generator'],
    faqs: [
      {
        q: 'Is my text stored or sent anywhere?',
        a: 'No. The counting happens entirely in your browser. Your text never leaves your device.',
      },
      {
        q: 'How is reading time calculated?',
        a: 'Reading time is estimated at an average of 200 words per minute, a common standard for adult reading speed.',
      },
    ],
  },
  {
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    shortTitle: 'Percentage',
    category: 'calculator',
    group: 'Calculators',
    icon: 'Percent',
    description:
      'Multi-function percentage calculator: find X% of Y, percentage increase/decrease, and what percent X is of Y.',
    tags: ['Percentage', 'Increase', 'Decrease', 'Calculator'],
    relatedSlugs: ['mark-percentage-calculator', 'cgpa-to-percentage', 'emi-calculator'],
    faqs: [
      {
        q: 'What formulas does this calculator use?',
        a: 'X% of Y = (X/100) × Y. Percentage increase = ((New − Old) / Old) × 100. What percent X is of Y = (X/Y) × 100.',
      },
    ],
  },
  {
    slug: 'emi-calculator',
    title: 'EMI Calculator',
    shortTitle: 'EMI',
    category: 'calculator',
    group: 'Calculators',
    icon: 'Landmark',
    description:
      'Calculate your monthly loan EMI from principal, interest rate, and tenure. See total interest and total payment.',
    tags: ['EMI', 'Loan', 'Interest', 'Finance'],
    relatedSlugs: ['percentage-calculator', 'standard-calculator', 'unit-converter'],
    faqs: [
      {
        q: 'What is the EMI formula?',
        a: 'EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is principal, r is monthly interest rate (annual rate / 12 / 100), and n is the number of monthly installments.',
      },
      {
        q: 'Is my financial data stored anywhere?',
        a: 'No. All calculations happen in your browser. Nothing is uploaded or saved.',
      },
    ],
  },
  {
    slug: 'mark-percentage-calculator',
    title: 'Mark Percentage Calculator',
    shortTitle: 'Percentage',
    category: 'calculator',
    group: 'Calculators',
    icon: 'Calculator',
    description:
      'Calculate your exam percentage and grade from marks obtained and maximum marks.',
    tags: ['Calculator', 'Percentage', 'Marks', 'Grade'],
    relatedSlugs: ['cgpa-to-percentage', 'percentage-calculator', 'age-calculator'],
    faqs: [
      {
        q: 'How is percentage calculated?',
        a: 'Percentage = (Marks Obtained ÷ Maximum Marks) × 100. The calculator applies this formula instantly as you type.',
      },
      {
        q: 'Which grading scale is used?',
        a: 'The calculator shows a common Indian grading band: A+ (≥90%), A (80–89%), B+ (70–79%), B (60–69%), C (50–59%), D (40–49%), Fail (<40%). Your institution may use a different scale.',
      },
    ],
  },
  {
    slug: 'age-calculator',
    title: 'Age Calculator for Exams',
    shortTitle: 'Age',
    category: 'calculator',
    group: 'Calculators',
    icon: 'CalendarDays',
    description:
      'Calculate your exact age in years, months and days — and check age eligibility for exam posts.',
    tags: ['Calculator', 'Age', 'Eligibility'],
    relatedSlugs: ['upsc-photo-resizer', 'ssc-image-compressor', 'mark-percentage-calculator'],
    faqs: [
      {
        q: 'How is age calculated?',
        a: 'Age is calculated as the difference between your date of birth and the reference date (defaults to today), expressed in completed years, months, and days.',
      },
      {
        q: 'Can I set a custom cutoff date?',
        a: 'Yes. Enter the cutoff date from the exam notification to check whether you meet the age eligibility for a particular post.',
      },
    ],
  },
  {
    slug: 'cgpa-to-percentage',
    title: 'CGPA to Percentage Converter',
    shortTitle: 'CGPA → %',
    category: 'calculator',
    group: 'Calculators',
    icon: 'Percent',
    description:
      'Convert CGPA to percentage using common Indian university formulas (CBSE 9.5, and custom multiplier).',
    tags: ['Calculator', 'CGPA', 'Percentage'],
    relatedSlugs: ['mark-percentage-calculator', 'percentage-calculator', 'word-counter'],
    faqs: [
      {
        q: 'What is the CBSE CGPA to percentage formula?',
        a: 'CBSE uses the formula: Percentage = CGPA × 9.5. This is the default multiplier used by the converter.',
      },
      {
        q: 'My university uses a different multiplier — can I change it?',
        a: 'Yes. Enter your university\'s multiplier (for example 10 for many engineering universities) and the converter will recalculate instantly.',
      },
    ],
  },
  {
    slug: 'doc-scanner-pdf-enhancer',
    title: 'Doc Scanner & PDF Enhancer',
    shortTitle: 'Doc Scanner',
    category: 'document',
    group: 'Document Utilities',
    icon: 'ScanLine',
    description:
      'Turn a photo of a document into a clean, high-contrast scanned PDF. Removes shadows and enhances text — all in your browser.',
    tags: ['Scanner', 'PDF', 'Enhance', 'Grayscale', 'Document'],
    relatedSlugs: ['make-it-look-scanned', 'pdf-compressor', 'image-to-pdf'],
    faqs: [
      {
        q: 'How does the document scanner work?',
        a: 'The tool draws your image onto an HTML5 Canvas, applies grayscale and high-contrast filters to remove shadows and background tint, then exports the result as a PDF — entirely in your browser.',
      },
      {
        q: 'Is my document uploaded anywhere?',
        a: 'No. All processing is client-side using the Canvas API. Your document never leaves your device.',
      },
      {
        q: 'Can I adjust the enhancement level?',
        a: 'Yes. You can choose between Grayscale, High Contrast, and B/W Threshold modes, and adjust the contrast and brightness sliders before exporting.',
      },
    ],
  },
  {
    slug: 'pdf-watermark-studio',
    title: 'PDF Watermark Studio',
    shortTitle: 'Watermark PDF',
    category: 'document',
    group: 'Document Utilities',
    icon: 'Stamp',
    description:
      'Overlay custom diagonal text watermarks across all pages of a PDF. Adjust opacity, color, and size — 100% client-side.',
    tags: ['PDF', 'Watermark', 'Text', 'Overlay', 'Copyright'],
    relatedSlugs: ['pdf-whiteout-redact', 'pdf-compressor', 'pdf-merger'],
    faqs: [
      {
        q: 'Is my PDF uploaded to a server?',
        a: 'No. Watermarks are applied entirely in your browser using the pdf-lib library. Your PDF never leaves your device.',
      },
      {
        q: 'Can I customize the watermark?',
        a: 'Yes. You can set the watermark text, font size, color, opacity, and rotation angle. The watermark is applied diagonally across every page.',
      },
    ],
  },
  {
    slug: 'pdf-whiteout-redact',
    title: 'PDF Whiteout & Redact',
    shortTitle: 'Whiteout PDF',
    category: 'document',
    group: 'Document Utilities',
    icon: 'Eraser',
    description:
      'Visually redact sensitive text in a PDF by drawing white boxes over it, then re-save the PDF with those boxes baked in. Client-side only.',
    tags: ['PDF', 'Redact', 'Whiteout', 'Redaction', 'Privacy'],
    relatedSlugs: ['pdf-watermark-studio', 'pdf-compressor', 'doc-scanner-pdf-enhancer'],
    faqs: [
      {
        q: 'Is this true PDF redaction?',
        a: 'This tool draws white rectangles over the areas you select and re-saves the PDF. The visual content is covered, but the underlying text may still exist in the file. For sensitive legal documents, verify the text layer is not extractable.',
      },
      {
        q: 'Are my PDFs uploaded anywhere?',
        a: 'No. The entire redaction process runs in your browser using pdf-lib. Your file never leaves your device.',
      },
    ],
  },
  {
    slug: 'client-side-pdf-compressor',
    title: 'Client-Side PDF Compressor',
    shortTitle: 'PDF Compress',
    category: 'document',
    group: 'Document Utilities',
    icon: 'FileArchive',
    description:
      'Shrink PDF files by stripping unnecessary metadata and re-saving with object stream compression. Fast, private, and free.',
    tags: ['PDF', 'Compress', 'Reduce', 'Size', 'Metadata'],
    relatedSlugs: ['pdf-compressor', 'pdf-split', 'pdf-merger'],
    faqs: [
      {
        q: 'How does this compressor reduce PDF size?',
        a: 'It loads your PDF with pdf-lib, strips document metadata (title, author, keywords), and re-saves using object stream compression, which often produces a smaller file.',
      },
      {
        q: 'Is my PDF uploaded anywhere?',
        a: 'No. Compression happens entirely in your browser. Your file never leaves your device.',
      },
    ],
  },
  {
    slug: 'fancy-unicode-font-generator',
    title: 'Fancy Unicode Font Generator',
    shortTitle: 'Fancy Fonts',
    category: 'creator',
    group: 'Creator Studio',
    icon: 'Type',
    description:
      'Convert plain text into 30+ fancy Unicode styles — bold, italic, cursive, script, fraktur, bubble, and more. Copy any style instantly.',
    tags: ['Font', 'Unicode', 'Fancy', 'Text', 'Generator', 'Copy'],
    relatedSlugs: ['3d-gradient-text-styler', 'animated-text-gif-maker', 'case-converter'],
    faqs: [
      {
        q: 'Are these real fonts?',
        a: 'No. These are Unicode characters that look like different font styles. Because they are real Unicode code points, they work in social media bios, posts, and messages without any special software.',
      },
      {
        q: 'Will fancy text work everywhere?',
        a: 'Most platforms support the common ranges (bold, italic, script). Some exotic styles like bubble or square text may not render on older devices. If a style shows boxes, try a different one.',
      },
      {
        q: 'Is my text stored or sent anywhere?',
        a: 'No. All conversion happens in your browser. Nothing is uploaded.',
      },
    ],
  },
  {
    slug: 'animated-text-gif-maker',
    title: 'Animated Text GIF Maker',
    shortTitle: 'Text GIF',
    category: 'creator',
    group: 'Creator Studio',
    icon: 'Film',
    description:
      'Create animated text GIFs with typewriter, pulse, and slide effects. Choose colors, speed, and font size — exported as a GIF in your browser.',
    tags: ['GIF', 'Animation', 'Text', 'Typewriter', 'Creator'],
    relatedSlugs: ['3d-gradient-text-styler', 'fancy-unicode-font-generator', 'qr-generator'],
    faqs: [
      {
        q: 'How are the GIFs generated?',
        a: 'Frames are rendered on an HTML5 Canvas and encoded into a GIF using a client-side encoder. No server is involved — everything runs in your browser.',
      },
      {
        q: 'Can I make a transparent GIF?',
        a: 'Yes. Select the transparent background option, and the GIF will be exported with a transparent first frame. Note that GIF transparency is 1-bit (fully transparent or fully opaque).',
      },
      {
        q: 'Why is my GIF file large?',
        a: 'GIF is an uncompressed format. Larger canvas sizes, more frames, and more colors all increase file size. Reduce the canvas width or frame count for smaller files.',
      },
    ],
  },
  {
    slug: '3d-gradient-text-styler',
    title: '3D Gradient Text Styler',
    shortTitle: '3D Text',
    category: 'creator',
    group: 'Creator Studio',
    icon: 'Palette',
    description:
      'Render bold text with layered gradient fills, multi-shadow depth, and stroke outlines on a canvas. Download as a transparent PNG.',
    tags: ['Text', '3D', 'Gradient', 'Shadow', 'PNG', 'Styler'],
    relatedSlugs: ['animated-text-gif-maker', 'fancy-unicode-font-generator', 'jpg-to-png'],
    faqs: [
      {
        q: 'How does the 3D effect work?',
        a: 'The tool uses the Canvas API to draw text with a linear gradient fill, a stroke outline, and multiple offset drop-shadows to simulate depth. The result is exported as a transparent PNG.',
      },
      {
        q: 'Is my text stored anywhere?',
        a: 'No. Everything is rendered in your browser. Nothing is uploaded or saved on a server.',
      },
    ],
  },
  {
    slug: 'exif-data-remover',
    title: 'EXIF Data Remover',
    shortTitle: 'EXIF Remover',
    category: 'dev',
    group: 'Image & Dev Utilities',
    icon: 'ShieldCheck',
    description:
      'Strip EXIF, GPS, camera, and metadata from JPEG photos before sharing. Fast, private, and 100% browser-based.',
    tags: ['EXIF', 'Metadata', 'GPS', 'Privacy', 'JPEG', 'Strip'],
    relatedSlugs: ['webp-to-jpg-png-converter', 'jpg-to-png', 'upsc-photo-resizer'],
    faqs: [
      {
        q: 'What is EXIF data?',
        a: 'EXIF (Exchangeable Image File Format) data is metadata embedded in JPEG files by cameras and phones. It can include the camera model, timestamp, exposure settings, and GPS location coordinates.',
      },
      {
        q: 'Why should I remove EXIF data?',
        a: 'Photos shared online can leak your exact GPS location, device info, and timestamps. Removing EXIF data protects your privacy before you upload or share an image.',
      },
      {
        q: 'Is my photo uploaded anywhere?',
        a: 'No. The EXIF stripping happens entirely in your browser. Your image never leaves your device.',
      },
    ],
  },
  {
    slug: 'webp-to-jpg-png-converter',
    title: 'WebP to JPG/PNG Converter',
    shortTitle: 'WebP Convert',
    category: 'dev',
    group: 'Image & Dev Utilities',
    icon: 'FileImage',
    description:
      'Convert WebP images to standard JPG or PNG format instantly using the Canvas API. No uploads, no waiting.',
    tags: ['WebP', 'JPG', 'PNG', 'Convert', 'Image'],
    relatedSlugs: ['jpg-to-png', 'exif-data-remover', 'aspect-ratio-framing-calculator'],
    faqs: [
      {
        q: 'How does the conversion work?',
        a: 'Your WebP image is drawn onto an HTML5 Canvas and then re-encoded as JPG or PNG using the canvas.toDataURL method. Everything happens in your browser.',
      },
      {
        q: 'Is there any quality loss?',
        a: 'PNG output is lossless. JPG output uses a quality setting you control (default 95%) — lower values produce smaller files at the cost of quality.',
      },
    ],
  },
  {
    slug: 'aspect-ratio-framing-calculator',
    title: 'Aspect Ratio Framing Calculator',
    shortTitle: 'Aspect Ratio',
    category: 'dev',
    group: 'Image & Dev Utilities',
    icon: 'RectangleHorizontal',
    description:
      'Calculate aspect ratios from any width and height. See simplified ratios (16:9, 4:3, 9:16) and a live visualizer for video and design work.',
    tags: ['Aspect Ratio', 'Video', 'Design', 'Calculator', 'Framing'],
    relatedSlugs: ['webp-to-jpg-png-converter', 'exif-data-remover', 'unit-converter'],
    faqs: [
      {
        q: 'How is the aspect ratio calculated?',
        a: 'The tool divides both width and height by their greatest common divisor (GCD) to produce the simplest whole-number ratio, for example 1920×1080 becomes 16:9.',
      },
      {
        q: 'Can I use this for video and image framing?',
        a: 'Yes. Enter your target dimensions and the tool shows the simplified ratio, the decimal ratio, and a live preview box scaled to fit your screen.',
      },
    ],
  },
];

export const toolGroups = [
  'Exam Photo Tools',
  'Document Utilities',
  'Calculators',
  'Productivity & Focus',
  'Creator Studio',
  'Image & Dev Utilities',
] as const;

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByGroup(group: string): Tool[] {
  return tools.filter((t) => t.group === group);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}

/**
 * Retrieves recommended "Next Steps" tools for a given tool slug.
 */
export function getRelatedTools(slug: string): Tool[] {
  const current = getToolBySlug(slug);
  if (!current) return [];

  if (current.relatedSlugs && current.relatedSlugs.length > 0) {
    const related = current.relatedSlugs
      .map((s) => getToolBySlug(s))
      .filter((t): t is Tool => t !== undefined);
    if (related.length > 0) return related;
  }

  // Fallback: Return other tools in the same group
  return tools
    .filter((t) => t.group === current.group && t.slug !== current.slug)
    .slice(0, 3);
}