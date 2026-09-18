import React from 'react';
import { translations } from '../i18n/translations';

export function Hero({ onOpenArsenal, onScrollToGrid, lang = 'pt' }) {
  const t = translations[lang] || translations.pt;

  const folio = [
    { k: t.hero.statFocus, v: t.hero.statModulesCount },
    { k: t.hero.statContent, v: t.hero.statContentVal },
    { k: t.hero.statHobbies, v: t.hero.statHobbiesVal },
    { k: t.hero.statStatus, v: t.hero.statStatusVal },
  ];

  return (
    <section className="relative border-b border-stone-200 pt-14 pb-12 dark:border-stone-800 md:pt-20 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.22em] icon-accent">
          {t.hero.badgeCentral}
        </p>

        <div className="grid items-end gap-10 md:grid-cols-12">
          <h1 className="font-serif text-5xl font-semibold tracking-tight text-stone-900 dark:text-stone-50 sm:text-6xl md:col-span-7 md:text-7xl">
            Internet do Zero
          </h1>
          <div className="md:col-span-5">
            <div className="mb-5 h-px w-16 bg-[var(--icon)]" aria-hidden="true" />
            <p className="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
              {t.hero.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
              <button
                type="button"
                onClick={onScrollToGrid}
                className="rounded-sm bg-stone-900 px-5 py-2.5 font-medium text-stone-50 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 cursor-pointer"
              >
                {t.hero.btnModules}
              </button>
              <button
                type="button"
                onClick={onOpenArsenal}
                className="icon-accent underline underline-offset-4 decoration-[var(--icon)]/40 hover:decoration-[var(--icon)] cursor-pointer"
              >
                {t.hero.btnConsole}
              </button>
            </div>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-stone-200 pt-8 dark:border-stone-800 sm:grid-cols-4">
          {folio.map((item) => (
            <div key={item.k}>
              <dt className="text-[11px] uppercase tracking-wider text-stone-500">{item.k}</dt>
              <dd className="mt-1 font-serif text-base text-stone-900 dark:text-stone-100">{item.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
