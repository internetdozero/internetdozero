import React, { useMemo, useRef, useState } from 'react';
import { FileDiff, FolderOpen, ShieldCheck, Trash2 } from 'lucide-react';

const MAX_LINES = 600;

function linesOf(text) {
  return text ? text.replace(/\r\n/g, '\n').split('\n') : [];
}

function compareLines(left, right) {
  const rows = [];
  const table = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0));
  for (let leftIndex = left.length - 1; leftIndex >= 0; leftIndex -= 1) {
    for (let rightIndex = right.length - 1; rightIndex >= 0; rightIndex -= 1) {
      table[leftIndex][rightIndex] = left[leftIndex] === right[rightIndex]
        ? table[leftIndex + 1][rightIndex + 1] + 1
        : Math.max(table[leftIndex + 1][rightIndex], table[leftIndex][rightIndex + 1]);
    }
  }

  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < left.length || rightIndex < right.length) {
    if (left[leftIndex] === right[rightIndex]) {
      rows.push({ type: 'same', left: left[leftIndex], right: right[rightIndex] });
      leftIndex += 1;
      rightIndex += 1;
    } else if (rightIndex >= right.length || (leftIndex < left.length && table[leftIndex + 1][rightIndex] >= table[leftIndex][rightIndex + 1])) {
      rows.push({ type: 'removed', left: left[leftIndex], right: null });
      leftIndex += 1;
    } else {
      rows.push({ type: 'added', left: null, right: right[rightIndex] });
      rightIndex += 1;
    }
  }
  return rows;
}

function readFile(file, setter, isEn) {
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    setter({ error: isEn ? 'Use files up to 2 MB.' : 'Use arquivos de até 2 MB.' });
    return;
  }
  const reader = new FileReader();
  reader.onload = () => setter({ text: String(reader.result || ''), error: '' });
  reader.onerror = () => setter({ error: isEn ? 'Could not read this file.' : 'Não foi possível ler este arquivo.' });
  reader.readAsText(file);
}

function DiffPane({ side, value, onChange, onFile, isEn }) {
  const inputRef = useRef(null);
  const left = side === 'left';
  return (
    <div className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <label htmlFor={`diff-${side}`} className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
          {left ? (isEn ? 'Original' : 'Original') : (isEn ? 'Changed version' : 'Versão alterada')}
        </label>
        <>
          <input ref={inputRef} type="file" accept=".txt,.md,.js,.jsx,.ts,.tsx,.json,.css,.html,.csv,text/*" className="sr-only" onChange={(event) => onFile(event.target.files?.[0])} />
          <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
            <FolderOpen className="h-3.5 w-3.5" />{isEn ? 'Open file' : 'Abrir arquivo'}
          </button>
        </>
      </div>
      <textarea id={`diff-${side}`} value={value} onChange={(event) => onChange(event.target.value)} spellCheck="false" placeholder={left ? (isEn ? 'Paste the original text here…' : 'Cole o texto original aqui…') : (isEn ? 'Paste the changed version here…' : 'Cole a versão alterada aqui…')} className="min-h-[20rem] w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-zinc-800 outline-none placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500/40 dark:text-zinc-200 dark:placeholder:text-zinc-600" />
    </div>
  );
}

export function DiffChecker({ lang = 'pt' }) {
  const isEn = lang === 'en';
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [fileError, setFileError] = useState('');
  const leftLines = useMemo(() => linesOf(left), [left]);
  const rightLines = useMemo(() => linesOf(right), [right]);
  const tooLarge = leftLines.length > MAX_LINES || rightLines.length > MAX_LINES;
  const rows = useMemo(() => (tooLarge ? [] : compareLines(leftLines, rightLines)), [leftLines, rightLines, tooLarge]);
  const stats = rows.reduce((result, row) => {
    if (row.type === 'added') result.added += 1;
    if (row.type === 'removed') result.removed += 1;
    return result;
  }, { added: 0, removed: 0 });
  const changed = Math.min(stats.added, stats.removed);
  const load = (setter) => (file) => readFile(file, ({ text = '', error = '' }) => { setter(text); setFileError(error); }, isEn);

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60" aria-labelledby="diff-checker-title">
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-7">
        <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-500">{isEn ? 'local comparison' : 'comparação local'}</p><h2 id="diff-checker-title" className="mt-2 font-mono text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{isEn ? 'Text diff checker' : 'Comparador de texto'}</h2><p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'See what changed between two texts or code files.' : 'Veja o que mudou entre dois textos ou arquivos de código.'}</p></div><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-500" aria-label={isEn ? 'Local processing' : 'Processamento local'} /></div>
      </div>
      <div className="space-y-5 p-5 sm:p-7">
        <div className="grid gap-4 lg:grid-cols-2"><DiffPane side="left" value={left} onChange={(value) => { setLeft(value); setFileError(''); }} onFile={load(setLeft)} isEn={isEn} /><DiffPane side="right" value={right} onChange={(value) => { setRight(value); setFileError(''); }} onFile={load(setRight)} isEn={isEn} /></div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs"><span className="text-emerald-600 dark:text-emerald-400">+ {stats.added} {isEn ? 'added' : 'adicionadas'}</span><span className="text-red-500">− {stats.removed} {isEn ? 'removed' : 'removidas'}</span><span className="text-zinc-500">{changed} {isEn ? 'changed' : 'alteradas'}</span></div>
          <button type="button" onClick={() => { setLeft(''); setRight(''); setFileError(''); }} disabled={!left && !right} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"><Trash2 className="h-3.5 w-3.5" />{isEn ? 'Clear' : 'Limpar'}</button>
        </div>
        {(fileError || tooLarge) && <p role="alert" className="text-xs font-semibold text-red-500">{fileError || (isEn ? `Keep each text under ${MAX_LINES} lines.` : `Mantenha cada texto com até ${MAX_LINES} linhas.`)}</p>}
        {(left || right) && !tooLarge && <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800"><div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800"><FileDiff className="h-4 w-4 text-emerald-500" /><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{isEn ? 'Line-by-line result' : 'Resultado linha a linha'}</p></div><div className="max-h-[28rem] overflow-auto font-mono text-xs">{rows.map((row, index) => <div key={`${row.type}-${index}`} className={`grid grid-cols-2 border-b border-zinc-200/70 last:border-0 dark:border-zinc-800/70 ${row.type === 'added' ? 'bg-emerald-500/10' : row.type === 'removed' ? 'bg-red-500/10' : ''}`}><div className={`min-w-0 whitespace-pre-wrap break-words border-r border-zinc-200/70 px-3 py-2 dark:border-zinc-800/70 ${row.type === 'removed' ? 'text-red-600 dark:text-red-400' : 'text-zinc-600 dark:text-zinc-400'}`}>{row.left === null ? <span className="text-zinc-400">—</span> : row.left}</div><div className={`min-w-0 whitespace-pre-wrap break-words px-3 py-2 ${row.type === 'added' ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'}`}>{row.right === null ? <span className="text-zinc-400">—</span> : row.right}</div></div>)}</div></div>}
        <p className="text-xs text-zinc-500">{isEn ? 'Everything stays in this browser.' : 'Tudo fica neste navegador.'}</p>
      </div>
    </section>
  );
}
