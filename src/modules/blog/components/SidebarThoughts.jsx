import React from 'react';
import { Heart, MessageSquare } from 'lucide-react';

export function SidebarThoughts({ thoughts = [], onSelectThought, onToggleLike, isEn }) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            {isEn ? 'Quick Thoughts' : 'Pensamentos Rápidos'}
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">{isEn ? 'personal feed' : 'feed pessoal'}</span>
      </div>

      <div className="space-y-3">
        {thoughts.length === 0 ? (
          <p className="text-xs text-zinc-500 font-mono py-2">
            {isEn ? 'No recent thoughts recorded.' : 'Nenhum pensamento recente registrado.'}
          </p>
        ) : (
          thoughts.map((thought) => {
            const thoughtText = isEn && thought.content_en ? thought.content_en : thought.content;
            return (
              <div
                key={thought.id}
                onClick={() => onSelectThought(thought)}
                className="group p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/60 hover:border-emerald-500/40 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">@{thought.author}</span>
                  <span>{new Date(thought.createdAt).toLocaleDateString(isEn ? 'en-US' : 'pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed mb-2">
                  "{thoughtText}"
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
            );
          })
        )}
      </div>
    </div>
  );
}
