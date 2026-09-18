import React, { useState, useRef, useCallback } from 'react';
import { RefreshCw, Download, FileUp, ShieldCheck, AlertCircle, ArrowRight, RotateCcw, Check } from 'lucide-react';
import { getConversionOptions, executeConversion, getFileExtension } from '../utils/conversionEngine';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function FileConverter({ lang = 'pt' }) {
  const isEn = lang === 'en';
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [conversionInfo, setConversionInfo] = useState(null);
  const [targetExt, setTargetExt] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedBlob, setConvertedBlob] = useState(null);
  const [error, setError] = useState('');

  const handleSelectFile = useCallback((selectedFile) => {
    if (!selectedFile) return;
    setError('');
    setConvertedBlob(null);

    const options = getConversionOptions(selectedFile.name);
    if (!options || !options.targets || options.targets.length === 0) {
      const ext = getFileExtension(selectedFile.name);
      setError(isEn ? `Extension .${ext} is not supported yet for local conversion.` : `A extensão .${ext} ainda não é suportada para conversão local.`);
      setFile(null);
      setConversionInfo(null);
      return;
    }

    setFile(selectedFile);
    setConversionInfo(options);
    setTargetExt(options.targets[0]);
  }, [isEn]);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file || !targetExt || !conversionInfo) return;
    setIsConverting(true);
    setError('');
    try {
      const resultBlob = await executeConversion(file, targetExt, conversionInfo.category);
      setConvertedBlob(resultBlob);
    } catch (err) {
      setError(err.message || (isEn ? 'Conversion error.' : 'Erro ao converter o arquivo.'));
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedBlob || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const downloadName = `${baseName}.${targetExt}`;
    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const handleReset = () => {
    setFile(null);
    setConversionInfo(null);
    setTargetExt('');
    setConvertedBlob(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs">
        <div className="flex items-center gap-3 text-xs font-mono text-stone-600 dark:text-stone-400 mb-6">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>{isEn ? '100% In-Browser Conversion — Zero server uploads' : 'Conversão 100% no navegador — Nenhum arquivo é enviado para servidores'}</span>
        </div>

        {!file && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-10 text-center hover:border-stone-500 transition-colors"
          >
            <FileUp className="h-12 w-12 mx-auto text-zinc-400 dark:text-zinc-600 mb-4" />
            <p className="font-mono text-base font-bold text-zinc-900 dark:text-white mb-1">
              {isEn ? 'Drop any file to convert (Image, Data, Audio)' : 'Arraste qualquer arquivo para converter (Imagem, Dados, Áudio)'}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 font-mono">
              PNG, JPG, WebP, AVIF, JSON, CSV, YAML, XML, MD, TXT, MP3, WAV...
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => e.target.files && handleSelectFile(e.target.files[0])}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-stone-500 text-zinc-950 hover:bg-stone-400 transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className="h-4 w-4" />
              <span>{isEn ? 'Choose file to convert' : 'Escolher arquivo para converter'}</span>
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-3 text-xs font-mono">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {file && conversionInfo && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {isEn ? 'Selected file:' : 'Arquivo de origem:'}
                </p>
                <h3 className="font-mono text-base font-bold text-zinc-900 dark:text-white mt-0.5 truncate max-w-md">
                  {file.name}
                </h3>
                <p className="text-xs font-mono text-stone-600 dark:text-stone-400 mt-0.5">
                  .{conversionInfo.sourceExt.toUpperCase()} • {formatBytes(file.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{isEn ? 'Change file' : 'Trocar arquivo'}</span>
              </button>
            </div>

            {/* Target Extension Selector */}
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-3">
                {isEn ? 'Convert to format:' : 'Converter para a extensão:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {conversionInfo.targets.map((tgt) => {
                  const isSelected = targetExt === tgt;
                  return (
                    <button
                      key={tgt}
                      type="button"
                      onClick={() => { setTargetExt(tgt); setConvertedBlob(null); }}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-stone-500 text-zinc-950 border-stone-500 shadow-xs'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-stone-500/50'
                      }`}
                    >
                      .{tgt.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <span>.{conversionInfo.sourceExt}</span>
                <ArrowRight className="h-3.5 w-3.5 text-stone-500" />
                <span className="text-stone-600 dark:text-stone-400 font-bold">.{targetExt}</span>
              </div>

              {!convertedBlob ? (
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-stone-500 text-zinc-950 hover:bg-stone-400 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isConverting ? 'animate-spin' : ''}`} />
                  <span>{isConverting ? (isEn ? 'Converting...' : 'Convertendo...') : (isEn ? 'Convert File Now' : 'Converter Arquivo Agora')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-stone-500 text-zinc-950 hover:bg-stone-400 transition-all cursor-pointer shadow-xs animate-pulse"
                >
                  <Download className="h-4 w-4" />
                  <span>{isEn ? `Download .${targetExt.toUpperCase()} (${formatBytes(convertedBlob.size)})` : `Baixar .${targetExt.toUpperCase()} (${formatBytes(convertedBlob.size)})`}</span>
                </button>
              )}
            </div>

            {convertedBlob && (
              <div className="p-4 rounded-xl border border-stone-500/30 bg-stone-500/10 text-stone-700 dark:text-stone-300 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-stone-500" />
                  <span>{isEn ? 'File converted successfully!' : 'Arquivo convertido com sucesso!'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="underline font-bold hover:text-stone-900 dark:hover:text-white cursor-pointer"
                >
                  {isEn ? 'Click to download' : 'Clique para baixar'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
