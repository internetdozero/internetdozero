import React from 'react';
import { DynamicIcon } from './DynamicIcon';
import { ArrowUpRight, Clock } from 'lucide-react';

export function ModuleCard({ module, onSelect, lang = 'pt' }) {
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

  const statusBadgeClasses = isOnline
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50'
    : isInProgress
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700/50'
    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border-zinc-300 dark:border-zinc-800';

  return (
    <div
      onClick={() => onSelect(module)}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] cursor-pointer hover:-translate-y-1 overflow-hidden"
    >
      {/* Corner subtle glow on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/0 group-hover:bg-emerald-500/10 rounded-bl-full blur-2xl transition-all pointer-events-none" />

      <div>
        {/* Top bar: Category + Status */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-mono font-medium tracking-wider uppercase text-zinc-500 dark:text-zinc-500">
            {category}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${statusBadgeClasses}`}>
            {isOnline && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            {isInProgress && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
            {isPlanned && <Clock className="w-3 h-3" />}
            {statusLabel}
          </span>
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-3">
          <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/60 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black dark:group-hover:text-black transition-all">
            <DynamicIcon name={module.icon} className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold font-mono text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {title}
              </h3>
              {badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-emerald-600 dark:text-emerald-500 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed line-clamp-3 mb-5">
          {description}
        </p>
      </div>

      {/* Bottom bar: Tags + Action */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
          <span>{lang === 'en' ? 'Open' : 'Abrir'}</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
