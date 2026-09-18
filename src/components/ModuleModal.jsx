import React, { useEffect } from 'react';
import { X, ArrowUpRight, ExternalLink } from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';

export function ModuleModal({ module, onClose, onOpenArsenal, lang = 'pt' }) {
  const isEn = lang === 'en';
  const title = (isEn && module.title_en) ? module.title_en : (module.title_pt || module.title);
  const subtitle = (isEn && module.subtitle_en) ? module.subtitle_en : (module.subtitle_pt || module.subtitle);
  const description = (isEn && module.description_en) ? module.description_en : (module.description_pt || module.description);
  const statusLabel = (isEn && module.statusLabel_en) ? module.statusLabel_en : (module.statusLabel_pt || module.statusLabel);
  const badge = (isEn && module.badge_en) ? module.badge_en : (module.badge_pt || module.badge);
  const tags = (isEn && module.tags_en) ? module.tags_en : (module.tags_pt || module.tags);

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  if (!module) return null;

  return (
    <div role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="module-modal-title"
        className="w-full max-w-xl rounded-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-sm border border-stone-200 dark:border-stone-700">
              <DynamicIcon name={module.icon} className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="module-modal-title" className="text-xl font-serif font-semibold text-stone-900 dark:text-stone-50">
                  {title}
                </h3>
                {badge && (
                  <span className="px-2 py-0.5 text-xs text-stone-500">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                {subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label={isEn ? 'Close module' : 'Fechar módulo'}
            onClick={onClose}
            className="p-2 rounded-sm text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wider block mb-1">
              {isEn ? 'About' : 'Sobre'}
            </span>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Status & Stats */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-sm bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 text-xs">
            <div>
              <span className="text-stone-500 block mb-0.5">{isEn ? 'Status' : 'Estado'}</span>
              <span className="font-medium text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                {statusLabel}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block mb-0.5">{module.stats?.label || (isEn ? 'Version' : 'Versão')}</span>
              <span className="font-medium text-stone-800 dark:text-stone-200">
                {module.stats?.value || 'v1.0'}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wider block mb-2">
              {isEn ? 'Tags' : 'Assuntos'}
            </span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs text-stone-600 dark:text-stone-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-6 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          {module.id === 'arsenal' ? (
            <button
              onClick={() => {
                onClose();
                onOpenArsenal();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-stone-900 hover:bg-stone-700 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 text-xs font-medium transition-colors"
            >
              <span>{isEn ? 'View Arsenal Commands' : 'Ver Comandos do Arsenal'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          ) : module.status === 'online' ? (
            <a
              href={module.href}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-stone-900 hover:bg-stone-700 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 text-xs font-medium transition-colors"
            >
              <span>{isEn ? `Open ${title}` : `Acessar ${title}`}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <div className="w-full flex items-center justify-between text-xs text-stone-500">
              <span>{isEn ? 'Still in progress' : 'Ainda em construção'}</span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-sm bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium cursor-pointer"
              >
                {isEn ? 'Back' : 'Voltar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
