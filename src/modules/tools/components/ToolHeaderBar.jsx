import React, { useState } from 'react';
import { ArrowLeft, Check, Copy, Share2 } from 'lucide-react';

export function ToolHeaderBar({ onBack, title, toolSlug, lang = 'pt' }) {
  const [copied, setCopied] = useState(false);
  const isEn = lang === 'en';

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/tools/${toolSlug}` : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${title} — Internet do Zero`,
          url
        });
        return;
      } catch (_) {}
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{isEn ? 'All tools' : 'Todas as ferramentas'}</span>
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-zinc-700 shadow-xs transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400 cursor-pointer"
          title={isEn ? 'Share or copy tool link' : 'Compartilhar ou copiar link da ferramenta'}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">{isEn ? 'Link copied!' : 'Link copiado!'}</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5 text-zinc-400" />
              <span>{isEn ? 'Share tool' : 'Compartilhar'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
