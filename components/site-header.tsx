'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Menu, X, Command, ChevronDown, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { tools, toolGroups, type Tool } from '@/lib/tools';
import ThemeToggle from '@/components/theme-toggle';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const groupIcon: Record<string, LucideIcon> = {
  'Exam Photo Tools': Icons.GraduationCap,
  'Document Utilities': Icons.FileText,
  'Calculators': Icons.Calculator,
  'Productivity & Focus': Icons.Timer,
  'Creator Studio': Icons.Palette,
  'Image & Dev Utilities': Icons.Wrench,
};

const categoryTabs = [
  { href: '/exams', label: 'Exam Presets', icon: '🎓' },
  { href: '/documents', label: 'PDF & Docs', icon: '📄' },
  { href: '/calculators', label: 'Calculators', icon: '🧮' },
  { href: '/creator', label: 'Creator Studio', icon: '🎨' },
  { href: '/dev', label: 'Image & Dev', icon: '🛠️' },
  { href: '/stock-videos', label: 'Stock Media', icon: '🎬' },
  { href: '/wallpapers', label: 'Wallpapers', icon: '🖼️' },
];

export default function SiteHeader() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [megaOpen, setMegaOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const suggestions: Tool[] =
    query.trim().length > 0
      ? tools
          .filter((t) =>
            (t.title + ' ' + t.description + ' ' + (t.tags?.join(' ') ?? ''))
              .toLowerCase()
              .includes(query.toLowerCase())
          )
          .slice(0, 6)
      : [];

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const goToResult = useCallback(
    (tool?: Tool) => {
      const target = tool ?? suggestions[activeIndex] ?? suggestions[0];
      if (target) {
        router.push(`/tools/${target.slug}`);
        setQuery('');
        setSearchOpen(false);
        setOpen(false);
        inputRef.current?.blur();
        mobileInputRef.current?.blur();
      }
    },
    [router, suggestions, activeIndex]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMegaOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        goToResult();
      }
      return;
    }
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
  };

  const openMega = () => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaCloseTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl transition-all duration-300',
        scrolled && 'shadow-xl shadow-black/10 dark:shadow-black/50 border-border/90 bg-background/95'
      )}
    >
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 mr-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 font-bold text-white shadow-md transition-all duration-300 group-hover:scale-105 active:scale-95 border border-white/20">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white drop-shadow-md" aria-hidden>
              <path d="M7 4h10v3H10v3h6v3h-6v7H7z" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary">
              FormatDock
            </span>
            <span className="hidden text-[9px] font-semibold uppercase tracking-widest text-muted-foreground sm:block">
              100% Client-Side Dock
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 lg:flex">
          <div
            ref={megaRef}
            className="relative"
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
          >
            <Link
              href="/tools"
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground",
                megaOpen && "bg-primary/15 text-primary"
              )}
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
              All Tools
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-200 opacity-70',
                  megaOpen && 'rotate-180 text-primary opacity-100'
                )}
              />
            </Link>

            {/* Mega Menu */}
            {megaOpen && (
              <div
                className="absolute left-0 top-full z-50 w-[840px] pt-3 animate-fade-in-up"
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <div className="overflow-hidden rounded-2xl glass-panel shadow-2xl border border-border/80 bg-card/95">
                  <div className="grid grid-cols-3 gap-4 p-5">
                    {toolGroups.map((group) => {
                      const GIcon = groupIcon[group] ?? Icons.Wrench;
                      const groupTools = tools.filter((t) => t.group === group);
                      return (
                        <div key={group} className="rounded-xl bg-muted/30 p-3 border border-border/50 hover:border-primary/30 transition-colors">
                          <div className="mb-2.5 flex items-center gap-2 border-b border-border/40 pb-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/20 text-primary">
                              <GIcon className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-xs font-bold tracking-wide text-foreground">
                              {group}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {groupTools.map((t) => {
                              const TIcon =
                                (Icons as unknown as Record<string, LucideIcon>)[t.icon] ??
                                Icons.Wrench;
                              return (
                                <Link
                                  key={t.slug}
                                  href={`/tools/${t.slug}`}
                                  onClick={() => setMegaOpen(false)}
                                  className="flex items-center gap-2 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-primary/15 hover:text-foreground"
                                >
                                  <TIcon className="h-3 w-3 shrink-0 text-blue-500 dark:text-blue-400" />
                                  <span className="truncate">{t.shortTitle}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-border/60 bg-muted/40 px-5 py-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      ⚡ {tools.length}+ Utilities • Zero Server Uploads • 100% Private
                    </span>
                    <Link
                      href="/tools"
                      onClick={() => setMegaOpen(false)}
                      className="text-xs font-bold text-primary hover:underline transition-colors flex items-center gap-1"
                    >
                      Browse All Tools Directory →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {categoryTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          ))}
        </nav>

        {/* Prominent Search Bar */}
        <div className="relative hidden w-56 md:w-64 lg:w-80 xl:w-96 shrink-0 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search tools (e.g. UPSC, PDF)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            onKeyDown={onKeyDown}
            className="h-10 w-full border-border/80 bg-card/60 pl-9 pr-12 text-xs text-foreground placeholder:text-muted-foreground search-glow focus-visible:ring-primary/30 rounded-xl"
            aria-label="Search tools"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 select-none items-center gap-0.5 rounded border border-border/80 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex">
            <Command className="h-2.5 w-2.5" />K
          </kbd>

          {searchOpen && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl glass-panel shadow-2xl border border-border bg-card/95 animate-fade-in-up">
              {suggestions.map((t, i) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    setQuery('');
                    setSearchOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 text-xs transition-colors',
                    i === activeIndex
                      ? 'bg-primary/20 text-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-muted/50'
                  )}
                >
                  <span className="font-medium text-foreground">{t.title}</span>
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-blue-500 dark:text-blue-400">
                    {t.group}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <ThemeToggle className="hidden sm:flex shrink-0" />

        <button
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-b border-border bg-background/98 backdrop-blur-xl lg:hidden animate-fade-in-up">
          <div className="space-y-2 px-4 py-4">
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={mobileInputRef}
                type="search"
                placeholder="Search tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                className="h-10 border-border bg-card pl-9 text-sm text-foreground"
              />
            </div>
            {suggestions.length > 0 && (
              <div className="mb-3 overflow-hidden rounded-xl border border-border bg-card">
                {suggestions.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    onClick={() => {
                      setQuery('');
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 px-3.5 py-2.5 text-xs text-muted-foreground hover:bg-muted"
                  >
                    <span className="font-medium text-foreground">{t.title}</span>
                    <span className="ml-auto text-[10px] text-primary">{t.group}</span>
                  </Link>
                ))}
              </div>
            )}
            
            <div className="space-y-1 pt-1">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Category Shortcuts
              </div>
              {categoryTabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </Link>
              ))}
            </div>

            <div className="border-t border-border/60 pt-3 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Link
                  href="/tools"
                  onClick={() => setOpen(false)}
                  className="text-xs font-bold text-primary"
                >
                  Explore All {tools.length} Tools →
                </Link>
                <Link
                  href="/stock-videos"
                  onClick={() => setOpen(false)}
                  className="text-xs font-semibold text-blue-500 dark:text-blue-400"
                >
                  🎬 Stock Media Search
                </Link>
                <Link
                  href="/wallpapers"
                  onClick={() => setOpen(false)}
                  className="text-xs font-semibold text-cyan-500 dark:text-cyan-400"
                >
                  🖼️ Wallpapers
                </Link>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}