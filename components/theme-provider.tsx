'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

type Theme = 'dark' | 'light';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem('formatdock-theme')) as Theme | null;
    const prefersLight =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: light)').matches;
    const initial = stored ?? (prefersLight ? 'light' : 'dark');
    setTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('formatdock-theme', theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
