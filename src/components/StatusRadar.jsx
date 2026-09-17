import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2, CornerDownLeft } from 'lucide-react';
import { emitFeedback } from './FeedbackModal';

export function StatusRadar({ lang = 'pt' }) {
  const isEn = lang === 'en';

  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: isEn ? 'Internet do Zero Hub Console [v1.0.0]' : 'Internet do Zero Hub Console [v1.0.0]' },
    { type: 'system', text: isEn ? 'Type "help" or "modules" to explore available commands.' : 'Digite "help" ou "modulos" para explorar os comandos disponíveis.' },
  ]);

  const terminalOutputRef = useRef(null);
  const isFirstRender = useRef(true);

  // Update initial message when language changes
  useEffect(() => {
    setHistory([
      { type: 'system', text: 'Internet do Zero Hub Console [v1.0.0]' },
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
            : 'Espaços disponíveis:\n  [1] Textos — Ensaios, guias e anotações\n  [2] Quizzes — Desafios leves, em breve'
        });
        break;
      case 'blog':
        newHistory.push({
          type: 'output',
          text: isEn
            ? 'Texts: Essays, guides, and notes published in my own corner of the web.'
            : 'Textos: Ensaios, guias e anotações publicados no meu próprio canto da web.'
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
            : 'Internet do Zero: Um site pessoal para publicar, construir e deixar a web interessante.'
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
    <section className="my-12 p-6 sm:p-8 rounded-3xl bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-300 dark:border-zinc-800 text-zinc-100 font-mono shadow-xl overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>console@internetdozero:~</span>
          </div>
        </div>

        <button
          onClick={() => setHistory([{ type: 'system', text: isEn ? 'Console reset.' : 'Console reiniciado.' }])}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors text-xs flex items-center gap-1 cursor-pointer"
          title={isEn ? "Clear terminal" : "Limpar terminal"}
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
              <p className="text-zinc-400">{line.text}</p>
            )}
            {line.type === 'user' && (
              <p className="text-emerald-400 font-bold">{line.text}</p>
            )}
            {line.type === 'output' && (
              <pre className="text-zinc-200 whitespace-pre-wrap font-mono pl-2 border-l border-emerald-500/40 my-1">
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
      <form onSubmit={handleCommand} className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2">
        <span className="text-emerald-400 font-bold text-sm">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isEn ? 'Try: help, modules, blog…' : 'Tente: help, modulos, blog…'}
          className="flex-1 bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono"
        />
        <button
          type="submit"
          className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors cursor-pointer"
          title={isEn ? "Execute command" : "Executar comando"}
        >
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </form>
    </section>
  );
}
