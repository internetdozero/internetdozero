import React from 'react';
import { ArrowLeft, ArrowRight, Image, KeyRound, Wrench } from 'lucide-react';
import { ImageCompressor } from './components/ImageCompressor';
import { PasswordGenerator } from './components/PasswordGenerator';

export function ToolsView({ onNavigate, toolSlug, lang = 'pt' }) {
  const isEn = lang === 'en';
  const isCompressor = toolSlug === 'compressor-de-imagem';
  const isPasswordGenerator = toolSlug === 'gerador-de-senhas';
  const compressorPath = isEn ? '/tools/image-compressor' : '/tools/compressor-de-imagem';
  const passwordGeneratorPath = isEn ? '/tools/password-generator' : '/tools/gerador-de-senhas';

  if (isCompressor) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <button type="button" onClick={() => onNavigate('/tools')} className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500">
          <ArrowLeft className="h-3.5 w-3.5" />
          {isEn ? 'Back to tools' : 'Voltar às ferramentas'}
        </button>
        <ImageCompressor lang={lang} />
      </main>
    );
  }

  if (isPasswordGenerator) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <button type="button" onClick={() => onNavigate('/tools')} className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500">
          <ArrowLeft className="h-3.5 w-3.5" />
          {isEn ? 'Back to tools' : 'Voltar às ferramentas'}
        </button>
        <PasswordGenerator lang={lang} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <button type="button" onClick={() => onNavigate('/')} className="mb-8 inline-flex w-fit items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500">
        <ArrowLeft className="h-3.5 w-3.5" />
        {isEn ? 'Back to home' : 'Voltar ao início'}
      </button>
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
        <Wrench className="h-6 w-6" />
      </div>
      <h1 className="mt-3 font-mono text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
        {isEn ? 'Tools for real life.' : 'Ferramentas para a vida real.'}
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
        {isEn ? 'Simple utilities, processed in your browser. No accounts, no uploads, no noise.' : 'Utilitários simples, processados no seu navegador. Sem cadastro, sem upload, sem barulho.'}
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <button type="button" onClick={() => onNavigate(compressorPath)} className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><Image className="h-5 w-5" /></span>
            <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" />
          </div>
          <h2 className="mt-5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? 'Image compressor' : 'Compressor de imagens'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Reduce file size locally and download the result.' : 'Reduza o tamanho do arquivo localmente e baixe o resultado.'}</p>
          <span className="mt-4 inline-block font-mono text-[11px] text-emerald-500">{compressorPath}</span>
        </button>
        <button type="button" onClick={() => onNavigate(passwordGeneratorPath)} className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"><KeyRound className="h-5 w-5" /></span>
            <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" />
          </div>
          <h2 className="mt-5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? 'Password generator' : 'Gerador de senhas'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Create strong passwords locally in a few seconds.' : 'Crie senhas fortes localmente em poucos segundos.'}</p>
          <span className="mt-4 inline-block font-mono text-[11px] text-emerald-500">{passwordGeneratorPath}</span>
        </button>
      </div>
    </main>
  );
}
