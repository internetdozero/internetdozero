import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Clock, Bookmark, X } from 'lucide-react';

export function ArticleIndexPanel({
  posts = [],
  selectedPostId = null,
  onSelectPost,
  postLang = 'pt',
  isDrawer = false,
  onClose
}) {
  const [indexSearch, setIndexSearch] = useState('');
  const isEn = postLang === 'en';

  const groupedArticles = useMemo(() => {
    const q = indexSearch.toLowerCase().trim();
    const filtered = posts.filter((p) => {
      if (!q) return true;
      const title = (isEn && p.title_en ? p.title_en : (p.title_pt || p.title || '')).toLowerCase();
      const tags = (isEn && p.tags_en ? p.tags_en : (p.tags_pt || p.tags || [])).join(' ').toLowerCase();
      return title.includes(q) || tags.includes(q);
    });

    const groups = {};
    filtered.forEach((post) => {
      const tags = isEn && post.tags_en ? post.tags_en : (post.tags_pt || post.tags || []);
      const category = tags[0] || (isEn ? 'General' : 'Geral');
      if (!groups[category]) groups[category] = [];
      groups[category].push(post);
    });

    return groups;
  }, [posts, indexSearch, isEn]);

  const totalCount = posts.length;

  return (
    <div className="flex flex-col h-full font-mono text-xs text-zinc-800 dark:text-zinc-200">
      {/* Header do Painel */}
      <div className="pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <h3 className="font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            {isEn ? 'Article Index' : 'Índice de Artigos'}
          </h3>
          <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-500">
            {totalCount}
          </span>
        </div>
        {isDrawer && onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title={isEn ? "Close index" : "Fechar índice"}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mini Busca do Índice */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={indexSearch}
          onChange={(e) => setIndexSearch(e.target.value)}
          placeholder={isEn ? "Filter index..." : "Filtrar índice..."}
          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
        />
      </div>

      {/* Lista Agrupada com Scroll */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[460px]">
        {Object.keys(groupedArticles).length === 0 ? (
          <p className="text-center py-6 text-zinc-500 text-xs">
            {isEn ? 'No articles found.' : 'Nenhum artigo encontrado.'}
          </p>
        ) : (
          Object.entries(groupedArticles).map(([category, items]) => (
            <div key={category} className="space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider flex items-center gap-1.5 px-1">
                <Bookmark className="w-3 h-3 text-emerald-500/80" />
                <span>{category}</span>
                <span className="opacity-50">({items.length})</span>
              </div>

              <div className="space-y-1">
                {items.map((post) => {
                  const isSelected = selectedPostId === post.id;
                  const title = (isEn && post.title_en) ? post.title_en : (post.title_pt || post.title);

                  return (
                    <button
                      key={post.id}
                      onClick={() => {
                        onSelectPost(post);
                        if (isDrawer && onClose) onClose();
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-all group flex flex-col gap-1 cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-medium'
                          : 'bg-white/40 dark:bg-zinc-900/40 border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      <span className="text-xs line-clamp-2 leading-snug font-sans">
                        {title}
                      </span>

                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                        <span className="uppercase text-[9px] px-1 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                          {post.type === 'story' ? (isEn ? 'Story' : 'História') : (isEn ? 'Article' : 'Artigo')}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {post.readingTime || '3 min'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
