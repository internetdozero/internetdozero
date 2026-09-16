import React from 'react';
import { Terminal, Sparkles, ArrowRight, BrainCircuit, BookOpen, Layers } from 'lucide-react';

export function Hero({ onOpenArsenal, onScrollToGrid }) {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-6">
          
          {/* Subtle Hub Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-300 dark:border-emerald-500/30 text-zinc-800 dark:text-zinc-200 text-xs font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-zinc-500 dark:text-zinc-400">Hub Central</span>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">internetdozero</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-mono">
            INTERNET DO <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 dark:from-emerald-400 dark:via-emerald-300 dark:to-emerald-500 underline decoration-emerald-500/40 decoration-wavy underline-offset-8">ZERO</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            Um canto aberto na rede para textos, curiosidades, variedades e o que mais der vontade de criar. Sem caixinhas e sem rótulos.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onScrollToGrid}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 font-mono font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Ver Módulos</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenArsenal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900/90 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-sm transition-all hover:border-emerald-500/50 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Console do Hub</span>
            </button>
          </div>

          {/* Summary Indicator Bar */}
          <div className="w-full max-w-3xl mt-8 p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-left font-mono">
            <div className="border-r border-zinc-200 dark:border-zinc-800/60 pr-2">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider block">Foco Inicial</span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 mt-0.5">
                <Layers className="w-3.5 h-3.5 text-emerald-500" /> 2 Módulos
              </span>
            </div>
            <div className="border-r border-zinc-200 dark:border-zinc-800/60 pr-2">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider block">Conteúdo</span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <BookOpen className="w-3.5 h-3.5 inline" /> Blog & Ensaios
              </span>
            </div>
            <div className="border-r border-zinc-200 dark:border-zinc-800/60 pr-2">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider block">Passatempo</span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 mt-0.5">
                <BrainCircuit className="w-3.5 h-3.5 text-emerald-500" /> Quizzes
              </span>
            </div>
            <div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider block">Status</span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Operacional
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
