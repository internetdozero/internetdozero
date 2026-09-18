import React from 'react';
import { Github, Youtube, Mail } from 'lucide-react';
import { translations } from '../i18n/translations';

function TikTokIcon({ className }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.37-3.39-3.46-5.73-.11-1.52.31-3.04 1.14-4.31 1.19-1.84 3.41-3.04 5.6-3.16.01 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.47 2.87 1.03-.02 2.04-.6 2.58-1.48.18-.31.4-.63.41-.99.1-1.76.06-3.51.07-5.27.01-3.96-.01-7.91.02-11.86z" /></svg>;
}

function XIcon({ className }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.964 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>;
}

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/internetdozero', Icon: Github },
  { label: 'YouTube', href: 'https://www.youtube.com/@internetdozero', Icon: Youtube },
  { label: 'TikTok', href: 'https://www.tiktok.com/@internetdozero', Icon: TikTokIcon },
  { label: 'X', href: 'https://x.com/internetdozero', Icon: XIcon }
];

export const Footer = React.memo(function Footer({ onOpenArsenal, onGoHome, lang = 'pt' }) {
  const t = translations[lang] || translations.pt;
  const isEn = lang === 'en';

  return (
    <footer className="mt-20 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-stone-200 dark:border-stone-800">
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] text-stone-400" aria-hidden="true">0x</span>
              <span className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100">
                Internet do Zero
              </span>
            </div>
            <p className="text-sm text-stone-500 max-w-sm">
              {t.footer.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-stone-600 dark:text-stone-400">
            <a
              href="mailto:contato@internetdozero.com.br"
              className="inline-flex items-center gap-2 hover:text-stone-900 hover:underline underline-offset-4 dark:hover:text-stone-100"
              title="Entrar em contato por e-mail"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="select-all">contato@internetdozero.com.br</span>
            </a>

            <button
              type="button"
              onClick={onOpenArsenal}
              className="hover:text-stone-900 hover:underline underline-offset-4 dark:hover:text-stone-100 cursor-pointer"
            >
              {t.footer.terminal}
            </button>

            <a
              href="/#modulos"
              onClick={(event) => { if (window.location.pathname !== '/') { event.preventDefault(); onGoHome?.(); setTimeout(() => document.getElementById('modulos')?.scrollIntoView({ behavior: 'smooth' }), 100); } }}
              className="hover:text-stone-900 hover:underline underline-offset-4 dark:hover:text-stone-100"
            >
              {t.footer.modules}
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            &copy; {new Date().getFullYear()} Internet do Zero.
          </div>
          <nav aria-label={isEn ? 'Social links' : 'Redes sociais'} className="flex items-center gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className="rounded-sm p-1.5 text-stone-500 transition-colors hover:text-stone-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:hover:text-stone-100">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
})
