import React from 'react';
import { buttonClass } from './AdminPrimitives';

export function AdminPostCard({ post, onEdit, onPublish, onRemove }) {
  const isDraft = !Number(post.published);
  return (
    <div className="group rounded-xl border border-transparent p-2 transition-colors hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-800 dark:hover:bg-zinc-950">
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onEdit(post)} className={`${buttonClass} min-w-0 flex-1 truncate text-left text-sm text-zinc-700 hover:text-emerald-500 dark:text-zinc-300`}>
          {post.title_pt}
        </button>
        <button type="button" onClick={() => onRemove(post)} aria-label={`Excluir ${post.title_pt}`} className={`${buttonClass} shrink-0 rounded-lg p-1.5 text-zinc-400 opacity-60 hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100`}>×</button>
      </div>
      {isDraft && <button type="button" onClick={() => onPublish(post)} className={`${buttonClass} mt-1 rounded-md px-1.5 py-1 text-[10px] font-bold text-amber-600 hover:bg-amber-500/10 dark:text-amber-400`}>Publicar este rascunho</button>}
    </div>
  );
}
