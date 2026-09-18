import React from 'react';
import { ArrowRight, Clock, Heart, MessageSquare, Sparkles } from 'lucide-react';
import { getPostReadingTime } from '../utils/readingTime';
import { getArticleCover } from '../data/articleCovers';

export function FeaturedPost({ post, isLiked, onToggleLike, onSelect, lang = 'pt' }) {
  if (!post) return null;

  const isEn = lang === 'en';
  const title = (isEn && post.title_en) ? post.title_en : (post.title_pt || post.title);
  const subtitle = (isEn && post.subtitle_en) ? post.subtitle_en : (post.subtitle_pt || post.subtitle);
  const tags = (isEn && post.tags_en) ? post.tags_en : (post.tags_pt || post.tags || []);
  const cover = getArticleCover(post);

  const formattedDate = new Date(post.createdAt).toLocaleDateString(isEn ? 'en-US' : 'pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <article
      onClick={() => onSelect(post)}
      className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-900/90 dark:via-zinc-900/60 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xs hover:shadow-xl cursor-pointer overflow-hidden mb-10"
    >
      {cover && <img src={cover} alt={post.image_alt || title} decoding="async" width="1200" height="896" className="mb-6 h-[clamp(220px,32vw,420px)] w-full rounded-2xl object-cover" />}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 group-hover:bg-emerald-500/10 rounded-full blur-3xl transition-all pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500 text-white dark:text-zinc-950 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'Featured' : 'Destaque'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <span>{formattedDate}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {getPostReadingTime(post)}
          </span>
        </div>
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-mono text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight mb-3">
        {title}
      </h2>

      {subtitle && (
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed mb-6 max-w-3xl">
          {subtitle}
        </p>
      )}

      {/* Footer / Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(post.id);
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLiked ? 'text-rose-500 font-bold' : 'text-zinc-500 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
            <span>{post.likes || 0}</span>
          </button>

          <span className="flex items-center gap-1.5 text-zinc-500">
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentsCount ?? post.comments?.length ?? 0}</span>
          </span>

          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
            <span>{isEn ? 'Read Article' : 'Ler Artigo'}</span>
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
