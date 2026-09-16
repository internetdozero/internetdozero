import React from 'react';
import { Heart, MessageSquare, Terminal } from 'lucide-react';

export function ThoughtCard({ thought, isLiked, onToggleLike, onSelect }) {
  const formattedDate = new Date(thought.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <article className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500/40 transition-all shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5" />
          </span>
          <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            @{thought.author || 'senhor'}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700 font-mono text-xs">•</span>
          <span className="text-zinc-500 text-xs font-mono">{formattedDate}</span>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
          💭 Pensamento
        </span>
      </div>

      <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed mb-4 whitespace-pre-line">
        "{thought.content}"
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-mono">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(thought.id);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            isLiked
              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 font-bold'
              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
          }`}
          aria-label="Curtir pensamento"
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
          <span>{thought.likes || 0}</span>
        </button>

        <button
          onClick={() => onSelect(thought)}
          className="inline-flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{thought.comments?.length || 0} comentários</span>
        </button>
      </div>
    </article>
  );
}
