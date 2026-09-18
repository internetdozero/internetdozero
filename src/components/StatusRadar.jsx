import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2, CornerDownLeft } from 'lucide-react';
import { emitFeedback } from './FeedbackModal';

export function StatusRadar({ lang = 'pt' }) {
  const isEn = lang === 'en';

  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: isEn ? 'Internet do Zero Hub Console [v1.3.0]' : 'Internet do Zero Hub Console [v1.3.0]' },
    { type: 'system', text: isEn ? 'Type "help" or "modules" to explore available commands.' : 'Digite "help" ou "modulos" para explorar os comandos disponíveis.' },
  ]);

  const terminalOutputRef = useRef(null);
  const isFirstRender = useRef(true);

  // Update initial message when language changes
  useEffect(() => {
    setHistory([
    { type: 'system', text: 'Internet do Zero Hub Console [v1.3.0]' },
      { type: 'system', text: isEn ? 'Type "help" or "modules" to explore available commands.' : 'Digite "help" ou "modulos" para explorar os comandos disponíveis.' },
    ]);
  }, [isEn]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { type: 'user', text: `$ ${input}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: isEn
            ? 'Available commands:\n  • modules   : See the spaces on this site\n  • blog      : Open the texts\n  • quizzes   : See what is coming\n  • about     : Why this site exists\n  • clear     : Clear the console'
            : 'Comandos disponíveis:\n  • modulos   : Veja os espaços deste site\n  • blog      : Abra os textos\n  • quizzes   : Veja o que vem aí\n  • sobre     : Por que este site existe\n  • clear     : Limpe o console'
        });
        break;
      case 'modulos':
      case 'modules':
        newHistory.push({
          type: 'output',
          text: isEn
            ? 'Available spaces:\n  [1] Texts — Essays, guides, and notes\n  [2] Quizzes — Small challenges, coming soon'
            : 'O que tem por aqui:\n  [1] Textos — coisas que eu escrevi\n  [2] Quizzes — ainda não comecei'
        });
        break;
      case 'blog':
        newHistory.push({
          type: 'output',
          text: isEn
            ? 'Texts: Essays, guides, and notes published in my own corner of the web.'
            : 'Textos: guias, ensaios e anotações que eu quis guardar aqui.'
        });
        break;
      case 'quizzes':
      case 'quiz':
        newHistory.push({
          type: 'output',
          text: isEn
            ? 'Quizzes: Small challenges for when thinking seriously can wait.'
            : 'Quizzes: Desafios leves para quando pensar sério pode esperar.'
        });
        break;
      case 'sobre':
      case 'about':
        newHistory.push({
          type: 'output',
          text: isEn
            ? 'Internet do Zero: A personal site for publishing, building, and keeping the web interesting.'
            : 'Internet do Zero: um site pessoal para escrever e fazer coisas.'
        });
        break;
      case 'clear':
        setHistory([
          { type: 'system', text: isEn ? 'Console cleared. Type "help" for commands.' : 'Console limpo. Digite "help" para ver os comandos.' }
        ]);
        setInput('');
        return;
      default:
        emitFeedback('error', isEn ? `Unrecognized command: "${input}". Type "help" to view available options.` : `Comando não reconhecido: "${input}". Digite "help" para ver as opções disponíveis.`);
    }

    setHistory(newHistory);
    setInput('');
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <section className="my-12 p-6 sm:p-8 rounded-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 overflow-hidden">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Terminal className="w-3.5 h-3.5 icon-accent" />
          <span>{isEn ? 'Ask the index' : 'Pergunte ao índice'}</span>
        </div>

        <button
          onClick={() => setHistory([{ type: 'system', text: isEn ? 'Cleared.' : 'Limpo.' }])}
          className="p-1.5 rounded-sm text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors text-xs flex items-center gap-1 cursor-pointer"
          title={isEn ? "Clear" : "Limpar"}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isEn ? 'Clear' : 'Limpar'}</span>
        </button>
      </div>

      {/* Terminal History Output */}
      <div ref={terminalOutputRef} className="min-h-[140px] max-h-[220px] overflow-y-auto space-y-2 text-xs leading-relaxed pr-2">
        {history.map((line, idx) => (
          <div key={idx}>
            {line.type === 'system' && (
              <p className="text-stone-500">{line.text}</p>
            )}
            {line.type === 'user' && (
              <p className="text-stone-900 dark:text-stone-100 font-medium">{line.text}</p>
            )}
            {line.type === 'output' && (
              <pre className="text-stone-700 dark:text-stone-300 whitespace-pre-wrap font-mono pl-2 border-l border-stone-300 dark:border-stone-700 my-1">
                {line.text}
              </pre>
            )}
            {line.type === 'error' && (
              <p className="text-red-400 font-medium">{line.text}</p>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Input Form */}
      <form onSubmit={handleCommand} className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
        <span className="text-stone-400 text-sm">›</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isEn ? 'Try: help, modules, blog…' : 'Tente: help, modulos, blog…'}
          className="flex-1 bg-transparent text-xs sm:text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
        />
        <button
          type="submit"
          className="p-2 rounded-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
          title={isEn ? "Execute command" : "Executar comando"}
        >
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </form>
    </section>
  );
}
