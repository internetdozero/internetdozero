import React, { useState } from 'react';
import { Heart, MessageSquare, Terminal, Tag, BookOpen, MessageCircle } from 'lucide-react';
import { ArticleIndexPanel } from './ArticleIndexPanel';

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
  postLang = 'pt'
}) {
  const [sidebarTab, setSidebarTab] = useState('index'); // 'index' | 'thoughts' | 'topics'

  return (
    <aside className="space-y-6">
      {/* Abas Superiores da Barra Lateral */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
        <button
          onClick={() => setSidebarTab('index')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            sidebarTab === 'index'
              ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Índice</span>
        </button>

        <button
          onClick={() => setSidebarTab('thoughts')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            sidebarTab === 'thoughts'
              ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Notas ({thoughts.length})</span>
        </button>

        <button
          onClick={() => setSidebarTab('topics')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            sidebarTab === 'topics'
              ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Tópicos</span>
        </button>
      </div>

      {/* Conteúdo da Aba Ativa */}
      {sidebarTab === 'index' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <ArticleIndexPanel
            posts={posts}
            selectedPostId={selectedPostId}
            onSelectPost={onSelectPost}
            postLang={postLang}
          />
        </div>
      )}

      {sidebarTab === 'thoughts' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Pensamentos Rápidos
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">feed pessoal</span>
          </div>

          <div className="space-y-3">
            {thoughts.length === 0 ? (
              <p className="text-xs text-zinc-500 font-mono py-2">
                Nenhum pensamento recente registrado.
              </p>
            ) : (
              thoughts.map((thought) => (
                <div
                  key={thought.id}
                  onClick={() => onSelectThought(thought)}
                  className="group p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/60 hover:border-emerald-500/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">@{thought.author}</span>
                    <span>{new Date(thought.createdAt).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed mb-2">
                    "{thought.content}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-zinc-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(thought.id);
                      }}
                      className="flex items-center gap-1 hover:text-rose-500 transition-colors"
                    >
                      <Heart className="w-3 h-3" />
                      <span>{thought.likes || 0}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{thought.comments?.length || 0}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {sidebarTab === 'topics' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
              <Tag className="w-3.5 h-3.5 text-emerald-500" />
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Tópicos & Tags
              </h3>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onSelectTag(null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  !activeTag
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                #todas
              </button>
              {tags.map(({ name, count }) => (
                <button
                  key={name}
                  onClick={() => onSelectTag(name === activeTag ? null : name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    activeTag === name
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  #{name} <span className="opacity-60 text-[10px]">({count})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900 text-zinc-200 border border-zinc-800 shadow-sm font-mono text-xs">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold">
              <Terminal className="w-4 h-4" />
              <span>sobre este espaço</span>
            </div>
            <p className="text-zinc-400 leading-relaxed mb-3">
              Reduto monocrático e autoral. Sem algoritmo, sem clickbait e sem pauta obrigatória.
            </p>
            <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>Modo: Independente</span>
              <span className="text-emerald-500">online</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
