import React from 'react';
import { ArrowLeft, Wrench } from 'lucide-react';
import { ImageCompressor } from './components/ImageCompressor';

export function ToolsView({ onNavigate, lang = 'pt' }) {
  const isEn = lang === 'en';

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <button type="button" onClick={() => onNavigate('/')} className="mb-8 inline-flex w-fit items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500">
        <ArrowLeft className="h-3.5 w-3.5" />
        {isEn ? 'Back to home' : 'Voltar ao início'}
      </button>
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
        <Wrench className="h-6 w-6" />
      </div>
      <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-emerald-500">/tools</p>
      <h1 className="mt-3 font-mono text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
        {isEn ? 'Tools for real life.' : 'Ferramentas para a vida real.'}
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
        {isEn ? 'Simple utilities, processed in your browser. No accounts, no uploads, no noise.' : 'Utilitários simples, processados no seu navegador. Sem cadastro, sem upload, sem barulho.'}
      </p>
      <ImageCompressor lang={lang} />
    </main>
  );
}
