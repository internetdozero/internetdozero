import React, { useState } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { translations } from '../../../i18n/translations';

export function TableOfContents({ sections = [], onBack, activeSectionId, onSelectSection, lang = 'pt' }) {
  const [isOpen, setIsOpen] = useState(true);
  const t = translations[lang] || translations.pt;
  const isEn = lang === 'en';

  return (
    <nav className="font-mono text-xs text-zinc-600 dark:text-zinc-400 space-y-4 select-none">
      {/* Botão Voltar */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer group py-1"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        <span>{isEn ? 'Back' : 'Voltar'}</span>
      </button>

      {/* Box do Índice "Neste artigo" */}
      {sections.length > 0 && (
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between font-bold text-zinc-800 dark:text-zinc-200 hover:text-emerald-500 transition-colors py-1 cursor-pointer"
          >
            <span className="uppercase tracking-wider text-[11px]">{t.blog.tableOfContents}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isOpen && (
            <ul className="mt-3 space-y-2 border-l border-zinc-200 dark:border-zinc-800 pl-3 font-sans text-xs">
              {sections.map((sec) => {
                const isActive = activeSectionId === sec.id;
                return (
                  <li key={sec.id}>
                    <button
                      onClick={() => onSelectSection(sec.id)}
                      className={`text-left transition-all cursor-pointer block leading-snug py-0.5 ${
                        isActive
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold translate-x-0.5'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                      }`}
                    >
                      {sec.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </nav>
  );
}
