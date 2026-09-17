import React, { useEffect, useRef, useState } from 'react';
import { AudioLines, Download, FileAudio, Play, RefreshCw, ShieldCheck, Upload } from 'lucide-react';

function formatDuration(seconds) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

function writeString(view, offset, value) {
  [...value].forEach((character, index) => view.setUint8(offset + index, character.charCodeAt(0)));
}

function encodeWav(audioBuffer) {
  const channels = audioBuffer.numberOfChannels;
  const samples = audioBuffer.length;
  const view = new DataView(new ArrayBuffer(44 + samples * channels * 2));
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples * channels * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples * channels * 2, true);
  let offset = 44;
  for (let sample = 0; sample < samples; sample += 1) {
    for (let channel = 0; channel < channels; channel += 1) {
      const value = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[sample]));
      view.setInt16(offset, value < 0 ? value * 0x8000 : value * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([view], { type: 'audio/wav' });
}

async function masterAudio(file, intensity) {
  const context = new AudioContext();
  try {
    const sourceBuffer = await context.decodeAudioData(await file.arrayBuffer());
    const offline = new OfflineAudioContext(sourceBuffer.numberOfChannels, sourceBuffer.length, sourceBuffer.sampleRate);
    const source = offline.createBufferSource();
    const compressor = offline.createDynamicsCompressor();
    const gain = offline.createGain();
    compressor.threshold.value = -24 + intensity * 0.08;
    compressor.knee.value = 18;
    compressor.ratio.value = 2 + intensity * 0.04;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    gain.gain.value = 1 + intensity * 0.004;
    source.buffer = sourceBuffer;
    source.connect(compressor).connect(gain).connect(offline.destination);
    source.start();
    return { sourceBuffer, rendered: await offline.startRendering() };
  } finally {
    await context.close();
  }
}

export function AudioMasterizer({ lang = 'pt' }) {
  const isEn = lang === 'en';
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [result, setResult] = useState(null);
  const [intensity, setIntensity] = useState(55);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => { if (originalUrl) URL.revokeObjectURL(originalUrl); }, [originalUrl]);
  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result]);

  const selectFile = (nextFile) => {
    if (!nextFile) return;
    if (!nextFile.type.startsWith('audio/')) return setError(isEn ? 'Choose an audio file.' : 'Escolha um arquivo de áudio.');
    if (nextFile.size > 100 * 1024 * 1024) return setError(isEn ? 'The limit is 100 MB.' : 'O limite é de 100 MB.');
    setError('');
    setFile(nextFile);
    setOriginalUrl(URL.createObjectURL(nextFile));
    setResult(null);
  };

  const process = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      const { sourceBuffer, rendered } = await masterAudio(file, intensity);
      const blob = encodeWav(rendered);
      setResult({ url: URL.createObjectURL(blob), name: `${file.name.replace(/\.[^.]+$/, '')}-masterizado.wav`, size: blob.size, duration: sourceBuffer.duration });
    } catch (processingError) {
      setError(processingError.message || (isEn ? 'Audio processing failed.' : 'Não foi possível processar o áudio.'));
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setOriginalUrl(''); setResult(null); setError(''); if (inputRef.current) inputRef.current.value = ''; };

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60" aria-labelledby="audio-masterizer-title">
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-7">
        <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-500">masterizador local</p><h2 id="audio-masterizer-title" className="mt-2 font-mono text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{isEn ? 'Audio masterizer' : 'Masterizador de áudio'}</h2><p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Balance volume and dynamics without uploading your audio.' : 'Equilibre volume e dinâmica sem enviar seu áudio para lugar nenhum.'}</p></div><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-500" aria-label={isEn ? 'Local processing' : 'Processamento local'} /></div>
      </div>
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_280px]">
        <div>
          <input ref={inputRef} type="file" accept="audio/*" className="sr-only" onChange={(event) => selectFile(event.target.files?.[0])} />
          {!file ? <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]); }} className="flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center transition-colors hover:border-emerald-500 hover:bg-emerald-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-950/50"><Upload className="mb-3 h-7 w-7 text-emerald-500" /><span className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-200">{isEn ? '1. Choose or drop an audio file' : '1. Escolha ou arraste um áudio'}</span><span className="mt-2 text-xs text-zinc-500">MP3, WAV, OGG ou M4A · até 100 MB</span></button> : <div className="space-y-4"><div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"><div className="flex items-center gap-3"><FileAudio className="h-5 w-5 shrink-0 text-emerald-500" /><div className="min-w-0"><p className="truncate text-sm font-bold text-zinc-800 dark:text-zinc-200">{file.name}</p><p className="mt-1 text-xs text-zinc-500">{formatDuration(result?.duration || 0)} · {(file.size / 1024 / 1024).toFixed(2)} MB</p></div></div><audio className="mt-4 w-full" controls src={originalUrl} aria-label={isEn ? 'Original audio' : 'Áudio original'} /></div>{result && <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4"><div className="flex items-center gap-2"><AudioLines className="h-4 w-4 text-emerald-500" /><p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-500">{isEn ? 'Mastered preview' : 'Prévia masterizada'}</p></div><audio className="mt-4 w-full" controls src={result.url} aria-label={isEn ? 'Mastered audio' : 'Áudio masterizado'} /></div>}<button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"><RefreshCw className="h-3.5 w-3.5" />{isEn ? 'Choose another' : 'Trocar áudio'}</button></div>}
          {error && <p role="alert" className="mt-3 text-xs font-semibold text-red-500">{error}</p>}
        </div>
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-500">2. {isEn ? 'Set intensity' : 'Ajuste a intensidade'}</p><label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">{isEn ? 'Processing' : 'Processamento'}<input type="range" min="0" max="100" value={intensity} onChange={(event) => { setIntensity(Number(event.target.value)); setResult(null); }} className="mt-3 w-full accent-emerald-500" /><span className="mt-1 block text-right font-mono text-[11px] text-zinc-500">{intensity}%</span></label><div className="border-t border-zinc-200 pt-5 dark:border-zinc-800"><p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">3. {isEn ? 'Listen and download' : 'Ouça e baixe'}</p><button type="button" disabled={!file || processing || Boolean(result)} onClick={process} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40">{processing ? (isEn ? 'Mastering…' : 'Masterizando…') : result ? (isEn ? 'Audio generated' : 'Áudio gerado') : (isEn ? 'Master audio' : 'Masterizar áudio')}</button>{result && <a href={result.url} download={result.name} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 px-4 py-3 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-emerald-400"><Download className="h-4 w-4" />{isEn ? 'Download WAV' : 'Baixar WAV'}</a>}</div></div>
      </div>
    </section>
  );
}
