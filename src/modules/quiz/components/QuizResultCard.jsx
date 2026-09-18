import React, { useState } from 'react';
import { Share2, Check, RotateCcw, ArrowRight, Quote, Sparkles } from 'lucide-react';

export function QuizResultCard({ quiz, resultProfile, onRestart, onGoCatalog }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `Meu resultado no quiz "${quiz.title}": ${resultProfile.name} (${resultProfile.subtitle})!\n\n"${resultProfile.quote}"\n\nDescubra o seu em: https://internetdozero.com.br/quiz/${quiz.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Result Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900/70 border border-emerald-500/30 dark:border-emerald-500/30 shadow-xl backdrop-blur-md relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-6">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
              Seu Diagnóstico Oficial
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {quiz.badge}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-900 dark:text-white mb-2 tracking-tight">
            {resultProfile.name}
          </h2>

          <p className="text-base font-mono font-medium text-emerald-600 dark:text-emerald-400 mb-6">
            {resultProfile.subtitle}
          </p>

          <p className="text-base text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed mb-6">
            {resultProfile.description}
          </p>

          {resultProfile.quote && (
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 mb-6 flex items-start gap-3">
              <Quote className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm font-mono italic text-zinc-600 dark:text-zinc-300">
                "{resultProfile.quote}"
              </p>
            </div>
          )}

          {/* Traits */}
          <div className="mb-8">
            <span className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-2.5">
              Traços de Personalidade:
            </span>
            <div className="flex flex-wrap gap-2">
              {resultProfile.traits.map((trait) => (
                <span
                  key={trait}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                >
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-all cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-zinc-950" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copiado para o clipboard!' : 'Copiar Resultado'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onRestart}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                title="Refazer este quiz"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refazer</span>
              </button>

              <button
                onClick={onGoCatalog}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
              >
                <span>Outros Quizzes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
