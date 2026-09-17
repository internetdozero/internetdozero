import React from 'react';
import { ArrowLeft, ArrowUpRight, Github, Globe2, Youtube } from 'lucide-react';

function TikTokIcon({ className }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.37-3.39-3.46-5.73-.11-1.52.31-3.04 1.14-4.31 1.19-1.84 3.41-3.04 5.6-3.16.01 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.47 2.87 1.03-.02 2.04-.6 2.58-1.48.18-.31.4-.63.41-.99.1-1.76.06-3.51.07-5.27.01-3.96-.01-7.91.02-11.86z" /></svg>;
}

const links = [
  {
    label: 'Internet do Zero',
    description: 'O site principal, com textos, ferramentas e anotações.',
    descriptionEn: 'The main site, with writing, tools, and notes.',
    href: 'https://internetdozero.com.br',
    Icon: Globe2
  },
  {
    label: 'GitHub',
    description: 'Código, experimentos e coisas sendo construídas.',
    descriptionEn: 'Code, experiments, and things being built.',
    href: 'https://github.com/internetdozero',
    Icon: Github
  },
  {
    label: 'YouTube',
    description: 'Vídeos sobre tecnologia, criação e internet.',
    descriptionEn: 'Videos about technology, making, and the internet.',
    href: 'https://www.youtube.com/@internetdozero',
    Icon: Youtube
  },
  {
    label: 'TikTok',
    description: 'Ideias rápidas, bastidores e descobertas.',
    descriptionEn: 'Quick ideas, behind the scenes, and discoveries.',
    href: 'https://www.tiktok.com/@internetdozero',
    Icon: TikTokIcon
  }
];

export function LinksView({ lang = 'pt', onNavigate }) {
  const isEn = lang === 'en';

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-12 sm:px-6 sm:py-20">
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="mb-10 inline-flex w-fit items-center gap-2 rounded-lg px-2 py-1.5 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {isEn ? 'Back to home' : 'Voltar ao início'}
      </button>

      <section className="mb-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-zinc-900 font-mono text-xl font-bold text-emerald-400 shadow-[0_0_28px_rgba(16,185,129,0.14)]">
          0x
        </div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-emerald-500">
          {isEn ? 'Internet do Zero' : 'Internet do Zero'}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          {isEn ? 'Everything in one place.' : 'Tudo em um só lugar.'}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-400 sm:text-base">
          {isEn
            ? 'A personal corner for projects, tools, and whatever is worth sharing.'
            : 'Um canto pessoal para projetos, ferramentas e tudo que vale a pena compartilhar.'}
        </p>
      </section>

      <div className="grid gap-3">
        {links.map(({ label, description, descriptionEn, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-500/60 hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:p-5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-300 transition-colors group-hover:border-emerald-500/50 group-hover:text-emerald-400">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-mono text-sm font-bold text-zinc-100">{label}</span>
              <span className="mt-1 block text-sm leading-5 text-zinc-400">{isEn ? descriptionEn : description}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-emerald-400" />
          </a>
        ))}
      </div>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600">
        {isEn ? '// made independently' : '// feito de forma independente'}
      </p>
    </main>
  );
}
