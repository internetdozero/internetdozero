import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, Sparkles, CheckCircle2, CornerDownLeft } from 'lucide-react';

export function StatusRadar() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Internet do Zero Hub Console [v1.0.0]' },
    { type: 'system', text: 'Digite "help" ou "modulos" para explorar os comandos disponíveis.' },
  ]);

  const terminalOutputRef = useRef(null);
  const isFirstRender = useRef(true);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { type: 'user', text: `$ ${input}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: 'Comandos disponíveis:\n  • modulos   : Lista os módulos do portal\n  • blog      : Detalhes sobre o blog e leituras\n  • quizzes   : Detalhes sobre os quizzes e passatempos\n  • sobre     : Sobre o Internet do Zero\n  • clear     : Limpa a tela do terminal'
        });
        break;
      case 'modulos':
      case 'modules':
        newHistory.push({
          type: 'output',
          text: 'Módulos iniciais:\n  [1] Blog & Ensaios — Ideias, leituras e variedades da web\n  [2] Desafios & Quizzes — Passatempos interativos e besteirol'
        });
        break;
      case 'blog':
        newHistory.push({
          type: 'output',
          text: 'Blog & Ensaios: Textos livres sobre tecnologia, cultura digital, ideias e curiosidades da rede.'
        });
        break;
      case 'quizzes':
      case 'quiz':
        newHistory.push({
          type: 'output',
          text: 'Desafios & Quizzes: Passatempos descontraídos, perguntas aleatórias e testes leves pra passar o tempo.'
        });
        break;
      case 'sobre':
      case 'about':
        newHistory.push({
          type: 'output',
          text: 'Internet do Zero: Um canto aberto na rede para ideias, variedades, curiosidades e o que der vontade de criar.'
        });
        break;
      case 'clear':
        setHistory([
          { type: 'system', text: 'Console limpo. Digite "help" para ver os comandos.' }
        ]);
        setInput('');
        return;
      default:
        newHistory.push({
          type: 'error',
          text: `Comando não reconhecido: "${input}". Digite "help" para ver as opções disponíveis.`
        });
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
          onClick={() => setHistory([{ type: 'system', text: 'Console reiniciado.' }])}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors text-xs flex items-center gap-1 cursor-pointer"
          title="Limpar terminal"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Limpar</span>
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
          placeholder="Digite um comando (ex: help, modulos, blog, quizzes)..."
          className="flex-1 bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono"
        />
        <button
          type="submit"
          className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors cursor-pointer"
          title="Executar comando"
        >
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </form>
    </section>
  );
}
