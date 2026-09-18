import React, { useRef, useState } from 'react';
import { Hero } from './Hero';
import { ModuleCard } from './ModuleCard';
import { StatusRadar } from './StatusRadar';
import { DynamicIcon } from './DynamicIcon';
import { modulesData, systemPillars } from '../data/modules';
import { translations } from '../i18n/translations';
import { useSeo } from '../hooks/useSeo';

export function HubView({ onSelectModule, lang = 'pt' }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const gridRef = useRef(null);
  const terminalRef = useRef(null);
  const t = translations[lang] || translations.pt;
  const isEn = lang === 'en';

  useSeo({
    title: isEn ? 'Internet do Zero — Local Web Tools & Independent Tech' : 'Internet do Zero — Ferramentas Locais & Blog Independente',
    description: isEn ? 'Fast in-browser utilities without server uploads, plus articles and notes on independent technology.' : 'Utilitários web rápidos que rodam 100% no seu navegador sem enviar arquivos para servidores, além de artigos e reflexões sobre tecnologia.',
    url: 'https://internetdozero.com.br/',
    image: 'https://internetdozero.com.br/og-image.png'
  });

  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToTerminal = () => terminalRef.current?.scrollIntoView({ behavior: 'smooth' });

  const categories = [
    { id: 'all', label: t.hub.allModules },
    { id: 'content', label: t.hub.contentModules },
    { id: 'interactive', label: t.hub.interactiveModules },
  ];

  const filteredModules = activeCategory === 'all'
    ? modulesData
    : modulesData.filter((m) => {
        if (activeCategory === 'content') return m.id === 'blog' || m.id === 'tools';
        if (activeCategory === 'interactive') return m.id === 'quizzes';
        return true;
      });

  return (
    <>
      <Hero
        onOpenArsenal={scrollToTerminal}
        onScrollToGrid={scrollToGrid}
        lang={lang}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="mb-5 text-sm text-stone-500">{t.hub.systemPillarsTitle}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {systemPillars.map((pillar) => {
            const title = (lang === 'en' && pillar.title_en) ? pillar.title_en : (pillar.title_pt || pillar.title);
            const desc = (lang === 'en' && pillar.desc_en) ? pillar.desc_en : (pillar.desc_pt || pillar.desc);

            return (
              <div
                key={pillar.title_pt || pillar.title}
                className="rounded-3xl border border-stone-200/80 bg-white/80 p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900/70"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--icon)_16%,transparent)]">
                  <DynamicIcon name={pillar.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-50 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modules Grid Section */}
      <section ref={gridRef} id="modulos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900 dark:text-stone-50">
              {t.hub.modulesTitle}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-stone-500">{t.hub.modulesDesc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[var(--icon)] text-[#2a1f0e] font-semibold'
                    : 'border border-stone-200 bg-white/70 dark:border-stone-800 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:border-[var(--icon)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onSelect={onSelectModule}
              lang={lang}
            />
          ))}
        </div>
      </section>

      {/* Interactive Console */}
      <div ref={terminalRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatusRadar lang={lang} />
      </div>
    </>
  );
}
