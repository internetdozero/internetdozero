import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { translations } from '../../../i18n/translations';

export function BlogHeader({
  onBackToHub,
  searchQuery,
  onSearchChange,
  activeTab,
  onSelectTab,
  postCount,
  thoughtCount,
  lang = 'pt',
  categories = [],
  activeCategory,
  onSelectCategory,
  onViewAllCategories
}) {
  const t = translations[lang] || translations.pt;
  const isEn = lang === 'en';

  const tabs = [
    { id: 'all', label: t.blog.all },
    { id: 'article', label: t.blog.articles },
    { id: 'story', label: t.blog.stories },
    { id: 'thought', label: t.blog.thoughts },
  ];

  return (
    <header className="mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
      {/* Top backlink and counter */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          onClick={onBackToHub}
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 hover:underline cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>{isEn ? 'Back to Central Hub' : 'Voltar ao Hub Central'}</span>
        </button>

        <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-zinc-500">
          <span>{postCount} {isEn ? 'articles & stories' : 'artigos & crônicas'}</span>
          <span>•</span>
          <span>{thoughtCount} {isEn ? 'thoughts' : 'pensamentos'}</span>
        </div>
      </div>

      {/* Main Title & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-mono text-zinc-900 dark:text-white tracking-tight">
            {t.blog.title}
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans mt-2 max-w-xl leading-relaxed">
            {t.blog.subtitle}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.blog.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-800 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="mt-6 flex flex-col gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800/60 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-zinc-900 dark:bg-emerald-500 text-white dark:text-zinc-950 font-bold shadow-xs'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500/40 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {categories.length > 0 && (
          <div className="flex min-w-0 flex-wrap items-center gap-2 md:justify-end">
            <span className="mr-1 text-[10px] font-mono uppercase tracking-widest text-zinc-400">{t.blog.categories}</span>
            {categories.slice(0, 10).map((category) => (
              <button key={category.name} onClick={() => onSelectCategory(activeCategory === category.name ? null : category.name)} className={`px-3 py-1 rounded-lg text-[11px] font-mono border transition-colors ${activeCategory === category.name ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-emerald-500/50'}`}>
                {category.name} <span className="opacity-60">{category.count}</span>
              </button>
            ))}
            {categories.length > 10 && (
              <button type="button" onClick={onViewAllCategories} className="px-2 py-1 text-[11px] font-mono text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
                {isEn ? 'More' : 'Mais'}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
