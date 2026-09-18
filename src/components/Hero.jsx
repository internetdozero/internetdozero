import React from 'react';
import { translations } from '../i18n/translations';

export function Hero({ onOpenArsenal, onScrollToGrid, lang = 'pt' }) {
  const t = translations[lang] || translations.pt;

  return (
    <section className="relative home-glow overflow-hidden pt-16 pb-10 md:pt-24 md:pb-14">
      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <p className="mb-4 inline-flex rounded-full bg-[color-mix(in_srgb,var(--icon)_14%,transparent)] px-3 py-1 text-sm icon-accent">
          {t.hero.badgeCentral}
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-stone-900 dark:text-stone-50 sm:text-5xl md:text-6xl">
          Internet do Zero
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-stone-600 dark:text-stone-300">
          {t.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onScrollToGrid}
            className="cursor-pointer rounded-full bg-[var(--icon)] px-6 py-2.5 text-sm font-semibold text-[#2a1f0e] hover:brightness-110"
          >
            {t.hero.btnModules}
          </button>
          <button
            type="button"
            onClick={onOpenArsenal}
            className="cursor-pointer rounded-full border border-stone-300 bg-white/70 px-5 py-2.5 text-sm text-stone-700 hover:border-[var(--icon)] dark:border-stone-700 dark:bg-stone-900/70 dark:text-stone-200"
          >
            {t.hero.btnConsole}
          </button>
        </div>
      </div>
    </section>
  );
}
