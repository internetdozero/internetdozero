import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, Smartphone } from 'lucide-react';
import { getSocialLinks } from '../utils/socialShare';
import { getPostReadingTime } from '../utils/readingTime';

export function ShareModal({ isOpen, onClose, post, isEn = false }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const title = (isEn && post.title_en) ? post.title_en : (post.title_pt || post.title || '');
  const subtitle = (isEn && post.subtitle_en) ? post.subtitle_en : (post.subtitle_pt || post.subtitle || '');
  const slug = (isEn && post.slug_en ? post.slug_en : post.slug) || post.slug || post.slug_en || post.id;
  const category = post.category || post.tags_pt?.[0] || post.tags?.[0] || 'Geral';
  const categorySlug = category.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${categorySlug}/${encodeURIComponent(slug)}` : '';
  const shareText = `${title} — Internet do Zero`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (_) {}
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: subtitle || shareText,
          url: shareUrl,
        });
      } catch (_) {}
    }
  };

  const socialLinks = getSocialLinks(title, shareUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-500" />
            <h3 className="font-mono font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">
              {isEn ? 'Share Article' : 'Compartilhar Publicação'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Card Preview Estilizado */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">0x // Internet do Zero</span>
              <span>{getPostReadingTime(post)}</span>
            </div>
            <h4 className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
              {title}
            </h4>
            {subtitle && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans line-clamp-2">
                {subtitle}
              </p>
            )}
          </div>

          {/* Botões de Redes Sociais */}
          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-2">
              {isEn ? 'Share directly via:' : 'Compartilhar diretamente via:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-mono text-xs font-medium transition-all shadow-xs cursor-pointer ${s.color}`}
                >
                  {s.icon}
                  <span>{s.name}</span>
                </a>
              ))}

              {/* Botão de Compartilhar Nativo (Celular) */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-mono text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer col-span-2 sm:col-span-1"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isEn ? 'More Apps' : 'Mais Apps'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Campo Copiar Link */}
          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1.5">
              {isEn ? 'Or copy page link:' : 'Ou copie o link direto:'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 focus:outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono font-bold text-xs transition-all cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isEn ? 'Copied!' : 'Copiado!') : (isEn ? 'Copy' : 'Copiar')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
