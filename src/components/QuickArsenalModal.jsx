import React, { useState } from 'react';
import { X, Terminal, Copy, Check, Key, Volume2, Clock, Radio, Sparkles } from 'lucide-react';

const arsenalTools = [
  {
    name: 'api-vault',
    cmd: 'vault set <service> <key> | vault run <service> <command>',
    description: 'Cofre encriptado local para gerenciamento e injeção segura de credenciais em memória.',
    icon: Key,
    category: 'Segurança'
  },
  {
    name: 'key-rotator',
    cmd: 'key-rotator status | key-rotator rotate',
    description: 'Gerenciador de pool de chaves com monitoramento de cotas e rotação automática.',
    icon: Sparkles,
    category: 'Infraestrutura'
  },
  {
    name: 'voice-engine',
    cmd: 'voice-engine speak "Texto" | voice-engine toggle',
    description: 'Sintetizador de voz neural e hooks de áudio acoplados aos alertas do sistema.',
    icon: Volume2,
    category: 'Áudio & TTS'
  },
  {
    name: 'lyra-cli',
    cmd: 'lyra analyze --file letra.txt | lyra studio',
    description: 'CLI para escaneamento métrico de versos, análise de rimas e cadência lírica.',
    icon: Radio,
    category: 'Música'
  },
  {
    name: 'sys-reminder',
    cmd: 'sys-reminder status | sys-reminder set 18:00',
    description: 'Agendador de rotinas e alertas sonoros em background via systemd.',
    icon: Clock,
    category: 'Automação'
  }
];

export function QuickArsenalModal({ isOpen, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-mono text-zinc-900 dark:text-white">
                Arsenal de Ferramentas CLI
              </h3>
              <p className="text-xs text-zinc-500 font-mono">
                Utilitários de terminal e automações do ecossistema
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tools List */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {arsenalTools.map((tool, idx) => {
            const Icon = tool.icon;
            const isCopied = copiedIndex === idx;

            return (
              <div 
                key={tool.name}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500/40 transition-all font-mono"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{tool.name}</span>
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {tool.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans mb-3">
                  {tool.description}
                </p>

                {/* Command Bar */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
                  <code className="text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                    $ {tool.cmd}
                  </code>
                  <button
                    onClick={() => handleCopy(tool.cmd, idx)}
                    className="ml-2 flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                    title="Copiar comando"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>Ambiente CLI & Automação</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white text-xs font-semibold hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-black transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
