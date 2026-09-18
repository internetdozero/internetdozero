import React from 'react';
import { translations } from '../i18n/translations';

export function Hero({ onOpenArsenal, onScrollToGrid, lang = 'pt' }) {
  const t = translations[lang] || translations.pt;

  return (
    <section className="relative pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
          {t.hero.badgeCentral}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          Internet do Zero
        </h1>
        <p className="mt-6 max-w-xl text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
          {t.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <button
            type="button"
            onClick={onScrollToGrid}
            className="text-stone-900 dark:text-stone-100 underline underline-offset-4 decoration-stone-400 hover:decoration-stone-800 dark:hover:decoration-stone-200 cursor-pointer"
          >
            {t.hero.btnModules}
          </button>
          <button
            type="button"
            onClick={onOpenArsenal}
            className="text-stone-500 hover:text-stone-900 hover:underline underline-offset-4 dark:hover:text-stone-200 cursor-pointer"
          >
            {t.hero.btnConsole}
          </button>
        </div>
      </div>
    </section>
  );
}
