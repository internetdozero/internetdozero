import React, { useMemo, useState } from 'react';
import { Braces, Check, Copy, ShieldCheck, Trash2 } from 'lucide-react';

const sample = '{"site":"Internet do Zero","tools":["QR Code","Diff Checker"],"online":true}';

export function JsonFormatter({ lang = 'pt' }) {
  const isEn = lang === 'en';
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('pretty');
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      const value = JSON.parse(input);
      return { output: JSON.stringify(value, null, mode === 'pretty' ? 2 : 0), error: '' };
    } catch (error) {
      return { output: '', error: error instanceof Error ? error.message : (isEn ? 'Invalid JSON.' : 'JSON inválido.') };
    }
  }, [input, mode, isEn]);
  const copy = async () => {
    if (!result.output) return;
    await navigator.clipboard?.writeText(result.output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  const useSample = () => setInput(sample);

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60" aria-labelledby="json-formatter-title">
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-500">{isEn ? 'local JSON tool' : 'ferramenta JSON local'}</p><h2 id="json-formatter-title" className="mt-2 font-mono text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{isEn ? 'JSON formatter' : 'Formatador de JSON'}</h2><p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Format, minify and validate JSON without sending it anywhere.' : 'Formate, compacte e valide JSON sem enviar nada para lugar nenhum.'}</p></div><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-500" aria-label={isEn ? 'Local processing' : 'Processamento local'} /></div></div>
      <div className="space-y-5 p-5 sm:p-7">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/50"><div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800"><label htmlFor="json-input" className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">{isEn ? 'Your JSON' : 'Seu JSON'}</label><button type="button" onClick={useSample} className="text-xs font-semibold text-zinc-500 hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">{isEn ? 'Use example' : 'Usar exemplo'}</button></div><textarea id="json-input" value={input} onChange={(event) => { setInput(event.target.value); setCopied(false); }} spellCheck="false" placeholder={isEn ? 'Paste JSON here…' : 'Cole o JSON aqui…'} className="min-h-[20rem] w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-zinc-800 outline-none placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500/40 dark:text-zinc-200 dark:placeholder:text-zinc-600" /></div>
          <div className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/50"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">{isEn ? 'Result' : 'Resultado'}</p><div className="flex gap-1 rounded-lg border border-zinc-200 p-1 dark:border-zinc-800"><button type="button" onClick={() => setMode('pretty')} aria-pressed={mode === 'pretty'} className={`rounded-md px-2 py-1 text-[11px] font-semibold ${mode === 'pretty' ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-500 hover:text-emerald-500'}`}>{isEn ? 'Format' : 'Formatar'}</button><button type="button" onClick={() => setMode('compact')} aria-pressed={mode === 'compact'} className={`rounded-md px-2 py-1 text-[11px] font-semibold ${mode === 'compact' ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-500 hover:text-emerald-500'}`}>{isEn ? 'Minify' : 'Compactar'}</button></div></div><pre className="min-h-[20rem] overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-sm leading-6 text-zinc-800 dark:text-zinc-200">{result.output || <span className="text-zinc-400">{isEn ? 'The result appears here.' : 'O resultado aparece aqui.'}</span>}</pre></div>
        </div>
        {result.error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-semibold text-red-500">{isEn ? 'Invalid JSON: ' : 'JSON inválido: '}{result.error}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3"><p className="flex items-center gap-2 text-xs text-zinc-500"><Braces className="h-4 w-4 text-emerald-500" />{isEn ? 'Everything stays in this browser.' : 'Tudo fica neste navegador.'}</p><div className="flex gap-2"><button type="button" onClick={() => { setInput(''); setCopied(false); }} disabled={!input} className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 px-3 py-2.5 text-xs font-bold text-zinc-600 hover:border-red-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300"><Trash2 className="h-3.5 w-3.5" />{isEn ? 'Clear' : 'Limpar'}</button><button type="button" onClick={copy} disabled={!result.output} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-bold text-zinc-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40">{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? (isEn ? 'Copied' : 'Copiado') : (isEn ? 'Copy result' : 'Copiar resultado')}</button></div></div>
      </div>
    </section>
  );
}
