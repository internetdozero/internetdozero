import React, { useState, useCallback, useMemo } from 'react';
import { QuizHeaderBar } from './QuizHeaderBar';
import { QuizResultCard } from './QuizResultCard';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function QuizPlayer({ quiz, onGoCatalog }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  // Embaralha as alternativas de cada pergunta na inicializacao para nao haver ordem viciada
  const preparedQuestions = useMemo(() => {
    // Referencia sessionKey para reembaralhar em cada reinicio do quiz
    if (sessionKey < 0) return [];
    return quiz.questions.map((q) => ({
      ...q,
      options: shuffleArray(q.options)
    }));
  }, [quiz, sessionKey]);

  const totalSteps = preparedQuestions.length;
  const currentQuestion = preparedQuestions[currentStep];

  const handleSelectOption = useCallback((option) => {
    setSelectedAnswers((prev) => {
      const updated = { ...prev, [currentStep]: option };
      return updated;
    });

    // Auto-advance with smooth timing
    if (currentStep < totalSteps - 1) {
      setTimeout(() => {
        setCurrentStep((s) => s + 1);
      }, 200);
    } else {
      setTimeout(() => {
        setIsCompleted(true);
      }, 250);
    }
  }, [currentStep, totalSteps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleRestart = useCallback(() => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
    setSessionKey((k) => k + 1);
  }, []);

  const resultProfile = useMemo(() => {
    if (!isCompleted) return null;

    const tally = {};
    Object.values(selectedAnswers).forEach((opt) => {
      if (opt?.profile) {
        tally[opt.profile] = (tally[opt.profile] || 0) + 2;
      }
      if (Array.isArray(opt?.profiles)) {
        opt.profiles.forEach((p, idx) => {
          const weight = idx === 0 ? 2 : 1;
          tally[p] = (tally[p] || 0) + weight;
        });
      }
    });

    const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) {
      return quiz.profiles[Object.keys(quiz.profiles)[0]];
    }

    const [firstKey, firstVotes] = sorted[0];
    const second = sorted[1];

    // Se houve empate na pontuacao mais alta
    if (second && second[1] === firstVotes) {
      const secondKey = second[0];
      const tieKeyA = `${firstKey}+${secondKey}`;
      const tieKeyB = `${secondKey}+${firstKey}`;

      if (quiz.tieBreakers && (quiz.tieBreakers[tieKeyA] || quiz.tieBreakers[tieKeyB])) {
        return quiz.tieBreakers[tieKeyA] || quiz.tieBreakers[tieKeyB];
      }

      const p1 = quiz.profiles[firstKey];
      const p2 = quiz.profiles[secondKey];
      if (p1 && p2) {
        return {
          name: `${p1.name} & ${p2.name}`,
          subtitle: 'O Híbrido Inesperado (Empate Técnico)',
          description: `Sua personalidade não cabe em uma caixinha só! Você tem exatamente a mesma intensidade de ${p1.name} e ${p2.name}. Dependendo do dia da semana ou do nível de estresse, você transita perfeitamente entre essas duas forças da natureza.`,
          traits: [...new Set([...(p1.traits || []), ...(p2.traits || [])])].slice(0, 4),
          quote: `50% ${p1.name}, 50% ${p2.name}: dual-boot na mente e paz de espírito no coração.`
        };
      }
    }

    return quiz.profiles[firstKey] || quiz.profiles[Object.keys(quiz.profiles)[0]];
  }, [isCompleted, selectedAnswers, quiz]);

  if (isCompleted && resultProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuizHeaderBar
          onBack={onGoCatalog}
          title={quiz.title}
          currentStep={totalSteps - 1}
          totalSteps={totalSteps}
          badge={quiz.badge}
        />
        <QuizResultCard
          quiz={quiz}
          resultProfile={resultProfile}
          onRestart={handleRestart}
          onGoCatalog={onGoCatalog}
        />
      </div>
    );
  }

  const currentSelection = selectedAnswers[currentStep];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <QuizHeaderBar
        onBack={onGoCatalog}
        title={quiz.title}
        currentStep={currentStep}
        totalSteps={totalSteps}
        badge={quiz.badge}
      />

      <div className="space-y-8">
        {/* Question Card */}
        <div>
          <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">
            Pergunta {currentStep + 1} de {totalSteps}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-white leading-snug">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = currentSelection?.text === option.text;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-4 group ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 text-zinc-900 dark:text-white shadow-xs'
                    : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <span className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-500'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 group-hover:border-emerald-500/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm sm:text-base font-sans leading-relaxed pt-0.5">
                    {option.text}
                  </span>
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation bottom */}
        {currentStep > 0 && (
          <div className="pt-4 flex items-center justify-start">
            <button
              onClick={handlePrevious}
              className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Pergunta anterior</span>
            </button>
          </div>
        )}

        {/* Disclaimer */}
        {quiz.disclaimer && (
          <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 pt-6 border-t border-zinc-100 dark:border-zinc-800/60 text-center">
            {quiz.disclaimer}
          </p>
        )}
      </div>
    </div>
  );
}
