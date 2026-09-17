import React, { useState, useEffect, useMemo } from 'react';
import { Share2, Clock, Heart } from 'lucide-react';
import { TableOfContents } from './TableOfContents';
import { PostComments } from './PostComments';
import { RichContent } from './RichContent';
import { ShareModal } from './ShareModal';
import { translations } from '../../../i18n/translations';
import { getPostReadingTime } from '../utils/readingTime';

export function PostDetail({ post, isLiked, onToggleLike, onAddComment, postLang = 'pt', onBack }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('');
  const t = translations[postLang] || translations.pt;
  const isEn = postLang === 'en';

  const title = (isEn && post.title_en) ? post.title_en : (post.title_pt || post.title);
  const subtitle = (isEn && post.subtitle_en) ? post.subtitle_en : (post.subtitle_pt || post.subtitle);
  const tags = (isEn && post.tags_en) ? post.tags_en : (post.tags_pt || post.tags || []);

  const sections = useMemo(() => {
    const raw = (isEn && post.sections_en) ? post.sections_en : (post.sections_pt || post.sections);
    return raw || [
      { id: 'intro', title: isEn ? 'Introduction' : 'Introdução', content: (isEn && post.content_en) ? post.content_en : (post.content_pt || post.content || '') }
    ];
  }, [post, isEn]);

  useEffect(() => {
    if (!sections.length) return;
    setActiveSectionId(sections[0].id);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSectionId(entry.target.id);
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleScrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSectionId(id);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        const slug = (isEn && post.slug_en ? post.slug_en : post.slug) || post.slug || post.slug_en || post.id;
        const shareUrl = `${window.location.origin}/blog/${encodeURIComponent(slug)}`;
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (_) {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row items-start gap-12">
        <aside className="w-full lg:w-60 flex-shrink-0 lg:sticky lg:top-24 self-start">
          <TableOfContents sections={sections} onBack={onBack} activeSectionId={activeSectionId} onSelectSection={handleScrollToSection} lang={postLang} />
        </aside>

        <article className="flex-1 min-w-0 max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-zinc-500">
              <span className="text-[11px]">{t.blog.share}:</span>
              <button
                onClick={() => setIsShareOpen(true)}
                className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-500 transition-colors cursor-pointer"
                title={t.blog.share}
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="pt-6 pb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
              {title}
            </h1>

            {subtitle && (
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed mb-6">
                {subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500">
              <span>{new Date(post.createdAt).toLocaleDateString(isEn ? 'en-US' : 'pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span>/</span>
              <span>{t.blog.authorLabel} @{post.author || 'senhor'}</span>
              <span>/</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" />
                {getPostReadingTime(post)} {t.blog.readingTime}
              </span>
            </div>
          </div>

          <div className="space-y-12 mb-14">
            {sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-zinc-900 dark:text-white mb-5 tracking-tight">
                  {sec.title}
                </h2>
                <RichContent content={sec.content} />
              </section>
            ))}
          </div>

          <div className="flex items-center justify-between py-6 border-y border-zinc-200 dark:border-zinc-800 font-mono text-xs">
            <button onClick={() => onToggleLike(post.id)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${isLiked ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 font-bold' : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-rose-500/40'}`}>
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
              <span>{post.likes || 0} {isEn ? 'Likes' : 'Curtidas'}</span>
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-500 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-emerald-500" />
              <span>{t.blog.share}</span>
            </button>
          </div>

          <PostComments comments={post.comments || []} onAddComment={(data) => onAddComment(post.id, data)} lang={postLang} />
        </article>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        post={post}
        isEn={isEn}
      />
    </div>
  );
}
