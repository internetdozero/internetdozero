import React, { useRef, useState } from 'react';
import { Hero } from './Hero';
import { ModuleCard } from './ModuleCard';
import { StatusRadar } from './StatusRadar';
import { DynamicIcon } from './DynamicIcon';
import { modulesData, systemPillars } from '../data/modules';
import { LayoutGrid } from 'lucide-react';
import { translations } from '../i18n/translations';

export function HubView({ onSelectModule, lang = 'pt' }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const gridRef = useRef(null);
  const terminalRef = useRef(null);
  const t = translations[lang] || translations.pt;

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
        if (activeCategory === 'content') return m.id === 'blog';
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

      {/* System Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systemPillars.map((pillar) => {
            const title = (lang === 'en' && pillar.title_en) ? pillar.title_en : (pillar.title_pt || pillar.title);
            const desc = (lang === 'en' && pillar.desc_en) ? pillar.desc_en : (pillar.desc_pt || pillar.desc);

            return (
              <div
                key={pillar.title_pt || pillar.title}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <DynamicIcon name={pillar.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-mono font-bold text-base text-zinc-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
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
            <div className="flex items-center gap-2 mb-1">
              <LayoutGrid className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                {t.hub.modulesEyebrow}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-white">
              {t.hub.modulesTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black font-bold shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500/40 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
