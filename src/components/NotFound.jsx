import React from 'react';
import { translations } from '../i18n/translations';

export function NotFound({ onGoHome, onGoBlog, lang = 'pt' }) {
  const t = translations[lang]?.notFound || translations.pt.notFound;
  return (
    <main className="mx-auto flex min-h-[62vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-emerald-500">{t.eyebrow}</p>
      <h1 className="mt-4 font-mono text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-7xl">{t.title}</h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{t.description}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onGoHome} className="rounded-xl bg-emerald-500 px-4 py-2.5 font-mono text-xs font-bold text-zinc-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">{t.home}</button>
        <button type="button" onClick={onGoBlog} className="rounded-xl border border-zinc-200 px-4 py-2.5 font-mono text-xs font-bold text-zinc-600 transition-colors hover:border-emerald-500/50 hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-zinc-800 dark:text-zinc-300">{t.blog}</button>
      </div>
    </main>
  );
}
