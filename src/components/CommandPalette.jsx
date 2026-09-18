import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, ArrowRight, Terminal, Globe } from 'lucide-react';
import { modulesData } from '../data/modules';
import { translations } from '../i18n/translations';

export function CommandPalette({ isOpen, onClose, onSelectModule, theme, toggleTheme, onOpenArsenal, lang = 'pt', toggleLang }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const t = translations[lang] || translations.pt;
  const isEn = lang === 'en';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => setActiveIndex(0), [query]);

  if (!isOpen) return null;

  const filteredModules = modulesData.filter((m) => {
    const title = (isEn && m.title_en) ? m.title_en : (m.title_pt || m.title);
    const subtitle = (isEn && m.subtitle_en) ? m.subtitle_en : (m.subtitle_pt || m.subtitle);
    const category = (isEn && m.category_en) ? m.category_en : (m.category_pt || m.category);
    const tags = (isEn && m.tags_en) ? m.tags_en : (m.tags_pt || m.tags);
    const text = `${title} ${subtitle} ${category} ${tags.join(' ')}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200 dark:border-stone-800">
          <Search className="w-5 h-5 icon-accent mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t.command.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t.command.placeholder}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') { event.preventDefault(); setActiveIndex((index) => Math.min(index + 1, filteredModules.length - 1)); }
              if (event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex((index) => Math.max(index - 1, 0)); }
              if (event.key === 'Enter' && filteredModules[activeIndex]) { onSelectModule(filteredModules[activeIndex]); onClose(); }
            }}
            className="w-full bg-transparent text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 rounded-sm text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-500 border border-stone-200 dark:border-stone-700">
            ESC
          </kbd>
        </div>

        <div id="command-results" className="max-h-80 overflow-y-auto p-2 divide-y divide-stone-100 dark:divide-stone-800/40">
          <div className="py-2">
            <div className="px-3 py-1 text-[10px] tracking-wider text-stone-400 uppercase">
              {t.command.catActions}
            </div>

            <button
              onClick={() => {
                toggleLang?.();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-sm hover:bg-stone-100 dark:hover:bg-stone-800/80 text-xs text-left transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 icon-accent" />
                <span className="text-stone-800 dark:text-stone-200">{t.command.langAction} (Ativo: {lang.toUpperCase()})</span>
              </div>
              <span className="text-[10px] text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200">{isEn ? 'Switch' : 'Alternar'}</span>
            </button>

            <button
              onClick={() => {
                toggleTheme();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-sm hover:bg-stone-100 dark:hover:bg-stone-800/80 text-xs text-left transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? <Sun className="w-4 h-4 icon-accent" /> : <Moon className="w-4 h-4 icon-accent" />}
                <span className="text-stone-800 dark:text-stone-200">{t.command.themeAction}</span>
              </div>
              <span className="text-[10px] text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200">{isEn ? 'Toggle' : 'Alternar'}</span>
            </button>

            {onOpenArsenal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenArsenal();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-sm hover:bg-stone-100 dark:hover:bg-stone-800/80 text-xs text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 icon-accent" />
                  <span className="text-stone-800 dark:text-stone-200">{t.command.openArsenal}</span>
                </div>
                <span className="text-[10px] text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200">{isEn ? 'Open' : 'Abrir'}</span>
              </button>
            )}
          </div>

          <div className="py-2">
            <div className="px-3 py-1 text-[10px] tracking-wider text-stone-400 uppercase">
              {t.command.catModules} ({filteredModules.length})
            </div>

            {filteredModules.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-stone-500">
                {t.command.noResults}
              </div>
            ) : (
              filteredModules.map((m) => {
                const title = (isEn && m.title_en) ? m.title_en : (m.title_pt || m.title);
                const subtitle = (isEn && m.subtitle_en) ? m.subtitle_en : (m.subtitle_pt || m.subtitle);

                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModule(m);
                      onClose();
                    }}
                    aria-selected={filteredModules.indexOf(m) === activeIndex}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm hover:bg-stone-100 dark:hover:bg-stone-800/80 text-xs text-left transition-colors group cursor-pointer ${filteredModules.indexOf(m) === activeIndex ? 'bg-stone-100 dark:bg-stone-800/80' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-stone-900 dark:text-stone-100 mr-2">{title}</span>
                        <span className="text-stone-500 dark:text-stone-400">{subtitle}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 shrink-0 ml-2" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="px-4 py-2 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
          <span>Internet do Zero</span>
          <span>{t.command.escToClose}</span>
        </div>
      </div>
    </div>
  );
}
