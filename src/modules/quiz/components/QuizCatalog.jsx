import React from 'react';
import { Crown, Terminal, Apple, Landmark, ArrowRight, BrainCircuit, Sparkles, Clock, HelpCircle } from 'lucide-react';
import { quizzesList } from '../data/quizzesMeta';

const iconMap = {
  Crown,
  Terminal,
  Apple,
  Landmark
};

export function QuizCatalog({ onNavigate }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Área Interativa & Testes</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono text-zinc-900 dark:text-white tracking-tight mb-4">
          Quizzes & Testes de Personalidade
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
          Responda a perguntas rápidas, descubra arquétipos inusitados e compartilhe o resultado com os amigos.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzesList.map((quiz) => {
          const IconComponent = iconMap[quiz.icon] || Sparkles;
          return (
            <div
              key={quiz.id}
              className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center transition-transform group-hover:scale-105">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {quiz.badge}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {quiz.title}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed mb-4">
                  {quiz.subtitle}
                </p>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/60 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                    {quiz.questions.length} questões
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    ~2 min
                  </span>
                </div>

                <button
                  onClick={() => onNavigate(`/quiz/${quiz.id}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-zinc-900 text-white dark:bg-emerald-500 dark:text-zinc-950 hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-all cursor-pointer shadow-xs group-hover:translate-x-0.5"
                >
                  <span>Iniciar Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
