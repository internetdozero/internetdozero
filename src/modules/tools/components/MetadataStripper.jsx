import React, { useEffect, useRef, useState } from 'react';
import { Download, FileImage, RefreshCw, ShieldCheck, ShieldOff, Upload } from 'lucide-react';

const supportedTypes = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const sourceUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(sourceUrl); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(sourceUrl); reject(new Error('Não foi possível ler esta imagem.')); };
    image.src = sourceUrl;
  });
}

async function hasMetadata(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (file.type === 'image/jpeg') {
    for (let offset = 2; offset + 1 < bytes.length;) {
      if (bytes[offset] !== 0xff) { offset += 1; continue; }
      const marker = bytes[offset + 1];
      if (marker === 0xda) break;
      if ([0xe1, 0xe2, 0xed].includes(marker)) return true;
      const length = (bytes[offset + 2] << 8) + bytes[offset + 3];
      offset += marker === 0xd8 || marker === 0xd9 ? 2 : length + 2;
    }
    return false;
  }
  if (file.type === 'image/png') {
    for (let offset = 8; offset + 8 < bytes.length;) {
      const length = new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(0);
      const type = String.fromCharCode(...bytes.slice(offset + 4, offset + 8));
      if (['eXIf', 'tEXt', 'iTXt', 'zTXt', 'iCCP'].includes(type)) return true;
      offset += length + 12;
    }
    return false;
  }
  if (file.type === 'image/webp' && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF') {
    for (let offset = 12; offset + 4 <= bytes.length;) {
      const type = String.fromCharCode(...bytes.slice(offset, offset + 4));
      if (['EXIF', 'XMP ', 'ICCP'].includes(type)) return true;
      const length = new DataView(bytes.buffer, bytes.byteOffset + offset + 4, 4).getUint32(0, true);
      offset += 8 + length + (length % 2);
    }
  }
  return false;
}

export function MetadataStripper({ lang = 'pt' }) {
  const isEn = lang === 'en';
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [metadataFound, setMetadataFound] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result]);

  const selectFile = (nextFile) => {
    if (!nextFile) return;
    if (!supportedTypes[nextFile.type]) return setError(isEn ? 'Choose a JPEG, PNG or WebP image.' : 'Escolha uma imagem JPEG, PNG ou WebP.');
    if (nextFile.size > 20 * 1024 * 1024) return setError(isEn ? 'The limit is 20 MB.' : 'O limite é de 20 MB.');
    setError('');
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setResult(null);
    setMetadataFound(null);
    hasMetadata(nextFile).then(setMetadataFound).catch(() => setMetadataFound(false));
  };

  const stripMetadata = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      const image = await readImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext('2d').drawImage(image, 0, 0);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, file.type, file.type === 'image/png' ? undefined : 0.95));
      if (!blob) throw new Error('Não foi possível limpar os metadados.');
      const extension = supportedTypes[file.type];
      setResult({ url: URL.createObjectURL(blob), name: `${file.name.replace(/\.[^.]+$/, '')}-sem-metadados.${extension}`, size: blob.size, width: canvas.width, height: canvas.height });
    } catch (stripError) {
      setError(stripError.message || (isEn ? 'Metadata removal failed.' : 'Não foi possível remover os metadados.'));
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setPreviewUrl(''); setResult(null); setMetadataFound(null); setError(''); if (inputRef.current) inputRef.current.value = ''; };
  const chooseAnother = () => { reset(); inputRef.current?.click(); };

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60" aria-labelledby="metadata-stripper-title">
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-500">privacidade local</p><h2 id="metadata-stripper-title" className="mt-2 font-mono text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{isEn ? 'Metadata remover' : 'Removedor de metadados'}</h2><p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{isEn ? 'Remove GPS, camera and date data before you share.' : 'Remova GPS, câmera e data antes de compartilhar.'}</p></div><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-500" aria-label={isEn ? 'Local processing' : 'Processamento local'} /></div></div>
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_280px]">
        <div><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => selectFile(event.target.files?.[0])} />{!file ? <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]); }} className="flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center transition-colors hover:border-emerald-500 hover:bg-emerald-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-950/50"><Upload className="mb-3 h-7 w-7 text-emerald-500" /><span className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-200">{isEn ? '1. Choose or drop an image' : '1. Escolha ou arraste uma imagem'}</span><span className="mt-2 text-xs text-zinc-500">JPEG, PNG ou WebP · até 20 MB</span></button> : <div className="space-y-4"><div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800"><div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800"><FileImage className="h-4 w-4 text-emerald-500" /><span className="min-w-0 truncate text-xs text-zinc-600 dark:text-zinc-400">{file.name} · {formatBytes(file.size)}</span></div><div className={result ? 'grid gap-px bg-zinc-200 sm:grid-cols-2 dark:bg-zinc-800' : ''}><div className="bg-zinc-100 dark:bg-zinc-950">{result && <p className="border-b border-zinc-200 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500 dark:border-zinc-800">{isEn ? 'Original' : 'Original'}</p>}<img src={previewUrl} alt={isEn ? 'Original image preview' : 'Prévia da imagem original'} width="1200" height="896" className="max-h-80 w-full object-contain" /></div>{result && <div className="bg-zinc-100 dark:bg-zinc-950"><p className="border-b border-zinc-200 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-500 dark:border-zinc-800">{isEn ? 'Clean preview' : 'Prévia limpa'}</p><img src={result.url} alt={isEn ? 'Image preview without metadata' : 'Prévia da imagem sem metadados'} width={result.width} height={result.height} className="max-h-80 w-full object-contain" /></div>}</div></div><button type="button" onClick={chooseAnother} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"><RefreshCw className="h-3.5 w-3.5" />{isEn ? 'Choose another' : 'Trocar imagem'}</button></div>}{error && <p role="alert" className="mt-3 text-xs font-semibold text-red-500">{error}</p>}</div>
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50"><div className="flex items-start gap-3"><ShieldOff className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /><div className="space-y-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400"><p>{isEn ? 'The new file keeps the pixels and loses embedded metadata.' : 'O novo arquivo mantém os pixels e remove os metadados embutidos.'}</p>{metadataFound === null ? <p className="font-semibold text-zinc-400">{isEn ? 'Checking embedded metadata…' : 'Verificando metadados embutidos…'}</p> : <p className={`font-semibold ${metadataFound ? 'text-amber-500' : 'text-emerald-500'}`}>{metadataFound ? (isEn ? 'Embedded metadata found. It will be removed.' : 'Metadados embutidos encontrados. Eles serão removidos.') : (isEn ? 'No known metadata found. A clean copy will still be created.' : 'Nenhum metadado conhecido encontrado. Ainda criaremos uma cópia limpa.')}</p>}</div></div><div className="border-t border-zinc-200 pt-5 dark:border-zinc-800"><p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">2. {isEn ? 'Create clean copy' : 'Crie uma cópia limpa'}</p><button type="button" disabled={!file || processing || Boolean(result) || metadataFound === null} onClick={stripMetadata} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40">{processing ? (isEn ? 'Cleaning…' : 'Limpando…') : result ? (isEn ? 'Clean copy created' : 'Cópia limpa criada') : (isEn ? 'Remove metadata' : 'Remover metadados')}</button>{result && <><p className="mt-3 text-xs text-zinc-500">{formatBytes(file.size)} → {formatBytes(result.size)} · {result.width} × {result.height}px</p><a href={result.url} download={result.name} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 px-4 py-3 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-emerald-400"><Download className="h-4 w-4" />{isEn ? 'Download clean copy' : 'Baixar cópia limpa'}</a></>}</div></div>
      </div>
    </section>
  );
}
