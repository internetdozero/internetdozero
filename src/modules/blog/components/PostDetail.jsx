import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, Globe, Clock, Check } from 'lucide-react';
import { PostComments } from './PostComments';

export function PostDetail({ post, isLiked, onToggleLike, onAddComment, postLang = 'pt' }) {
  const [copied, setCopied] = useState(false);

  const isBilingual = Boolean(post.bilingual);
  const title = isBilingual && postLang === 'en' ? (post.title_en || post.title) : (post.title_pt || post.title);
  const content = isBilingual && postLang === 'en' ? (post.content_en || post.content_pt) : (post.content_pt || post.content);

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (_) {}
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Post Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-500 mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
            {post.type === 'thought' ? '💭 Pensamento' : post.type === 'article' ? '📰 Artigo' : '📖 História'}
          </span>
          <span>Por @{post.author || 'senhor'}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {post.readingTime || '2 min'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-mono text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
          {title}
        </h1>

        {post.subtitle && (
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {post.subtitle}
          </p>
        )}
      </header>

      {/* Post Content */}
      <div className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 font-sans text-base sm:text-lg leading-relaxed whitespace-pre-line mb-10">
        {content}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between py-4 border-y border-zinc-200 dark:border-zinc-800 font-mono text-xs">
        <button
          onClick={() => onToggleLike(post.id)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            isLiked
              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 font-bold'
              : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-rose-500/40'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
          <span>{post.likes || 0} Curtidas</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500/40 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-emerald-500" />}
          <span>{copied ? 'Link Copiado!' : 'Compartilhar'}</span>
        </button>
      </div>

      {/* Comments Area */}
      <PostComments
        comments={post.comments || []}
        onAddComment={(commentData) => onAddComment(post.id, commentData)}
      />
    </div>
  );
}
