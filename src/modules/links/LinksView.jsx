import React from 'react';
import { ArrowLeft, ArrowUpRight, Github, Globe2, Youtube } from 'lucide-react';
import { useSeo } from '../../hooks/useSeo';

function TikTokIcon({ className }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.37-3.39-3.46-5.73-.11-1.52.31-3.04 1.14-4.31 1.19-1.84 3.41-3.04 5.6-3.16.01 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.47 2.87 1.03-.02 2.04-.6 2.58-1.48.18-.31.4-.63.41-.99.1-1.76.06-3.51.07-5.27.01-3.96-.01-7.91.02-11.86z" /></svg>;
}

function XIcon({ className }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.964 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>;
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
  },
  {
    label: 'X',
    description: 'Pensamentos curtos e conversas em tempo real.',
    descriptionEn: 'Short thoughts and real-time conversations.',
    href: 'https://x.com/internetdozero',
    Icon: XIcon
  }
];

export function LinksView({ lang = 'pt', onNavigate }) {
  const isEn = lang === 'en';

  useSeo({
    title: isEn ? 'Links & Channels — Internet do Zero' : 'Links & Canais — Internet do Zero',
    description: isEn ? 'Official links, source code repositories, videos, and profiles for Internet do Zero.' : 'Canais oficiais, repositórios de código, vídeos e redes da Internet do Zero.',
    url: typeof window !== 'undefined' ? `${window.location.origin}/links` : 'https://internetdozero.com.br/links',
    image: 'https://internetdozero.com.br/og-image.png'
  });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-12 sm:px-6 sm:py-20">
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="mb-10 inline-flex w-fit items-center gap-2 px-2 py-1.5 text-xs text-stone-500 transition-colors hover:text-stone-900 hover:underline underline-offset-4 focus-visible:outline-none dark:hover:text-stone-100"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {isEn ? 'Back to home' : 'Voltar ao início'}
      </button>

      <section className="mb-10 text-center">
        <p className="mb-3 text-[11px] text-stone-400">0x</p>
        <p className="mb-3 text-sm text-stone-500">
          {isEn ? 'Internet do Zero' : 'Internet do Zero'}
        </p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">
          {isEn ? 'Everything in one place.' : 'Tudo em um só lugar.'}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-stone-500 sm:text-base">
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
            className="group flex items-center gap-4 rounded-sm border border-stone-200 bg-white p-4 transition-colors hover:border-stone-400 focus-visible:outline-none dark:border-stone-800 dark:bg-stone-900 sm:p-5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-stone-200 icon-accent dark:border-stone-700">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-stone-900 dark:text-stone-100">{label}</span>
              <span className="mt-1 block text-sm leading-5 text-stone-500">{isEn ? descriptionEn : description}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200" />
          </a>
        ))}
      </div>

      <p className="mt-10 text-center text-[11px] text-stone-400">
        {isEn ? 'Made independently' : 'Feito de forma independente'}
      </p>
    </main>
  );
}
