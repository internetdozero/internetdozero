import React from 'react';
import { ArrowRight, Clock, Globe, Heart, MessageSquare } from 'lucide-react';

export function PostListItem({ post, isLiked, onToggleLike, onSelect }) {
  const isArticle = post.type === 'article';
  const title = post.title || post.title_pt;
  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });

  return (
    <article
      onClick={() => onSelect(post)}
      className="group py-6 border-b border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500/40 transition-colors cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {isArticle ? '[ARTIGO]' : '[HISTÓRIA]'}
          </span>
          {post.bilingual && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-500">
              <Globe className="w-3 h-3 text-emerald-500" />
              <span>PT/EN</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span>{formattedDate}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime}
          </span>
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold font-mono text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug mb-2">
        {title}
      </h3>

      {post.subtitle && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans line-clamp-2 leading-relaxed mb-3">
          {post.subtitle}
        </p>
      )}

      <div className="flex items-center justify-between text-xs font-mono pt-1">
        <div className="flex flex-wrap gap-1.5">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-zinc-500">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(post.id);
            }}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
            <span>{post.likes || 0}</span>
          </button>

          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.comments?.length || 0}</span>
          </span>

          <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </article>
  );
}
