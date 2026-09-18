import React from 'react';
import { translations } from '../i18n/translations';

export function NotFound({ onGoHome, onGoBlog, lang = 'pt' }) {
  const t = translations[lang]?.notFound || translations.pt.notFound;
  return (
    <main className="mx-auto flex min-h-[62vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs tracking-wide uppercase text-stone-500">{t.eyebrow}</p>
      <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-stone-900 dark:text-stone-50 sm:text-6xl">{t.title}</h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-stone-500 dark:text-stone-400">{t.description}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onGoHome} className="rounded-sm bg-stone-900 px-4 py-2.5 text-xs font-medium text-stone-50 transition-colors hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:bg-stone-100 dark:text-stone-900">{t.home}</button>
        <button type="button" onClick={onGoBlog} className="rounded-sm border border-stone-300 px-4 py-2.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-500 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:border-stone-700 dark:text-stone-300">{t.blog}</button>
      </div>
    </main>
  );
}
