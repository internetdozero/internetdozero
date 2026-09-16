import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, ArrowRight, Terminal, Globe } from 'lucide-react';
import { modulesData } from '../data/modules';
import { translations } from '../i18n/translations';

export function CommandPalette({ isOpen, onClose, onSelectModule, theme, toggleTheme, onOpenArsenal, lang = 'pt', toggleLang }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const t = translations[lang] || translations.pt;
  const isEn = lang === 'en';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Escape' && isOpen) {
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t.command.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none font-mono"
          />
          <kbd className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-zinc-100 dark:divide-zinc-800/40">
          
          {/* Quick system actions */}
          <div className="py-2">
            <div className="px-3 py-1 text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase">
              {t.command.catActions}
            </div>

            <button
              onClick={() => {
                toggleLang?.();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-xs font-mono text-left transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span className="text-zinc-800 dark:text-zinc-200">{t.command.langAction} (Ativo: {lang.toUpperCase()})</span>
              </div>
              <span className="text-[10px] text-zinc-400 group-hover:text-emerald-500">{isEn ? 'Switch' : 'Alternar'}</span>
            </button>
            
            <button
              onClick={() => {
                toggleTheme();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-xs font-mono text-left transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
                <span className="text-zinc-800 dark:text-zinc-200">{t.command.themeAction}</span>
              </div>
              <span className="text-[10px] text-zinc-400 group-hover:text-emerald-500">{isEn ? 'Toggle' : 'Alternar'}</span>
            </button>

            {onOpenArsenal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenArsenal();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-xs font-mono text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span className="text-zinc-800 dark:text-zinc-200">{t.command.openArsenal}</span>
                </div>
                <span className="text-[10px] text-zinc-400 group-hover:text-emerald-500">{isEn ? 'Open' : 'Abrir'}</span>
              </button>
            )}
          </div>

          {/* Modules section */}
          <div className="py-2">
            <div className="px-3 py-1 text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase">
              {t.command.catModules} ({filteredModules.length})
            </div>

            {filteredModules.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-zinc-500 font-mono">
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
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-xs font-mono text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 mr-2">{title}</span>
                        <span className="text-zinc-500 dark:text-zinc-400">{subtitle}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Internet do Zero Quick Search</span>
          <span>{t.command.escToClose}</span>
        </div>
      </div>
    </div>
  );
}
