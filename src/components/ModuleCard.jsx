import React from 'react';
import { DynamicIcon } from './DynamicIcon';
import { ArrowUpRight, Clock } from 'lucide-react';

export const ModuleCard = React.memo(function ModuleCard({ module, onSelect, lang = 'pt' }) {
  const isOnline = module.status === 'online';
  const isInProgress = module.status === 'in_progress';
  const isPlanned = module.status === 'planned';

  const title = (lang === 'en' && module.title_en) ? module.title_en : (module.title_pt || module.title);
  const subtitle = (lang === 'en' && module.subtitle_en) ? module.subtitle_en : (module.subtitle_pt || module.subtitle);
  const category = (lang === 'en' && module.category_en) ? module.category_en : (module.category_pt || module.category);
  const description = (lang === 'en' && module.description_en) ? module.description_en : (module.description_pt || module.description);
  const statusLabel = (lang === 'en' && module.statusLabel_en) ? module.statusLabel_en : (module.statusLabel_pt || module.statusLabel);
  const badge = (lang === 'en' && module.badge_en) ? module.badge_en : (module.badge_pt || module.badge);
  const tags = (lang === 'en' && module.tags_en) ? module.tags_en : (module.tags_pt || module.tags);

  return (
    <button
      type="button"
      onClick={() => onSelect(module)}
      aria-label={`${lang === 'en' ? 'Open' : 'Abrir'} ${title}`}
      className="group relative flex flex-col justify-between p-6 rounded-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-colors cursor-pointer text-left overflow-hidden"
    >
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] tracking-wide uppercase text-stone-500">
            {category}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-stone-500 whitespace-nowrap">
            {isInProgress && <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />}
            {isPlanned && <Clock className="w-3 h-3" />}
            {isOnline ? statusLabel : statusLabel}
          </span>
        </div>

        <div className="flex items-start gap-4 mb-3">
          <div className="p-2 rounded-sm border border-stone-200 dark:border-stone-700 shrink-0">
            <DynamicIcon name={module.icon} className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h3 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-50 group-hover:underline underline-offset-4">
                {title}
              </h3>
              {badge && (
                <span className="text-[10px] text-stone-500">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1 truncate">
              {subtitle}
            </p>
          </div>
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] text-stone-500"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs text-stone-500 group-hover:text-stone-900 dark:group-hover:text-stone-200">
          <span>{lang === 'en' ? 'Open' : 'Abrir'}</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
})
