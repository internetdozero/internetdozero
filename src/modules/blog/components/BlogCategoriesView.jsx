import React, { useMemo } from 'react';
import { ArrowLeft, ArrowRight, FolderOpen } from 'lucide-react';

export function BlogCategoriesView({ categories = [], posts = [], onBack, onSelectCategory, lang = 'pt' }) {
  const isEn = lang === 'en';
  const counts = useMemo(() => posts.reduce((result, post) => {
    const category = post.category || post.tags_pt?.[0] || post.tags?.[0] || 'Geral';
    result[category] = (result[category] || 0) + 1;
    return result;
  }, {}), [posts]);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
      <button type="button" onClick={onBack} className="mb-10 inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-emerald-500 hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" />
        {isEn ? 'Back to texts' : 'Voltar aos textos'}
      </button>

      <header className="max-w-2xl border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <p className="mb-3 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-emerald-500">
          <FolderOpen className="h-3.5 w-3.5" />
          {isEn ? 'Browse by topic' : 'Navegar por assunto'}
        </p>
        <h1 className="font-mono text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          {isEn ? 'Categories' : 'Categorias'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {isEn ? 'A quieter way to find the texts you are looking for.' : 'Um jeito mais tranquilo de encontrar o texto que você procura.'}
        </p>
      </header>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <button key={category} type="button" onClick={() => onSelectCategory(category)} className="group flex min-h-32 flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/60 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="font-mono text-lg font-bold text-zinc-900 group-hover:text-emerald-500 dark:text-zinc-100">{category}</span>
            <span className="flex items-center justify-between text-xs text-zinc-500">
              {counts[category] || 0} {isEn ? 'texts' : 'textos'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
