import React from 'react';
import { useSeo } from '../../hooks/useSeo';
import { quizzesBySlug } from './data/quizzesMeta';
import { QuizCatalog } from './components/QuizCatalog';
import { QuizPlayer } from './components/QuizPlayer';

export function QuizView({ onNavigate, quizSlug, lang = 'pt' }) {
  const resolvedSlug = typeof quizSlug === 'string' ? quizSlug.trim() : null;
  const activeQuiz = resolvedSlug ? quizzesBySlug[resolvedSlug] : null;

  const isEn = lang === 'en';

  const pageTitle = activeQuiz
    ? `${activeQuiz.title} — Internet do Zero`
    : (isEn ? 'Interactive Quizzes & Tests — Internet do Zero' : 'Quizzes & Testes Interativos — Internet do Zero');

  const pageDesc = activeQuiz
    ? activeQuiz.subtitle
    : (isEn ? 'Fun personality quizzes and tests built for sharing.' : 'Quizzes rápidos e divertidos de personalidade e tecnologia para responder e compartilhar.');

  const pageUrl = typeof window !== 'undefined'
    ? (resolvedSlug ? `${window.location.origin}/quiz/${resolvedSlug}` : `${window.location.origin}/quiz`)
    : (resolvedSlug ? `https://internetdozero.com.br/quiz/${resolvedSlug}` : 'https://internetdozero.com.br/quiz');

  useSeo({
    title: pageTitle,
    description: pageDesc,
    url: pageUrl,
    image: 'https://internetdozero.com.br/og-image.png'
  });

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [quizSlug]);

  if (resolvedSlug && !activeQuiz) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-mono font-bold text-zinc-900 dark:text-white mb-4">
          Quiz não encontrado
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          O quiz solicitado não existe ou o endereço foi alterado.
        </p>
        <button
          onClick={() => onNavigate('/quiz')}
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-colors"
        >
          Ver todos os quizzes
        </button>
      </div>
    );
  }

  if (activeQuiz) {
    return (
      <main className="min-h-[70vh]">
        <QuizPlayer
          quiz={activeQuiz}
          onGoCatalog={() => onNavigate('/quiz')}
        />
      </main>
    );
  }

  return (
    <main className="min-h-[70vh]">
      <QuizCatalog onNavigate={onNavigate} />
    </main>
  );
}
