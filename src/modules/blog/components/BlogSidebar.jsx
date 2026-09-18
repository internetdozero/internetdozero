import React, { useState } from 'react';
import { Tag, BookOpen, MessageCircle } from 'lucide-react';
import { ArticleIndexPanel } from './ArticleIndexPanel';
import { SidebarThoughts } from './SidebarThoughts';
import { SidebarTopics } from './SidebarTopics';

export function BlogSidebar({
  posts = [],
  thoughts = [],
  tags = [],
  activeTag,
  onSelectTag,
  onToggleLike,
  onSelectThought,
  onSelectPost,
  selectedPostId,
  postLang = 'pt',
  lang = 'pt'
}) {
  const [sidebarTab, setSidebarTab] = useState('index');
  const currentLang = lang || postLang;
  const isEn = currentLang === 'en';

  return (
    <aside className="space-y-6">
      {/* Abas Superiores da Barra Lateral */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
        <button
          onClick={() => setSidebarTab('index')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            sidebarTab === 'index'
              ? 'bg-white dark:bg-zinc-800 text-stone-600 dark:text-stone-400 font-bold shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isEn ? 'Index' : 'Índice'}</span>
        </button>

        <button
          onClick={() => setSidebarTab('thoughts')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            sidebarTab === 'thoughts'
              ? 'bg-white dark:bg-zinc-800 text-stone-600 dark:text-stone-400 font-bold shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{isEn ? `Notes (${thoughts.length})` : `Notas (${thoughts.length})`}</span>
        </button>

        <button
          onClick={() => setSidebarTab('topics')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            sidebarTab === 'topics'
              ? 'bg-white dark:bg-zinc-800 text-stone-600 dark:text-stone-400 font-bold shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>{isEn ? 'Topics' : 'Tópicos'}</span>
        </button>
      </div>

      {sidebarTab === 'index' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <ArticleIndexPanel
            posts={posts}
            selectedPostId={selectedPostId}
            onSelectPost={onSelectPost}
            postLang={currentLang}
          />
        </div>
      )}

      {sidebarTab === 'thoughts' && (
        <SidebarThoughts
          thoughts={thoughts}
          onSelectThought={onSelectThought}
          onToggleLike={onToggleLike}
          isEn={isEn}
        />
      )}

      {sidebarTab === 'topics' && (
        <SidebarTopics
          tags={tags}
          activeTag={activeTag}
          onSelectTag={onSelectTag}
          isEn={isEn}
        />
      )}
    </aside>
  );
}
