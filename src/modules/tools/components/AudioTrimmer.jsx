import React, { useEffect, useRef, useState } from 'react';
import { Download, FileAudio, RefreshCw, ShieldCheck, Upload } from 'lucide-react';
import { encodeWav } from './AudioMasterizer';

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

async function decodeAudio(file) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) throw new Error('Seu navegador não suporta processamento de áudio.');
  const context = new AudioContextClass();
  try {
    const audioData = await file.arrayBuffer();
    return await new Promise((resolve, reject) => context.decodeAudioData(audioData, resolve, reject));
  } finally { await context.close(); }
}

export function AudioTrimmer({ lang = 'pt' }) {
  const isEn = lang === 'en';
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [result, setResult] = useState(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => { if (originalUrl) URL.revokeObjectURL(originalUrl); }, [originalUrl]);
  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result]);

  const selectFile = async (nextFile) => {
    if (!nextFile) return;
    if (!nextFile.type.startsWith('audio/')) return setError(isEn ? 'Choose an audio file.' : 'Escolha um arquivo de áudio.');
    if (nextFile.size > 100 * 1024 * 1024) return setError(isEn ? 'The limit is 100 MB.' : 'O limite é de 100 MB.');
    setError(''); setLoading(true); setFile(nextFile); setResult(null); setBuffer(null); setOriginalUrl(URL.createObjectURL(nextFile));
    try { const decoded = await decodeAudio(nextFile); setBuffer(decoded); setEnd(decoded.duration); } catch (_) { setError(isEn ? 'This audio could not be read.' : 'Não foi possível ler este áudio.'); } finally { setLoading(false); }
  };

  const trim = async () => {
    if (!buffer || end <= start) return;
    setProcessing(true); setError('');
    try {
      const startSample = Math.floor(start * buffer.sampleRate);
      const endSample = Math.min(buffer.length, Math.ceil(end * buffer.sampleRate));
      const output = new OfflineAudioContext(buffer.numberOfChannels, endSample - startSample, buffer.sampleRate);
      const source = output.createBufferSource(); source.buffer = buffer; source.connect(output.destination); source.start(0, start, end - start);
      const rendered = await output.startRendering();
      const blob = encodeWav(rendered);
      setResult({ url: URL.createObjectURL(blob), name: `${file.name.replace(/\.[^.]+$/, '')}-cortado.wav`, duration: end - start, size: blob.size });
    } catch (trimError) { setError(trimError.message || (isEn ? 'Trimming failed.' : 'Não foi possível cortar o áudio.')); } finally { setProcessing(false); }
  };

  const reset = () => { setFile(null); setBuffer(null); setOriginalUrl(''); setResult(null); setStart(0); setEnd(0); setError(''); if (inputRef.current) inputRef.current.value = ''; };
  const chooseAnother = () => { reset(); inputRef.current?.click(); };

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60" aria-labelledby="audio-trimmer-title">
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">edição local</p><h2 id="audio-trimmer-title" className="mt-2 font-mono text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{isEn ? 'Audio trimmer' : 'Cortador de áudio'}</h2><p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Keep only the part you need, right in your browser.' : 'Fique só com o trecho que precisa, direto no navegador.'}</p></div><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-stone-500" aria-label={isEn ? 'Local processing' : 'Processamento local'} /></div></div>
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_280px]">
        <div><input ref={inputRef} type="file" accept="audio/*" className="sr-only" onChange={(event) => selectFile(event.target.files?.[0])} />{!file ? <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]); }} className="flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center transition-colors hover:border-stone-500 hover:bg-stone-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 dark:border-zinc-700 dark:bg-zinc-950/50"><Upload className="mb-3 h-7 w-7 text-stone-500" /><span className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-200">{isEn ? '1. Choose or drop an audio file' : '1. Escolha ou arraste um áudio'}</span><span className="mt-2 text-xs text-zinc-500">MP3, WAV, OGG ou M4A · até 100 MB</span></button> : <div className="space-y-4"><div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"><div className="flex items-center gap-3"><FileAudio className="h-5 w-5 shrink-0 text-stone-500" /><div className="min-w-0"><p className="truncate text-sm font-bold text-zinc-800 dark:text-zinc-200">{file.name}</p><p className="mt-1 text-xs text-zinc-500">{loading ? (isEn ? 'Reading…' : 'Lendo…') : `${formatTime(buffer?.duration || 0)} · ${(file.size / 1024 / 1024).toFixed(2)} MB`}</p></div></div><audio className="mt-4 w-full" controls src={originalUrl} aria-label={isEn ? 'Original audio' : 'Áudio original'} /></div>{result && <div className="rounded-2xl border border-stone-500/30 bg-stone-500/5 p-4"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500">{isEn ? 'Trimmed preview' : 'Prévia do trecho'}</p><audio className="mt-4 w-full" controls src={result.url} aria-label={isEn ? 'Trimmed audio' : 'Áudio cortado'} /></div>}<button type="button" onClick={chooseAnother} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"><RefreshCw className="h-3.5 w-3.5" />{isEn ? 'Choose another' : 'Trocar áudio'}</button></div>}{error && <p role="alert" className="mt-3 text-xs font-semibold text-red-500">{error}</p>}</div>
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500">2. {isEn ? 'Choose the excerpt' : 'Escolha o trecho'}</p><label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">{isEn ? 'Start' : 'Começo'}<input type="number" min="0" max={Math.max(0, end - 0.01)} step="0.1" value={start} onChange={(event) => { setStart(Math.max(0, Number(event.target.value))); setResult(null); }} className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-800 outline-none focus:border-stone-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200" /></label><label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">{isEn ? 'End' : 'Fim'}<input type="number" min={Math.min(start + 0.1, end || 0.1)} max={buffer?.duration || 0} step="0.1" value={end} onChange={(event) => { setEnd(Math.min(buffer?.duration || 0, Number(event.target.value))); setResult(null); }} className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-800 outline-none focus:border-stone-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200" /></label><div className="border-t border-zinc-200 pt-5 dark:border-zinc-800"><p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">3. {isEn ? 'Create the clip' : 'Gere o corte'}</p><button type="button" disabled={!buffer || loading || processing || end <= start || Boolean(result)} onClick={trim} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-500 px-4 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 disabled:cursor-not-allowed disabled:opacity-40">{processing ? (isEn ? 'Cutting…' : 'Cortando…') : result ? (isEn ? 'Clip created' : 'Corte criado') : (isEn ? 'Cut audio' : 'Cortar áudio')}</button>{result && <a href={result.url} download={result.name} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-stone-500/40 px-4 py-3 text-sm font-bold text-stone-600 transition-colors hover:bg-stone-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 dark:text-stone-400"><Download className="h-4 w-4" />{isEn ? 'Download WAV' : 'Baixar WAV'}</a>}</div></div>
      </div>
    </section>
  );
}
