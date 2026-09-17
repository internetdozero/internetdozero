import React, { useMemo, useState } from 'react';
import { Clipboard, FileText, ShieldCheck } from 'lucide-react';

const initialText = '';

function formatReadingTime(words) {
  if (!words) return '0 min';
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

export function TextCounter({ lang = 'pt' }) {
  const isEn = lang === 'en';
  const [text, setText] = useState(initialText);
  const metrics = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const characters = text.length;
    const withoutSpaces = text.replace(/\s/g, '').length;
    const density = characters ? Math.round((words / characters) * 1000) / 10 : 0;
    return { words, lines, characters, withoutSpaces, density };
  }, [text]);

  const copyText = async () => {
    if (!text) return;
    await navigator.clipboard?.writeText(text);
  };

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60" aria-labelledby="text-counter-title">
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-500">texto local</p>
            <h2 id="text-counter-title" className="mt-2 font-mono text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{isEn ? 'Text counter' : 'Contador de texto'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Count words, characters and reading time as you write.' : 'Conte palavras, caracteres e tempo de leitura enquanto escreve.'}</p>
          </div>
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-500" aria-label={isEn ? 'Local processing' : 'Processamento local'} />
        </div>
      </div>
      <div className="space-y-4 p-5 sm:p-7">
        <div>
          <label htmlFor="text-counter-input" className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">{isEn ? 'Your text' : 'Seu texto'}</label>
          <textarea id="text-counter-input" value={text} onChange={(event) => setText(event.target.value)} placeholder={isEn ? 'Start typing or paste your text here…' : 'Comece a escrever ou cole seu texto aqui…'} className="min-h-[22rem] w-full resize-y rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-base leading-relaxed text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-200 dark:placeholder:text-zinc-600" />
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-zinc-500"><span>{isEn ? 'Nothing leaves this browser.' : 'Nada sai deste navegador.'}</span><button type="button" onClick={copyText} disabled={!text} className="inline-flex items-center gap-1.5 font-semibold transition-colors hover:text-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"><Clipboard className="h-3.5 w-3.5" />{isEn ? 'Copy text' : 'Copiar texto'}</button></div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-emerald-500" /><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{isEn ? 'Live stats' : 'Contagem ao vivo'}</p></div>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[[isEn ? 'Words' : 'Palavras', metrics.words], [isEn ? 'Characters' : 'Caracteres', metrics.characters], [isEn ? 'No spaces' : 'Sem espaços', metrics.withoutSpaces], [isEn ? 'Lines' : 'Linhas', metrics.lines]].map(([label, value]) => <div key={label} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"><dt className="text-[10px] text-zinc-500">{label}</dt><dd className="mt-0.5 font-mono text-lg font-bold text-zinc-900 dark:text-white">{value}</dd></div>)}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2"><dt className="text-[10px] text-zinc-500">{isEn ? 'Reading time' : 'Leitura'}</dt><dd className="mt-0.5 font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatReadingTime(metrics.words)}</dd></div>
          </dl>
          <p className="mt-4 text-[11px] leading-relaxed text-zinc-500">{isEn ? `${metrics.density} words per 100 characters.` : `${metrics.density} palavras a cada 100 caracteres.`}</p>
        </div>
      </div>
    </section>
  );
}
