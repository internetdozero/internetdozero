import React, { useState } from 'react';
import { ArrowLeft, Filter, Search, X } from 'lucide-react';
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState('');

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
          <div className="relative">
            <button type="button" aria-expanded={filterOpen} onClick={() => setFilterOpen((open) => !open)} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-mono transition-colors ${activeCategory ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-zinc-200 bg-white text-zinc-600 hover:border-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'}`}>
              <Filter className="h-3.5 w-3.5" />
              {isEn ? 'Filter' : 'Filtrar'}
              {activeCategory && <span className="max-w-32 truncate rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px]">{activeCategory}</span>}
            </button>

            {filterOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-[min(calc(100vw-2rem),360px)] rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                  <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                    <input value={categoryQuery} onChange={(event) => setCategoryQuery(event.target.value)} placeholder={isEn ? 'Find a category…' : 'Buscar categoria…'} aria-label={isEn ? 'Find a category' : 'Buscar categoria'} className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-xs font-mono text-zinc-800 outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200" />
                  </div>
                  <button type="button" aria-label={isEn ? 'Close filters' : 'Fechar filtros'} onClick={() => setFilterOpen(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"><X className="h-4 w-4" /></button>
                </div>
                <div className="mt-3 max-h-52 space-y-1 overflow-y-auto">
                  {categories.filter((category) => category.name.toLowerCase().includes(categoryQuery.toLowerCase())).map((category) => (
                    <button key={category.name} type="button" onClick={() => { onSelectCategory(activeCategory === category.name ? null : category.name); setFilterOpen(false); }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-mono transition-colors ${activeCategory === category.name ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}>
                      {category.name}<span className="text-[10px] opacity-60">{category.count}</span>
                    </button>
                  ))}
                  {categories.filter((category) => category.name.toLowerCase().includes(categoryQuery.toLowerCase())).length === 0 && <p className="px-3 py-3 text-xs text-zinc-500">{isEn ? 'No category found.' : 'Nenhuma categoria encontrada.'}</p>}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <button type="button" onClick={() => { onSelectCategory(null); setCategoryQuery(''); setFilterOpen(false); }} className="text-[11px] font-mono text-zinc-500 hover:text-emerald-500">{isEn ? 'Clear filter' : 'Limpar filtro'}</button>
                  <button type="button" onClick={onViewAllCategories} className="text-[11px] font-mono text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">{isEn ? 'All categories' : 'Todas as categorias'}</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
