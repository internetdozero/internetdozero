import React from 'react';
import { Sun, Moon, Search, ArrowLeft } from 'lucide-react';
import { translations } from '../i18n/translations';

export const Header = React.memo(function Header({
  theme,
  toggleTheme,
  onOpenCommand,
  onOpenArsenal,
  onGoHome,
  readingPost,
  lang = 'pt',
  onToggleLang,
  onBackToBlog
}) {
  const isDark = theme === 'dark';
  const t = translations[lang] || translations.pt;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/70 bg-[#f7f1e8]/90 dark:border-stone-800 dark:bg-stone-950/90 sm:backdrop-blur-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onGoHome}
            className="flex min-w-0 items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--icon)] text-[11px] font-semibold text-[#2a1f0e]" aria-hidden="true">
              0x
            </span>
            <span className="font-serif text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100 group-hover:underline underline-offset-4 decoration-stone-400">
              Internet do Zero
            </span>
          </button>

          {readingPost ? (
            <div className="flex items-center gap-2 pl-3 border-l border-stone-200 dark:border-stone-800">
              <button
                onClick={onBackToBlog}
                className="inline-flex items-center gap-1.5 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:underline underline-offset-4 cursor-pointer"
                title={t.header.backToBlogTitle}
              >
                <ArrowLeft className="w-3.5 h-3.5 icon-accent" />
                <span className="hidden sm:inline">{t.header.backToBlog}</span>
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onToggleLang(lang === 'pt' ? 'en' : 'pt')}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-white/80 dark:text-stone-400 dark:hover:bg-stone-900"
            aria-label={lang === 'pt' ? 'Mudar para inglês' : 'Mudar para português'}
            title={lang === 'pt' ? 'Mudar para English' : 'Mudar para Português'}
          >
            <span>{lang === 'pt' ? 'PT' : 'EN'}</span>
          </button>

          <button
            onClick={onOpenCommand}
            className="flex items-center gap-2 rounded-full px-2.5 py-1.5 text-sm text-stone-600 hover:bg-white/80 dark:text-stone-400 dark:hover:bg-stone-900"
            title={t.header.searchTitle}
          >
            <Search className="w-4 h-4 icon-accent" />
            <span className="hidden sm:inline">{t.header.search}</span>
          </button>

          <button
            onClick={onOpenArsenal}
            className="hidden md:inline-flex items-center rounded-full px-3 py-1.5 text-sm text-stone-600 hover:bg-white/80 dark:text-stone-400 dark:hover:bg-stone-900"
          >
            {t.header.terminal}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-stone-600 hover:bg-white/80 dark:text-stone-400 dark:hover:bg-stone-900"
            aria-label="Alternar tema"
            title={isDark ? t.header.themeLight : t.header.themeDark}
          >
            {isDark ? <Moon className="w-4 h-4 icon-accent" /> : <Sun className="w-4 h-4 icon-accent" />}
          </button>
        </div>
      </div>
    </header>
  );
})
