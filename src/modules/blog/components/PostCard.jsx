import React from 'react';
import { Heart, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { getPostReadingTime } from '../utils/readingTime';

export function PostCard({ post, isLiked, onToggleLike, onSelect, lang = 'pt' }) {
  const isEn = lang === 'en';
  const isArticle = post.type === 'article';
  const title = (isEn && post.title_en) ? post.title_en : (post.title_pt || post.title);
  const subtitle = (isEn && post.subtitle_en) ? post.subtitle_en : (post.subtitle_pt || post.subtitle);
  const tags = (isEn && post.tags_en) ? post.tags_en : (post.tags_pt || post.tags || []);

  return (
    <article
      onClick={() => onSelect(post)}
      className="group p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 hover:border-stone-500/50 transition-all shadow-xs cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-stone-500/10 text-stone-600 dark:text-stone-400 border border-stone-500/20">
              {isArticle ? (isEn ? '📰 Article' : '📰 Artigo') : (isEn ? '📖 Story' : '📖 História')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
            <Clock className="w-3 h-3" />
            <span>{getPostReadingTime(post)}</span>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-serif font-semibold text-zinc-900 dark:text-white group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors mb-2">
          {title}
        </h3>

        {subtitle && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans line-clamp-2 mb-4 leading-relaxed">
            {subtitle}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-mono">
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(post.id);
            }}
            className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLiked ? 'text-rose-500 font-bold' : 'text-zinc-500 hover:text-rose-500'
            }`}
            aria-label="Curtir publicação"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
            <span>{post.likes || 0}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 text-zinc-500">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.commentsCount ?? post.comments?.length ?? 0}</span>
          </span>
        </div>

        <span className="text-stone-600 dark:text-stone-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          <span>{isEn ? 'Read' : 'Ler'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
}
