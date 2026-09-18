import React from 'react';
import { HelpCircle, ShieldCheck } from 'lucide-react';

export function ToolFaqSection({ toolMeta, lang = 'pt' }) {
  if (!toolMeta || !toolMeta.faq || toolMeta.faq.length === 0) return null;
  const isEn = lang === 'en';

  return (
    <section className="mt-12 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8" aria-labelledby="faq-heading">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
            <HelpCircle className="h-4 w-4" />
            <span>{isEn ? 'Frequently Asked Questions' : 'Perguntas Frequentes & Privacidade'}</span>
          </div>
          <h2 id="faq-heading" className="mt-2 font-mono text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">
            {isEn ? `About this tool` : `Dúvidas sobre o processamento local`}
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl bg-stone-500/10 px-3.5 py-2 text-xs font-mono font-medium text-stone-600 dark:text-stone-400">
          <ShieldCheck className="h-4 w-4" />
          <span>{isEn ? 'Zero Server Transmission' : '100% no seu dispositivo'}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {toolMeta.faq.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-5 dark:border-zinc-800/80 dark:bg-zinc-950/40">
            <h3 className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-start gap-2">
              <span className="text-stone-500 select-none">Q:</span>
              <span>{item.q}</span>
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 pl-5">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
