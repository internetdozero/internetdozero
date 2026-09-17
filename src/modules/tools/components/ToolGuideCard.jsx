import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';

const examples = {
  pt: [
    ['Vai publicar uma imagem?', 'Tire os metadados e reduza o tamanho antes de postar.', 'remover-metadados', 'Removedor de metadados'],
    ['O áudio ficou comprido?', 'Corte o começo, o fim ou só guarde o trecho importante.', 'cortador-de-audio', 'Cortador de áudio'],
    ['Uma conta nova apareceu?', 'Gere uma senha diferente e copie sem guardar no site.', 'gerador-de-senhas', 'Gerador de senhas'],
    ['Precisa revisar um texto?', 'Conte palavras, caracteres e tempo de leitura enquanto escreve.', 'contador-de-texto', 'Contador de texto']
  ],
  en: [
    ['Publishing an image?', 'Remove metadata and reduce its size before sharing.', 'metadata-remover', 'Metadata remover'],
    ['Audio too long?', 'Cut the beginning, the end, or keep only what matters.', 'audio-trimmer', 'Audio trimmer'],
    ['Creating an account?', 'Generate a different password and copy it locally.', 'password-generator', 'Password generator'],
    ['Reviewing a draft?', 'Count words, characters and reading time as you write.', 'text-counter', 'Text counter']
  ]
};

export function ToolGuideCard({ onNavigate, currentSlug, lang = 'pt' }) {
  const isEn = lang === 'en';
  const items = (examples[lang] || examples.pt).filter(([, , slug]) => slug !== currentSlug);
  return (
    <aside className="mt-12 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 dark:bg-emerald-500/[0.03] sm:p-7" aria-labelledby="tool-guide-title">
      <div className="flex items-start gap-3"><Compass className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /><div><h2 id="tool-guide-title" className="font-mono text-lg font-bold text-zinc-900 dark:text-white">{isEn ? 'Not sure where to start?' : 'Não sabe por onde começar?'}</h2><p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Pick the tool that matches the job. Everything runs in your browser.' : 'Escolha a ferramenta que combina com a tarefa. Tudo roda no seu navegador.'}</p></div></div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">{items.map(([title, description, slug, label]) => <button key={slug} type="button" onClick={() => onNavigate(`/tools/${slug}`)} className="group rounded-2xl border border-zinc-200/80 bg-white/70 p-4 text-left transition-colors hover:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-950/40"><span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{title}</span><span className="mt-2 block text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</span><span className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-500">{label}<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" /></span></button>)}</div>
    </aside>
  );
}
