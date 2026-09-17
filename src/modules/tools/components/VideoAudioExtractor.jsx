import React, { useEffect, useRef, useState } from 'react';
import { Download, FileVideo, RefreshCw, ShieldCheck, Upload } from 'lucide-react';

export function VideoAudioExtractor({ lang = 'pt' }) {
  const isEn = lang === 'en';
  const inputRef = useRef(null);
  const ffmpegRef = useRef(null);
  const progressHandlerRef = useRef(false);
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [loadingEngine, setLoadingEngine] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }, [videoUrl]);
  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result]);

  const selectFile = (nextFile) => {
    if (!nextFile) return;
    if (!nextFile.type.startsWith('video/')) return setError(isEn ? 'Choose a video file.' : 'Escolha um arquivo de vídeo.');
    if (nextFile.size > 200 * 1024 * 1024) return setError(isEn ? 'The limit is 200 MB.' : 'O limite é de 200 MB.');
    setError(''); setFile(nextFile); setVideoUrl(URL.createObjectURL(nextFile)); setResult(null); setProgress(0);
  };

  const extract = async () => {
    if (!file) return;
    setProcessing(true); setError('');
    let inputName = 'input';
    try {
      const [{ FFmpeg }, { fetchFile }] = await Promise.all([import('@ffmpeg/ffmpeg'), import('@ffmpeg/util')]);
      const ffmpeg = ffmpegRef.current || new FFmpeg();
      ffmpegRef.current = ffmpeg;
      if (!progressHandlerRef.current) {
        ffmpeg.on('progress', ({ progress }) => setProgress(Math.min(99, Math.round(progress * 100))));
        progressHandlerRef.current = true;
      }
      if (!ffmpeg.loaded) {
        setLoadingEngine(true);
        await ffmpeg.load({
          coreURL: '/ffmpeg/ffmpeg-core.js',
          wasmURL: '/ffmpeg/ffmpeg-core.wasm'
        });
        setLoadingEngine(false);
      }
      inputName = `input.${file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '') || 'bin'}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      const exitCode = await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'pcm_s16le', 'output.wav']);
      if (exitCode !== 0) throw new Error(isEn ? 'This video could not be read.' : 'Não foi possível ler este vídeo.');
      const data = await ffmpeg.readFile('output.wav');
      const blob = new Blob([data.buffer], { type: 'audio/wav' });
      setProgress(100);
      setResult({ url: URL.createObjectURL(blob), name: `${file.name.replace(/\.[^.]+$/, '')}-audio.wav`, size: blob.size });
    } catch (extractError) {
      setLoadingEngine(false); setProgress(0);
      setError(extractError.message || (isEn ? 'Audio extraction failed. Check your connection on the first use.' : 'Não foi possível extrair o áudio. Na primeira utilização, verifique sua conexão.'));
    } finally {
      const ffmpeg = ffmpegRef.current;
      if (ffmpeg) {
        try { await ffmpeg.deleteFile(inputName); } catch {}
        try { await ffmpeg.deleteFile('output.wav'); } catch {}
      }
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setVideoUrl(''); setResult(null); setError(''); if (inputRef.current) inputRef.current.value = ''; };
  const chooseAnother = () => { reset(); inputRef.current?.click(); };

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60" aria-labelledby="video-audio-extractor-title">
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-500">extração local</p><h2 id="video-audio-extractor-title" className="mt-2 font-mono text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{isEn ? 'Video audio extractor' : 'Extrator de áudio de vídeo'}</h2><p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Keep the sound from a video as a WAV file.' : 'Fique com o som de um vídeo em um arquivo WAV.'}</p></div><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-500" aria-label={isEn ? 'Local processing' : 'Processamento local'} /></div></div>
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0"><input ref={inputRef} type="file" accept="video/*" className="sr-only" onChange={(event) => selectFile(event.target.files?.[0])} />{!file ? <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]); }} className="flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center transition-colors hover:border-emerald-500 hover:bg-emerald-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-950/50"><Upload className="mb-3 h-7 w-7 text-emerald-500" /><span className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-200">{isEn ? '1. Choose or drop a video' : '1. Escolha ou arraste um vídeo'}</span><span className="mt-2 text-xs text-zinc-500">MP4, WebM, MOV ou OGG · até 200 MB</span></button> : <div className="space-y-4"><div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800"><div className="flex items-center gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800"><FileVideo className="h-5 w-5 shrink-0 text-emerald-500" /><span className="min-w-0 truncate text-xs text-zinc-600 dark:text-zinc-400">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</span></div><video controls src={videoUrl} className="max-h-72 w-full bg-zinc-950" aria-label={isEn ? 'Original video' : 'Vídeo original'} /></div>{result && <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-500">{isEn ? 'Extracted audio' : 'Áudio extraído'}</p><audio className="mt-4 w-full" controls src={result.url} aria-label={isEn ? 'Extracted audio' : 'Áudio extraído'} /></div>}<button type="button" onClick={chooseAnother} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"><RefreshCw className="h-3.5 w-3.5" />{isEn ? 'Choose another' : 'Trocar vídeo'}</button></div>}{error && <p role="alert" className="mt-3 text-xs font-semibold text-red-500">{error}</p>}</div>
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /><p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Your video stays in this browser. The file is processed directly, without playing the whole video.' : 'Seu vídeo fica neste navegador. O arquivo é processado diretamente, sem reproduzir o vídeo inteiro.'}</p></div>{processing && <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3" role="status" aria-live="polite"><div className="flex items-center justify-between gap-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><span>{loadingEngine ? (isEn ? 'Loading converter…' : 'Carregando conversor…') : (isEn ? 'Extracting audio…' : 'Extraindo áudio…')}</span>{!loadingEngine && <span className="font-mono tabular-nums">{progress}%</span>}</div>{!loadingEngine && <div className="mt-2 h-2 overflow-hidden rounded-full bg-emerald-500/15"><div className="h-full rounded-full bg-emerald-500 transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>}<p className="mt-2 text-[11px] text-zinc-500">{loadingEngine ? (isEn ? 'The converter is downloaded only on first use.' : 'O conversor é baixado apenas na primeira utilização.') : (isEn ? 'Keep this tab open until it finishes.' : 'Mantenha esta aba aberta até terminar.')}</p></div>}<div className="border-t border-zinc-200 pt-5 dark:border-zinc-800"><p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">2. {isEn ? 'Create audio file' : 'Gere o arquivo de áudio'}</p><button type="button" disabled={!file || processing || Boolean(result)} onClick={extract} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40">{processing ? (loadingEngine ? (isEn ? 'Loading converter…' : 'Carregando conversor…') : (isEn ? 'Extracting…' : 'Extraindo…')) : result ? (isEn ? 'Audio created' : 'Áudio criado') : (isEn ? 'Extract audio' : 'Extrair áudio')}</button>{result && <><p className="mt-3 text-xs text-zinc-500">WAV · {(result.size / 1024 / 1024).toFixed(2)} MB</p><a href={result.url} download={result.name} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 px-4 py-3 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-emerald-400"><Download className="h-4 w-4" />{isEn ? 'Download WAV' : 'Baixar WAV'}</a></>}</div></div>
      </div>
    </section>
  );
}
