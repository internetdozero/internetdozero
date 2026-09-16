import React from 'react';
import { X, ArrowUpRight, ExternalLink } from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';

export function ModuleModal({ module, onClose, onOpenArsenal, lang = 'pt' }) {
  if (!module) return null;

  const isEn = lang === 'en';
  const title = (isEn && module.title_en) ? module.title_en : (module.title_pt || module.title);
  const subtitle = (isEn && module.subtitle_en) ? module.subtitle_en : (module.subtitle_pt || module.subtitle);
  const description = (isEn && module.description_en) ? module.description_en : (module.description_pt || module.description);
  const statusLabel = (isEn && module.statusLabel_en) ? module.statusLabel_en : (module.statusLabel_pt || module.statusLabel);
  const badge = (isEn && module.badge_en) ? module.badge_en : (module.badge_pt || module.badge);
  const tags = (isEn && module.tags_en) ? module.tags_en : (module.tags_pt || module.tags);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <DynamicIcon name={module.icon} className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
                  {title}
                </h3>
                {badge && (
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                {subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              {isEn ? 'About Module' : 'Sobre o Módulo'}
            </span>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
              {description}
            </p>
          </div>

          {/* Status & Stats */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 font-mono text-xs">
            <div>
              <span className="text-zinc-500 dark:text-zinc-500 block mb-0.5">{isEn ? 'Current Status' : 'Status Atual'}</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                {module.status === 'online' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                {statusLabel}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-500 block mb-0.5">{module.stats?.label || (isEn ? 'Version' : 'Versão')}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {module.stats?.value || 'v1.0'}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
              {isEn ? 'Stack & Technologies' : 'Stack & Tecnologias'}
            </span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          {module.id === 'arsenal' ? (
            <button
              onClick={() => {
                onClose();
                onOpenArsenal();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black font-mono font-bold text-xs transition-colors"
            >
              <span>{isEn ? 'View Arsenal Commands' : 'Ver Comandos do Arsenal'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          ) : module.status === 'online' ? (
            <a
              href={module.href}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black font-mono font-bold text-xs transition-colors"
            >
              <span>{isEn ? `Open ${title}` : `Acessar ${title}`}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <div className="w-full flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>{isEn ? 'Module under construction' : 'Módulo em fase de construção'}</span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold cursor-pointer"
              >
                {isEn ? 'Back to Hub' : 'Voltar ao Hub'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
