'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

type Operator = '+' | '-' | '×' | '÷';

export default function StandardCalculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<Operator | null>(null);
  const [waiting, setWaiting] = useState(false);

  const inputDigit = useCallback((d: string) => {
    setDisplay((cur) => {
      if (waiting) {
        setWaiting(false);
        return d;
      }
      if (cur === '0' && d !== '.') return d;
      if (d === '.' && cur.includes('.')) return cur;
      return cur + d;
    });
  }, [waiting]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setWaiting(false);
  }, []);

  const toggleSign = () => setDisplay((d) => (d === '0' ? d : d.startsWith('-') ? d.slice(1) : '-' + d));
  const percent = () => setDisplay((d) => String(parseFloat(d) / 100));

  const compute = (a: number, b: number, o: Operator): number => {
    switch (o) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? NaN : a / b;
    }
  };

  const handleOp = (next: Operator) => {
    const cur = parseFloat(display);
    if (prev !== null && op && !waiting) {
      const result = compute(prev, cur, op);
      setPrev(result);
      setDisplay(String(result));
    } else {
      setPrev(cur);
    }
    setOp(next);
    setWaiting(true);
  };

  const equals = () => {
    if (prev === null || !op) return;
    const cur = parseFloat(display);
    const result = compute(prev, cur, op);
    setDisplay(Number.isNaN(result) ? 'Error' : String(result));
    setPrev(null);
    setOp(null);
    setWaiting(true);
  };

  const backspace = () => {
    setDisplay((d) => (d.length <= 1 || (d.length === 2 && d.startsWith('-')) ? '0' : d.slice(0, -1)));
  };

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
      else if (e.key === '.') inputDigit('.');
      else if (e.key === '+') handleOp('+');
      else if (e.key === '-') handleOp('-');
      else if (e.key === '*') handleOp('×');
      else if (e.key === '/') { e.preventDefault(); handleOp('÷'); }
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); equals(); }
      else if (e.key === 'Escape') clear();
      else if (e.key === 'Backspace') backspace();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const formatDisplay = (d: string) => {
    if (d === 'Error') return d;
    const n = parseFloat(d);
    if (!isFinite(n)) return 'Error';
    if (d.length > 12) return n.toExponential(6);
    return d;
  };

  const keys: { label: string; onClick: () => void; variant?: 'op' | 'fn' | 'eq' | 'num' }[] = [
    { label: 'C', onClick: clear, variant: 'fn' },
    { label: '±', onClick: toggleSign, variant: 'fn' },
    { label: '%', onClick: percent, variant: 'fn' },
    { label: '÷', onClick: () => handleOp('÷'), variant: 'op' },
    { label: '7', onClick: () => inputDigit('7'), variant: 'num' },
    { label: '8', onClick: () => inputDigit('8'), variant: 'num' },
    { label: '9', onClick: () => inputDigit('9'), variant: 'num' },
    { label: '×', onClick: () => handleOp('×'), variant: 'op' },
    { label: '4', onClick: () => inputDigit('4'), variant: 'num' },
    { label: '5', onClick: () => inputDigit('5'), variant: 'num' },
    { label: '6', onClick: () => inputDigit('6'), variant: 'num' },
    { label: '−', onClick: () => handleOp('-'), variant: 'op' },
    { label: '1', onClick: () => inputDigit('1'), variant: 'num' },
    { label: '2', onClick: () => inputDigit('2'), variant: 'num' },
    { label: '3', onClick: () => inputDigit('3'), variant: 'num' },
    { label: '+', onClick: () => handleOp('+'), variant: 'op' },
    { label: '0', onClick: () => inputDigit('0'), variant: 'num' },
    { label: '.', onClick: () => inputDigit('.'), variant: 'num' },
    { label: '⌫', onClick: backspace, variant: 'fn' },
    { label: '=', onClick: equals, variant: 'eq' },
  ];

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Calculator className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-muted-foreground">Standard Calculator</span>
        </div>

        {/* Display */}
        <div className="mb-4 overflow-hidden rounded-xl border border-border bg-background px-5 py-6 text-right">
          {prev !== null && op && (
            <div className="text-xs text-muted-foreground">{prev} {op}</div>
          )}
          <div className="truncate text-4xl font-bold tabular-nums text-foreground sm:text-5xl">
            {formatDisplay(display)}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2">
          {keys.map((k) => (
            <button
              key={k.label}
              onClick={k.onClick}
              className={cn(
                'flex h-16 items-center justify-center rounded-xl text-lg font-semibold transition-all duration-200 active:scale-90',
                k.variant === 'num' && 'border border-border bg-muted/50 text-foreground hover:bg-muted',
                k.variant === 'fn' && 'bg-primary/15 text-primary hover:bg-primary/25',
                k.variant === 'op' && 'bg-primary/20 text-primary hover:bg-primary/30',
                k.variant === 'eq' && 'btn-primary-glow text-white',
                k.label === '0' && 'col-span-2'
              )}
            >
              {k.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Tip: use your keyboard — numbers, +, −, *, /, Enter, Esc
        </p>
      </div>
    </div>
  );
}
