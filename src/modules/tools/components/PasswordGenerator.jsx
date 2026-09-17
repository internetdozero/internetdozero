import React, { useState } from 'react';
import { Check, Clipboard, KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';

const characterSets = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?'
};

function randomIndex(max) {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] % max;
}

function generatePassword(length, options) {
  const enabled = Object.keys(characterSets).filter((key) => options[key]);
  if (!enabled.length) return '';
  const pool = enabled.map((key) => characterSets[key]).join('');
  const required = enabled.map((key) => characterSets[key][randomIndex(characterSets[key].length)]);
  const password = [...required];
  while (password.length < length) password.push(pool[randomIndex(pool.length)]);
  for (let index = password.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [password[index], password[swapIndex]] = [password[swapIndex], password[index]];
  }
  return password.join('');
}

export function PasswordGenerator({ lang = 'pt' }) {
  const isEn = lang === 'en';
  const [length, setLength] = useState(18);
  const [options, setOptions] = useState({ lowercase: true, uppercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState(() => generatePassword(18, options));
  const [copied, setCopied] = useState(false);

  const regenerate = () => { setPassword(generatePassword(length, options)); setCopied(false); };
  const toggleOption = (key) => {
    const nextOptions = { ...options, [key]: !options[key] };
    if (!Object.values(nextOptions).some(Boolean)) return;
    setOptions(nextOptions);
    setPassword(generatePassword(length, nextOptions));
    setCopied(false);
  };
  const changeLength = (value) => { const nextLength = Number(value); setLength(nextLength); setPassword(generatePassword(nextLength, options)); setCopied(false); };
  const copyPassword = async () => {
    try { await navigator.clipboard.writeText(password); setCopied(true); } catch (_) { setCopied(false); }
  };

  const labels = {
    lowercase: isEn ? 'Lowercase' : 'Minúsculas',
    uppercase: isEn ? 'Uppercase' : 'Maiúsculas',
    numbers: isEn ? 'Numbers' : 'Números',
    symbols: isEn ? 'Symbols' : 'Símbolos'
  };

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60" aria-labelledby="password-generator-title">
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-500">gerador local</p>
            <h2 id="password-generator-title" className="mt-2 font-mono text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{isEn ? 'Password generator' : 'Gerador de senhas'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Create a strong password without sending it anywhere.' : 'Crie uma senha forte sem enviar nada para lugar nenhum.'}</p>
          </div>
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-500" aria-label={isEn ? 'Local processing' : 'Processamento local'} />
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_280px]">
        <div>
          <label htmlFor="generated-password" className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-500">{isEn ? 'Your password' : 'Sua senha'}</label>
          <div className="mt-3 flex min-h-28 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
            <input id="generated-password" value={password} readOnly aria-label={isEn ? 'Generated password' : 'Senha gerada'} className="w-full min-w-0 bg-transparent text-center font-mono text-xl font-bold tracking-wider text-zinc-900 outline-none dark:text-white sm:text-2xl" />
          </div>
          <button type="button" onClick={copyPassword} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 px-4 py-3 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-emerald-400">
            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{copied ? (isEn ? 'Copied' : 'Copiada') : (isEn ? 'Copy password' : 'Copiar senha')}
          </button>
          <p className="mt-3 flex items-center gap-2 text-xs text-zinc-500"><KeyRound className="h-3.5 w-3.5 text-emerald-500" />{isEn ? 'Generated only in this browser.' : 'Gerada somente neste navegador.'}</p>
        </div>

        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">{isEn ? 'Length' : 'Tamanho'} <span className="float-right font-mono text-emerald-500">{length}</span><input type="range" min="8" max="64" value={length} onChange={(event) => changeLength(event.target.value)} className="mt-3 w-full accent-emerald-500" /></label>
          <fieldset className="space-y-3">
            <legend className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">{isEn ? 'Include' : 'Incluir'}</legend>
            {Object.keys(characterSets).map((key) => <label key={key} className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400"><input type="checkbox" checked={options[key]} onChange={() => toggleOption(key)} className="h-4 w-4 accent-emerald-500" />{labels[key]}</label>)}
          </fieldset>
          <button type="button" onClick={regenerate} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"><RefreshCw className="h-4 w-4" />{isEn ? 'Generate another' : 'Gerar outra'}</button>
        </div>
      </div>
      <p className="border-t border-zinc-200 px-5 py-4 text-xs text-zinc-500 dark:border-zinc-800 sm:px-7" aria-live="polite">{copied ? (isEn ? 'Password copied to clipboard.' : 'Senha copiada para a área de transferência.') : (isEn ? 'Use a different password for every account.' : 'Use uma senha diferente em cada conta.')}</p>
    </section>
  );
}
