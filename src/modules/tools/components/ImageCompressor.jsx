import React, { useEffect, useRef, useState } from 'react';
import { Download, FileImage, RotateCcw, ShieldCheck, Upload } from 'lucide-react';

const formats = { webp: 'image/webp', jpeg: 'image/jpeg', png: 'image/png' };

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(objectUrl); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Não foi possível ler esta imagem.')); };
    image.src = objectUrl;
  });
}

export function ImageCompressor({ lang = 'pt' }) {
  const isEn = lang === 'en';
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [format, setFormat] = useState('webp');
  const [quality, setQuality] = useState(0.8);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result]);

  const selectFile = (nextFile) => {
    if (!nextFile) return;
    if (!nextFile.type.startsWith('image/')) return setError(isEn ? 'Choose an image file.' : 'Escolha um arquivo de imagem.');
    if (nextFile.size > 20 * 1024 * 1024) return setError(isEn ? 'The limit is 20 MB.' : 'O limite é de 20 MB.');
    setError('');
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setResult(null);
  };

  const changeFormat = (nextFormat) => {
    setFormat(nextFormat);
    setResult(null);
  };

  const changeQuality = (nextQuality) => {
    setQuality(Number(nextQuality));
    setResult(null);
  };

  const downloadResult = (event) => {
    event.preventDefault();
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const compress = async () => {
    if (!file) return;
    setIsCompressing(true);
    setError('');
    try {
      const image = await readImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext('2d').drawImage(image, 0, 0);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, formats[format], format === 'png' ? undefined : quality));
      if (!blob) throw new Error('Não foi possível comprimir esta imagem.');
      const extension = format === 'jpeg' ? 'jpg' : format;
      setResult({ blob, url: URL.createObjectURL(blob), size: blob.size, width: canvas.width, height: canvas.height, name: `${file.name.replace(/\.[^.]+$/, '')}.${extension}` });
    } catch (compressionError) {
      setError(compressionError.message || (isEn ? 'Compression failed.' : 'A compressão falhou.'));
    } finally {
      setIsCompressing(false);
    }
  };

  const reset = () => { setFile(null); setPreviewUrl(''); setResult(null); setError(''); if (inputRef.current) inputRef.current.value = ''; };
  const chooseAnother = () => { reset(); inputRef.current?.click(); };

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60" aria-labelledby="compressor-title">
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">compressor local</p>
            <h2 id="compressor-title" className="mt-2 font-mono text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{isEn ? 'Image compressor' : 'Compressor de imagens'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Make images lighter without sending them anywhere.' : 'Deixe suas imagens mais leves sem enviar nada para lugar nenhum.'}</p>
          </div>
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-stone-500" aria-label={isEn ? 'Local processing' : 'Processamento local'} />
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_280px]">
        <div>
          <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => selectFile(event.target.files?.[0])} />
          {!file ? (
            <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]); }} className="flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center transition-colors hover:border-stone-500 hover:bg-stone-500/5 dark:border-zinc-700 dark:bg-zinc-950/50 dark:hover:border-stone-500">
              <Upload className="mb-3 h-7 w-7 text-stone-500" />
              <span className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-200">{isEn ? '1. Choose or drop an image' : '1. Escolha ou arraste uma imagem'}</span>
              <span className="mt-2 text-xs text-zinc-500">PNG, JPEG ou WebP · até 20 MB</span>
            </button>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div className={result ? 'grid gap-px bg-zinc-200 sm:grid-cols-2 dark:bg-zinc-800' : ''}>
                <div className="bg-zinc-100 dark:bg-zinc-950">
                  {result && <p className="border-b border-zinc-200 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500 dark:border-zinc-800">{isEn ? 'Original' : 'Original'}</p>}
                  <img src={previewUrl} alt={isEn ? 'Original image preview' : 'Prévia da imagem original'} width="1200" height="896" className="max-h-80 w-full object-contain" />
                </div>
                {result && <div className="bg-zinc-100 dark:bg-zinc-950">
                  <p className="border-b border-zinc-200 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500 dark:border-zinc-800">{isEn ? 'Result preview' : 'Prévia do resultado'}</p>
                  <img src={result.url} alt={isEn ? 'Compressed image preview' : 'Prévia da imagem comprimida'} width={result.width} height={result.height} className="max-h-80 w-full object-contain" />
                </div>}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex min-w-0 items-center gap-2"><FileImage className="h-4 w-4 shrink-0 text-stone-500" /><span className="truncate text-xs text-zinc-600 dark:text-zinc-400">{file.name} · {formatBytes(file.size)}</span></div>
                <button type="button" onClick={chooseAnother} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-stone-500"><RotateCcw className="h-3.5 w-3.5" />{isEn ? 'Choose another' : 'Trocar imagem'}</button>
              </div>
            </div>
          )}
          {error && <p role="alert" className="mt-3 text-xs font-semibold text-red-500">{error}</p>}
        </div>

        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500">2. {isEn ? 'Adjust output' : 'Ajuste a saída'}</p>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">{isEn ? 'Output format' : 'Formato de saída'}<select value={format} onChange={(event) => changeFormat(event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-800 outline-none transition-colors focus:border-stone-500 focus-visible:ring-2 focus-visible:ring-stone-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"><option value="webp">WebP — menor arquivo</option><option value="jpeg">JPEG — compatível</option><option value="png">PNG — mantém transparência</option></select></label>
          <label className={`block text-xs font-semibold text-zinc-600 dark:text-zinc-400 ${format === 'png' ? 'opacity-50' : ''}`}>{isEn ? 'Quality' : 'Qualidade'}<input type="range" min="0.4" max="1" step="0.05" value={quality} disabled={format === 'png'} onChange={(event) => changeQuality(event.target.value)} className="mt-3 w-full accent-stone-500" /><span className="mt-1 block text-right font-mono text-[11px] text-zinc-500">{format === 'png' ? (isEn ? 'Not applicable' : 'Não se aplica') : `${Math.round(quality * 100)}%`}</span></label>
          <div className="border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">3. {isEn ? 'Generate file' : 'Gere o arquivo'}</p>
            <button type="button" disabled={!file || isCompressing || Boolean(result)} onClick={compress} className="w-full rounded-xl bg-stone-500 px-4 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-40">{isCompressing ? (isEn ? 'Compressing…' : 'Comprimindo…') : result ? (isEn ? 'File generated' : 'Arquivo gerado') : (isEn ? 'Compress and generate' : 'Comprimir e gerar')}</button>
            {result && <a href={result.url} download={result.name} onClick={downloadResult} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-stone-500/40 px-4 py-3 text-sm font-bold text-stone-600 transition-colors hover:bg-stone-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 dark:text-stone-400"><Download className="h-4 w-4" />{isEn ? 'Download result' : 'Baixar resultado'}</a>}
          </div>
        </div>
      </div>
      {result && <div className="border-t border-zinc-200 px-5 py-4 text-xs text-zinc-500 dark:border-zinc-800 sm:px-7"><strong className={result.size < file.size ? 'text-stone-500' : result.size > file.size ? 'text-amber-500' : 'text-zinc-500'}>{result.size < file.size ? `${Math.round((1 - result.size / file.size) * 100)}% menor` : result.size > file.size ? `${Math.round((result.size / file.size - 1) * 100)}% maior` : 'Mesmo tamanho'}</strong> · {formatBytes(file.size)} → {formatBytes(result.size)} · {result.width} × {result.height}px</div>}
    </section>
  );
}
