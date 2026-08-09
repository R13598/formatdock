'use client';

import { useState } from 'react';
import { Sparkles, Loader as Loader2, Copy, Check, RefreshCw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useAI } from '@/lib/ai-client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function AiMetaDescriptionGenerator() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { loading, result, generate, reset } = useAI();
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!title.trim() && !content.trim()) {
      toast.error('Please enter a title or some content.');
      return;
    }
    generate({
      prompt: `Write 5 SEO meta descriptions (max 155 characters each) for the following page. Return one per line, prefixed with a number.\n\nTitle: ${title}\n\nContent summary:\n${content || '(no additional content provided)'}`,
      system:
        'You are an expert SEO copywriter. Write compelling meta descriptions that drive clicks and accurately represent the page content. Each description must be under 155 characters.',
      taskType: 'metadata',
      temperature: 0.7,
      maxTokens: 512,
    });
  };

  const handleCopy = async () => {
    if (!result?.text) return;
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      toast.success('Meta descriptions copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileText className="h-4 w-4 text-blue-500" />
          Page Title
        </label>
        <Textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. UPSC Photo Resizer — Free Online Tool"
          className="min-h-[60px] resize-y border-border/80 bg-card/60 backdrop-blur-md text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Content Summary (optional)
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Briefly describe what the page is about..."
          className="min-h-[100px] resize-y border-border/80 bg-card/60 backdrop-blur-md text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleGenerate}
          disabled={loading || (!title.trim() && !content.trim())}
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
              Generate Meta Descriptions
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
            Writing SEO-optimized meta descriptions...
          </span>
        </div>
      )}

      {result?.text && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {result.provider}
            </span>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
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
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{result.error}</p>
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
