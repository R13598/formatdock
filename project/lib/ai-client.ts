'use client';

import { useState } from 'react';

export interface AIResult {
  text: string;
  provider: string;
  success: boolean;
  error?: string;
  details?: string[];
}

export interface AIRequestOptions {
  prompt: string;
  system?: string;
  taskType?: 'summary' | 'rewrite' | 'metadata' | 'title' | 'general';
  maxTokens?: number;
  temperature?: number;
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async (opts: AIRequestOptions): Promise<AIResult | null> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opts),
      });

      const data: AIResult = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.error ?? 'Failed to generate AI response';
        setError(msg);
        setResult(data);
        return data;
      }

      setResult(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { loading, result, error, generate, reset };
}
