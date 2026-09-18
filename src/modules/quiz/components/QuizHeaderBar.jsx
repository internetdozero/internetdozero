import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

export function QuizHeaderBar({ onBack, title, currentStep, totalSteps, badge }) {
  const progressPercent = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
          {title && (
            <span className="hidden sm:inline-block text-xs font-mono text-zinc-400 dark:text-zinc-500">
              / {title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              {badge}
            </span>
          )}
          {totalSteps > 0 && (
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              Questão <strong className="text-zinc-900 dark:text-zinc-100">{currentStep + 1}</strong> de {totalSteps}
            </span>
          )}
        </div>
      </div>

      {totalSteps > 0 && (
        <div className="mt-3 w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
