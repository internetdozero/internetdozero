import React from 'react';
import { Tag, Terminal } from 'lucide-react';

export function SidebarTopics({ tags = [], activeTag, onSelectTag, isEn }) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
          <Tag className="w-3.5 h-3.5 text-emerald-500" />
          <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            {isEn ? 'Topics & Tags' : 'Tópicos & Tags'}
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
            #{isEn ? 'all' : 'todas'}
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

      <div className="p-5 rounded-2xl bg-zinc-900 text-zinc-200 border border-zinc-800 shadow-xs font-mono text-xs">
        <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold">
          <Terminal className="w-4 h-4" />
          <span>{isEn ? 'about this space' : 'sobre este espaço'}</span>
        </div>
        <p className="text-zinc-400 leading-relaxed mb-3">
          {isEn ? 'A small personal blog. No schedule, no clickbait — just things I wanted to write down.' : 'Um blog pessoal pequeno. Sem calendário, sem clickbait — só coisas que eu quis escrever.'}
        </p>
        <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
          <span>{isEn ? 'Mode: Sovereign' : 'Modo: Independente'}</span>
          <span className="text-emerald-500">online</span>
        </div>
      </div>
    </div>
  );
}
