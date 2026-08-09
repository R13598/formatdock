'use client';

import { useState } from 'react';
import { Sparkles, Loader as Loader2, Copy, Check, RefreshCw, Wand as Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAI } from '@/lib/ai-client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function AiTitleGenerator() {
  const [input, setInput] = useState('');
  const { loading, result, generate, reset } = useAI();
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!input.trim()) {
      toast.error('Please enter some content to generate titles for.');
      return;
    }
    generate({
      prompt: `Generate 10 compelling, SEO-friendly titles for the following content. Return only the titles, one per line, numbered 1-10.\n\nContent:\n${input}`,
      system:
        'You are an expert content strategist and SEO specialist. Generate engaging, click-worthy titles that balance curiosity with clarity. Avoid clickbait.',
      taskType: 'title',
      temperature: 0.8,
      maxTokens: 512,
    });
  };

  const handleCopy = async () => {
    if (!result?.text) return;
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      toast.success('Titles copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy. Please try manually.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Wand2 className="h-4 w-4 text-blue-500" />
          Paste your content, topic, or article
        </label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. A blog post about the benefits of using browser-based tools for students preparing for competitive exams..."
          className="min-h-[140px] resize-y border-border/80 bg-card/60 backdrop-blur-md text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleGenerate}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Titles
            </>
          )}
        </Button>
        {result && (
          <Button variant="outline" onClick={reset} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 backdrop-blur-md p-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground animate-pulse">
            AI is crafting compelling titles...
          </span>
        </div>
      )}

      {result?.text && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                {result.provider}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="rounded-xl border border-border/80 bg-card/60 backdrop-blur-md p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {result.text}
            </pre>
          </div>
        </div>
      )}

      {result?.error && !loading && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
            {result.error}
          </p>
          {result.details && (
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {result.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
