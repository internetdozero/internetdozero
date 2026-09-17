import React, { useMemo } from 'react';
import { ArrowLeft, ArrowRight, ClipboardList, FolderOpen, Globe, Lightbulb, ShieldCheck } from 'lucide-react';

const categoryDetails = {
  Web: { icon: Globe, pt: 'Sites, publicação e as peças da web.', en: 'Sites, publishing, and the pieces of the web.' },
  Segurança: { icon: ShieldCheck, pt: 'Contas, privacidade e cuidados básicos.', en: 'Accounts, privacy, and practical safeguards.' },
  Organização: { icon: ClipboardList, pt: 'Backups, arquivos e menos bagunça.', en: 'Backups, files, and less digital clutter.' },
  Ideias: { icon: Lightbulb, pt: 'Anotações, tentativas e coisas em construção.', en: 'Notes, experiments, and things in progress.' }
};

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
        {categories.map((category) => {
          const details = categoryDetails[category] || { icon: FolderOpen, pt: 'Textos reunidos sobre este assunto.', en: 'Texts collected around this topic.' };
          const Icon = details.icon;
          return (
          <button key={category} type="button" onClick={() => onSelectCategory(category)} className="group flex min-h-40 flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/60 dark:border-zinc-800 dark:bg-zinc-900/60">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><Icon className="h-4 w-4" /></span>
              <span>
                <span className="block font-mono text-lg font-bold text-zinc-900 group-hover:text-emerald-500 dark:text-zinc-100">{category}</span>
                <span className="mt-1 block text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? details.en : details.pt}</span>
              </span>
            <span className="flex items-center justify-between text-xs text-zinc-500">
              {counts[category] || 0} {isEn ? 'texts' : 'textos'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          );
        })}
      </div>
    </div>
  );
}
