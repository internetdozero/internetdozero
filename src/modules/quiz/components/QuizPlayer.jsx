import React, { useState, useCallback, useMemo } from 'react';
import { QuizHeaderBar } from './QuizHeaderBar';
import { QuizResultCard } from './QuizResultCard';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export function QuizPlayer({ quiz, onGoCatalog }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const totalSteps = quiz.questions.length;
  const currentQuestion = quiz.questions[currentStep];

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
  }, []);

  const resultProfile = useMemo(() => {
    if (!isCompleted) return null;

    const tally = {};
    Object.values(selectedAnswers).forEach((opt) => {
      if (opt?.profile) {
        tally[opt.profile] = (tally[opt.profile] || 0) + 1;
      }
    });

    let bestProfileKey = Object.keys(quiz.profiles)[0];
    let maxVotes = -1;

    for (const [pKey, count] of Object.entries(tally)) {
      if (count > maxVotes) {
        maxVotes = count;
        bestProfileKey = pKey;
      }
    }

    return quiz.profiles[bestProfileKey] || quiz.profiles[Object.keys(quiz.profiles)[0]];
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
