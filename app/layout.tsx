import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });
const siteUrl = 'https://formatdocks.vercel.app';
const siteDescription =
  'FormatDock offers 33+ free, private, browser-based utilities for students and professionals — exam photo resizers, PDF & image converters, calculators, and focus timers.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FormatDock — Free Client-Side Web Utilities',
    template: '%s | FormatDock',
  },
  description: siteDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('formatdock-theme');var m=window.matchMedia('(prefers-color-scheme: light)').matches;var d=t? t==='dark' : !m;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased relative min-h-screen overflow-x-hidden bg-background text-foreground`}>
        {/* Visible High-Contrast Technical Grid Pattern */}
        <div className="fixed inset-0 z-[-1] bg-grid-mesh pointer-events-none opacity-60 dark:opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_98%)]" />

        {/* Multi-Tone Ambient Light Orbs */}
        <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-blue-600/15 blur-[130px] rounded-full z-[-1] pointer-events-none" />
        <div className="fixed top-[35%] right-[-100px] w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full z-[-1] pointer-events-none" />
        <div className="fixed top-[65%] left-[-100px] w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full z-[-1] pointer-events-none" />

        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}