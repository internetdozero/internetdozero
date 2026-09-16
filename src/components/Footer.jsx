import React from 'react';
import { Terminal, Sparkles } from 'lucide-react';
import { translations } from '../i18n/translations';

export function Footer({ onOpenArsenal, lang = 'pt' }) {
  const t = translations[lang] || translations.pt;
  const isEn = lang === 'en';

  return (
    <footer className="mt-20 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-zinc-200 dark:border-zinc-800/60">
          
          {/* Left Brand info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-zinc-900 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-emerald-500 text-xs">
                0x
              </div>
              <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Internet do Zero
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-sans max-w-sm">
              {t.footer.tagline}
            </p>
          </div>

          {/* Center / Right Links */}
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-zinc-600 dark:text-zinc-400">
            <button
              onClick={onOpenArsenal}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.footer.terminal}</span>
            </button>

            <a
              href="#modulos"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.footer.modules}</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} Internet do Zero.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-zinc-500 dark:text-zinc-400">
              {isEn ? '// all systems operational' : '// todos os sistemas operacionais'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
