import React from 'react';
import { Sun, Moon, Search, Terminal, ArrowLeft, Globe } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Context */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onGoHome}
            className="flex min-w-0 items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-900 dark:bg-zinc-900 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-emerald-500 text-base shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:border-emerald-400 group-hover:scale-105 transition-all">
              0x
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="whitespace-nowrap font-mono text-xs font-extrabold tracking-[0.08em] text-zinc-900 transition-colors group-hover:text-emerald-500 dark:text-zinc-100 dark:group-hover:text-emerald-400 sm:text-sm sm:tracking-wider">
                Internet do Zero
              </span>
              <span className="hidden text-[10px] font-mono tracking-widest text-emerald-600 uppercase dark:text-emerald-400 sm:block">
                {t.header.brandSub}
              </span>
            </div>
          </button>

          {/* Reading Mode: Back to Blog button */}
          {readingPost ? (
            <div className="flex items-center gap-2 pl-3 border-l border-zinc-200 dark:border-zinc-800">
              <button
                onClick={onBackToBlog}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer"
                title={t.header.backToBlogTitle}
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">{t.header.backToBlog}</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 ml-4 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t.header.online}</span>
              <span className="text-zinc-400 dark:text-zinc-600">|</span>
              <span className="text-zinc-500 dark:text-zinc-400">{t.header.version}</span>
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Language Switcher (PT / EN) */}
          <div className="inline-flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 font-mono text-xs">
            <Globe className="w-3.5 h-3.5 text-emerald-500 ml-1.5 mr-1" />
            <button
              onClick={() => onToggleLang('pt')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                lang === 'pt' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Português"
            >
              PT
            </button>
            <button
              onClick={() => onToggleLang('en')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                lang === 'en' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Quick Search / Command Palette Button */}
          <button
            onClick={onOpenCommand}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-emerald-500/50 transition-all text-xs font-mono"
            title={t.header.searchTitle}
          >
            <Search className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">{t.header.search}</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
              Ctrl+K
            </kbd>
          </button>

          {/* Quick Arsenal Button */}
          <button
            onClick={onOpenArsenal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all text-xs font-mono font-medium"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden md:inline">{t.header.terminal}</span>
          </button>


          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
            aria-label="Alternar tema"
            title={isDark ? t.header.themeLight : t.header.themeDark}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-emerald-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-600 hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
})
